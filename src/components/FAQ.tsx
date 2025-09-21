"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, HelpCircle } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs: FAQItem[] = [
    {
      question: "Is PooLabs safe for seniors to use?",
      answer: "Absolutely! PooLabs is designed specifically for senior care. The clip-on device is discreet, requires no user interaction, and provides valuable health insights without compromising dignity or privacy."
    },
    {
      question: "How does the toilet-clip device work?",
      answer: "The PooLabs device clips discreetly to any toilet and automatically detects bowel events. It uses advanced sensors to analyze digestive health without taking photos, only generating discrete health labels and trends for caregivers."
    },
    {
      question: "Does PooLabs take photos or videos?",
      answer: "No! PooLabs only takes photos angled downwards to the toilet bowl to detect bowel events. We employ redaction techniques for ALL events, and only labels are stored and taken from the image."
    },
    {
      question: "What health metrics does PooLabs track?",
      answer: "PooLabs tracks Bristol Stool Scale (BSS) scores, hydration levels, bowel movement frequency, and identifies trends that may indicate constipation, diarrhea, or other digestive health concerns."
    },
    {
      question: "Is the device compatible with all toilets?",
      answer: "Yes! The clip-on device is designed to work with most standard toilet designs. It's easy to install and can be positioned discreetly to avoid detection."
    },
    {
      question: "How do caregivers receive alerts?",
      answer: "Caregivers receive alerts through the PooLabs dashboard, showing health trends and significant changes. Only concerning patterns trigger notifications, reducing unnecessary alerts while maintaining peace of mind."
    },
    {
      question: "Is my health data secure and private?",
      answer: "Yes! We use military-grade encryption and never share your health data with third parties. All data is stored securely, and only authorized caregivers have access to health insights."
    },
    {
      question: "How long does the device battery last?",
      answer: "The PooLabs device is designed for long-term use with a battery life of several months. It's low-maintenance and requires minimal charging."
    },
    {
      question: "Can multiple caregivers monitor the same senior?",
      answer: "Yes! The system allows multiple authorized caregivers to access health insights and receive alerts, ensuring the entire care team stays informed."
    },
    {
      question: "What about visitors or other household members?",
      answer: "The device is smart enough to distinguish between regular users and visitors. It focuses on tracking patterns for the primary user while ignoring occasional use by others."
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-24 bg-gray-50/70 dark:bg-gray-900/30 backdrop-blur-sm relative" style={{ zIndex: 10 }}>
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-amber-600 px-6 py-2 text-sm font-semibold text-white">
            <HelpCircle className="h-4 w-4" />
            Frequently Asked Questions
          </div>
          <h2 className="mt-6 text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
            Everything You Need to Know
          </h2>
          <p className="mx-auto mt-6 text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
            Get answers to common questions about PooLabs and how it helps keep seniors healthy and independent.
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-4xl">
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 overflow-hidden transition-all duration-300 hover:shadow-xl"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white pr-4">
                    {faq.question}
                  </h3>
                  <div className="flex-shrink-0">
                    {openIndex === index ? (
                      <ChevronUp className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                    )}
                  </div>
                </button>
                {openIndex === index && (
                  <div className="px-6 pb-5">
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="mx-auto mt-16 max-w-3xl text-center">
          <div className="bg-amber-50 dark:bg-amber-900/20 rounded-2xl p-8 border border-amber-200 dark:border-amber-800">
            <h3 className="text-xl font-semibold text-amber-700 dark:text-amber-300 mb-4">
              Still have questions?
            </h3>
            <p className="text-amber-600 dark:text-amber-400 mb-6">
              Our care team is here to help you understand how PooLabs can benefit your family.
            </p>
            <a
              href="mailto:hello@poolabs.dev"
              className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Contact Our Care Team
              <HelpCircle className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}