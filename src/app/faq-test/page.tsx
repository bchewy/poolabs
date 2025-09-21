"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function FAQTest() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    console.log("Toggle FAQ called with index:", index);
    setOpenIndex(openIndex === index ? null : index);
  };

  const testFaqs = [
    {
      question: "Test Question 1",
      answer: "This is a test answer to see if the click handler works."
    },
    {
      question: "Test Question 2",
      answer: "Another test answer to verify the functionality."
    }
  ];

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-8">FAQ Test Page</h1>
      <div className="space-y-4 max-w-2xl">
        {testFaqs.map((faq, index) => (
          <div key={index} className="border rounded-lg p-4">
            <button
              onClick={() => toggleFAQ(index)}
              className="w-full flex justify-between items-center"
            >
              <span className="font-semibold">{faq.question}</span>
              {openIndex === index ? <ChevronUp /> : <ChevronDown />}
            </button>
            {openIndex === index && (
              <div className="mt-4 text-gray-600">
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="mt-8 p-4 bg-gray-100 rounded">
        <p className="font-mono">Current openIndex: {openIndex}</p>
        <p className="text-sm text-gray-600 mt-2">
          Check the browser console for console.log messages when clicking
        </p>
      </div>
    </div>
  );
}