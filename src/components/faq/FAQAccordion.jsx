import { useState } from "react";
import { Plus, Minus } from "lucide-react";

export default function FAQAccordion() {
  const [openIndex, setOpenIndex] = useState(null);

  // 👉 FAQ DATA INSIDE SAME COMPONENT
  const faqs = [
    {
      question: "How do I create an account?",
      answer:
        "Click on the 'Sign Up' button at the top right of our homepage and fill in your details for a smoother shopping experience.",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept various payment methods including credit cards, PayPal, and other secure payment options.",
    },
    {
      question: "Do you offer international shipping?",
      answer:
        "Yes, we ship globally. Shipping costs and times vary depending on the destination.",
    },
    {
      question: "How can I track my order?",
      answer:
        "Once your order is dispatched, you will receive a tracking number via email to monitor your delivery's progress.",
    },
    {
      question: "What is your return policy?",
      answer:
        "We accept returns within 30 days of purchase. Items must be in original condition. Some exclusions apply.",
    },
    {
      question: "How can I contact customer service?",
      answer:
        "Reach us via our contact page, email, or phone. We're here to help with any queries or concerns.",
    },
    {
      question: "How should I care for my purchased items?",
      answer:
        "Each product page includes specific care instructions to help maintain the quality of your purchase.",
    },
    {
      question: "Is Fusive Fashion eco-friendly?",
      answer:
        "We are committed to sustainability, from sourcing eco-conscious materials to implementing ethical manufacturing practices.",
    },
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="bg-white pb-20">
      <div className="max-w-3xl mx-auto px-4">
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border-b border-gray-200 py-5 cursor-pointer"
              onClick={() => toggleFAQ(index)}
            >
              {/* Question */}
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">
                  {faq.question}
                </h3>

                {openIndex === index ? (
                  <Minus size={20} />
                ) : (
                  <Plus size={20} />
                )}
              </div>

              {/* Answer */}
              {openIndex === index && (
                <p className="text-gray-600 mt-4 leading-relaxed">
                  {faq.answer}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
