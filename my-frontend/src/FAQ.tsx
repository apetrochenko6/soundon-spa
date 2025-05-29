import React, { useState } from "react";
import "./FAQ.css"; // We'll create this CSS file next

interface FAQItem {
  question: string;
  answer: string;
}

const FAQ: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const faqItems: FAQItem[] = [
    {
      question: "JAK SIĘ ZGŁOSIĆ?",
      answer: "Wypełnij formularz zgłoszeniowy na naszej stronie internetowej i dołącz próbki swojej muzyki. Zgłoszenia przyjmujemy do 31 stycznia 2025 roku."
    },
    {
      question: "CZY MOGĘ WYSTĄPIĆ SOLO?",
      answer: "Tak, zapraszamy zarówno solowych artystów, jak i zespoły. Ważne, abyś miał przygotowany co najmniej 30-minutowy materiał."
    },
    {
      question: "GDZIE KUPIĆ BILETY?",
      answer: "Bilety dostępne są na naszej stronie internetowej oraz u oficjalnych partnerów. Sprzedaż rusza 1 grudnia 2024."
    },
    {
      question: "KIEDY ODBĘDZIE SIĘ FESTIWAL?",
      answer: "SoundOn 2025 odbędzie się 10 marca 2025 roku w Warszawie. Szczegółowy harmonogram pojawi się w lutym."
    }
  ];

  const toggleFAQ = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <>
    <div className="yellow-divider" ></div>
    <section className="faq-section">
      <div className="faq-title-container">
        <div className="faq-title-wrapper">
          <div className="faq-title">
            FAQ – PYTANIA I ODPOWIEDZI
          </div>
          <div className="black-bg"></div>
        </div>
      </div>

      <div className="faq-content">
        <div className="faq-items-container">
          {faqItems.map((item, index) => (
            <div className="faq-item" key={index}>
              <div 
                className="faq-question" 
                onClick={() => toggleFAQ(index)}
              >
                <h3>{item.question}</h3>
                <div className="faq-toggle">
                  {activeIndex === index ? "−" : "+"}
                </div>
              </div>
              <div 
                className={`faq-answer ${activeIndex === index ? "active" : ""}`}
                style={{
                  maxHeight: activeIndex === index ? "500px" : "0",
                  padding: activeIndex === index ? "15px" : "0"
                }}
              >
                <p>{item.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section></>
    
  );
};

export default FAQ;