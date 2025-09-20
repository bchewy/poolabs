#include <Arduino.h>

#include "esp_camera.h"
#include <WiFi.h>
#include <WiFiMulti.h>

#include <HTTPClient.h>
#include <ArduinoJson.h>
#include <NetworkClientSecure.h>

#include "board_config.h"
#include "base64.h"

// CONSTANTS
#define WIFI_SSID ""
#define WIFI_PASSWORD ""

#define API_ENDPOINT "https://poolabs.vercel.app/api/upload"

#define BUTTON_PIN 13 // 13 14 16
#define POWER_LED_PIN 33
#define FLASH_LED_PIN 4

#define TIMER_INTERVAL 30 // Picture intevals in minutes

// VARIABLES
int lastState = LOW;  // Set to, HIGH: released inital state | LOW: pressed inital state
int currentState;   


TaskHandle_t TimerTaskHandle = NULL;

void setup() {

  Serial.begin(115200);
  // Serial.setDebugOutput(true);

  // Initialize random seed for filename generation
  randomSeed(analogRead(0) + micros());

  // SETUP PINS
  pinMode(POWER_LED_PIN, OUTPUT);
  pinMode(FLASH_LED_PIN, OUTPUT);
  pinMode(BUTTON_PIN, INPUT_PULLUP);

  blink(5, 1);

  Serial.println();
  Serial.println();
  Serial.println();

  // SETUP WIFI
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  WiFi.setSleep(false);
  Serial.println("Connecting to WIFI");
  while(WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println(" connected");

  // SETUP CAMERA
  camera_config_t config;
  config.ledc_channel = LEDC_CHANNEL_0;
  config.ledc_timer = LEDC_TIMER_0;
  config.pin_d0 = Y2_GPIO_NUM;
  config.pin_d1 = Y3_GPIO_NUM;
  config.pin_d2 = Y4_GPIO_NUM;
  config.pin_d3 = Y5_GPIO_NUM;
  config.pin_d4 = Y6_GPIO_NUM;
  config.pin_d5 = Y7_GPIO_NUM;
  config.pin_d6 = Y8_GPIO_NUM;
  config.pin_d7 = Y9_GPIO_NUM;
  config.pin_xclk = XCLK_GPIO_NUM;
  config.pin_pclk = PCLK_GPIO_NUM;
  config.pin_vsync = VSYNC_GPIO_NUM;
  config.pin_href = HREF_GPIO_NUM;
  config.pin_sccb_sda = SIOD_GPIO_NUM;
  config.pin_sccb_scl = SIOC_GPIO_NUM;
  config.pin_pwdn = PWDN_GPIO_NUM;
  config.pin_reset = RESET_GPIO_NUM;
  config.xclk_freq_hz = 20000000;
  config.frame_size = FRAMESIZE_UXGA;
  config.pixel_format = PIXFORMAT_JPEG;  // for streaming
  //config.pixel_format = PIXFORMAT_RGB565; // for face detection/recognition
  config.grab_mode = CAMERA_GRAB_WHEN_EMPTY;
  config.fb_location = CAMERA_FB_IN_PSRAM;
  config.jpeg_quality = 12;
  config.fb_count = 1;

  // if PSRAM IC present, init with UXGA resolution and higher JPEG quality
  //                      for larger pre-allocated frame buffer.
  if (config.pixel_format == PIXFORMAT_JPEG) {
    if (psramFound()) {
      config.jpeg_quality = 10;
      config.fb_count = 2;
      config.grab_mode = CAMERA_GRAB_LATEST;
    } else {
      // Limit the frame size when PSRAM is not available
      config.frame_size = FRAMESIZE_SVGA;
      config.fb_location = CAMERA_FB_IN_DRAM;
    }
  } else {
    // Best option for face detection/recognition
    config.frame_size = FRAMESIZE_240X240;
  }

  // camera init
  esp_err_t err = esp_camera_init(&config);
  if (err != ESP_OK) {
    Serial.printf("Camera init failed with error 0x%x", err);
    return;
  }
  Serial.println("Camera initialised");

  sensor_t *s = esp_camera_sensor_get();

  // drop down frame size for higher initial frame rate
  if (config.pixel_format == PIXFORMAT_JPEG) {
    s->set_framesize(s, FRAMESIZE_QVGA);
  }

  // Create FreeRTOS task for periodic image capture
  xTaskCreate(
    timerTask,           // Task function
    "TimerTask",         // Name of task
    4096,                // Stack size (bytes)
    NULL,                // Parameter to pass to function
    1,                   // Task priority
    &TimerTaskHandle     // Task handle
  );

  if (TimerTaskHandle != NULL) {
    Serial.println("Timer task created successfully");
  } else {
    Serial.println("Failed to create timer task");
  }

  digitalWrite(POWER_LED_PIN, LOW);
  Serial.println("Setup Complete");
}

void captureImage(bool isFlushCheck) {
  digitalWrite(FLASH_LED_PIN, HIGH);
  delay(500);
  camera_fb_t * fb = NULL;
  // Take Picture with Camera
  fb = esp_camera_fb_get();
  digitalWrite(FLASH_LED_PIN, LOW);

  if(!fb) {
    Serial.println("Camera capture failed");
  } else {
    Serial.println("Camera captured");
    sendPayload(fb->buf, fb->len, isFlushCheck);
  }
    esp_camera_fb_return(fb); 
}

void sendPayload(const uint8_t *data, const size_t len, const bool isFlushCheck) {
  NetworkClientSecure *client = new NetworkClientSecure;
  if (client) {
    client->setInsecure(); 
    {
      // Add a scoping block for HTTPClient https to make sure it is destroyed before NetworkClientSecure *client is
      HTTPClient https;
      Serial.print("[HTTPS] begin...\n");
      if (https.begin(*client, API_ENDPOINT)) {  // HTTPS
        Serial.print("[HTTPS] POST...\n");
        // start connection and send HTTP header
        https.addHeader("Content-Type", "application/json");
        
        JsonDocument doc;
        String base64Image = base64::encode(data, len);
        String randomFilename = generateRandomFilename();
        doc["filename"] = randomFilename;
        doc["mimeType"] = "image/jpeg";
        doc["imageData"] = base64Image;
        doc["isFlushCheck"] = isFlushCheck;
        String output;
        serializeJson(doc, output);
        // Serial.println("----- BEGIN BASE64 IMAGE -----");
        // Serial.println(base64Image);
        // Serial.println("----- END BASE64 IMAGE -----");
        int httpCode = https.POST(output);

        // httpCode will be negative on error
        if (httpCode > 0) {
          // HTTP header has been send and Server response header has been handled
          Serial.printf("[HTTPS] POST... code: %d\n", httpCode);

          // file found at server
          if (httpCode == HTTP_CODE_OK || httpCode == HTTP_CODE_MOVED_PERMANENTLY) {
            String payload = https.getString();
            Serial.println(payload);
          }
        } else {
          Serial.printf("[HTTPS] POST... failed, error: %s\n", https.errorToString(httpCode).c_str());
        }

        https.end();
      } else {
        Serial.printf("[HTTPS] Unable to connect\n");
      }

      // End extra scoping block
    }

    delete client;
  } else {
    Serial.println("Unable to create client");
  }
}

// FreeRTOS task to capture image every X minutes
void timerTask(void * parameter) {
  const TickType_t xDelay = pdMS_TO_TICKS(TIMER_INTERVAL * 60 * 1000); // minutes in ticks
  
  // Wait for the first interval before starting captures
  Serial.printf("Timer task started. First capture will be in %d minutes.\n", TIMER_INTERVAL);
  vTaskDelay(xDelay);
  
  for(;;) {
    Serial.println("Timer task: Capturing image...");
    captureImage(true);
    vTaskDelay(xDelay);
  }
}

void loop() {
  currentState = digitalRead(BUTTON_PIN);
  if (lastState == HIGH && currentState == LOW) {
    Serial.println("The button is pressed");
      captureImage(false);
  }
  // if (lastState == LOW && currentState == HIGH) {
  //   Serial.println("The button is released");
  //   captureImage();
  // }
  // save the the last state
  lastState = currentState;
}

// Generate random filename with timestamp and random characters
String generateRandomFilename() {
  String filename = "poo_cam_";
  
  // Add timestamp (millis since boot)
  filename += String(millis());
  filename += "_";
  
  // Add random characters
  const char chars[] = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  for (int i = 0; i < 4; i++) {
    filename += chars[random(0, 36)];
  }
  
  filename += ".jpg";
  return filename;
}

void blink(int ms, int count) {
  for (int i = 0; i < count; i++) {
    digitalWrite(POWER_LED_PIN, LOW); // On Power LED
    digitalWrite(FLASH_LED_PIN, HIGH); // On Flash LED
    delay(ms);
    digitalWrite(POWER_LED_PIN, HIGH);
    digitalWrite(FLASH_LED_PIN, LOW);
  }
}
