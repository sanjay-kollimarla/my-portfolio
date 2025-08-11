import React from "react";
import resume from "../../data/resumeData";
import { BsEnvelope, BsTelephone, BsLinkedin, BsGeoAlt } from "react-icons/bs";
// Import the new, advanced CSS
import "./Contact.css";

export default function Contact() {
  const contactInfo = [
    {
      icon: <BsEnvelope className="icon" />,
      title: "Email",
      value: resume.contact.email,
      link: `mailto:${resume.contact.email}`,
    },
    {
      icon: <BsTelephone className="icon" />,
      title: "Phone",
      value: resume.contact.phone,
      link: `tel:${resume.contact.phone}`,
    },
    {
      icon: <BsGeoAlt className="icon" />,
      title: "Location",
      value: "Hyderabad, India",
    },
    {
      icon: <BsLinkedin className="icon" />,
      title: "LinkedIn",
      value: "Kollimarla Sai Sanjay",
      link: "https://www.linkedin.com/in/kollimarla-sai-sanjay/",
    },
  ];
  return (
    // Add 'contact-section-advanced' for the animated background
    <section id="contact" className="section">
      <div className="contact-container">
        <h2 className="contact-title">Get In Touch</h2>
        <div className="contact-grid">
          {contactInfo.map((item, index) => (
            <div key={index} className="contact-item">
              <div className="contact-icon">{item.icon}</div>
              <div className="contact-details">
                <h3>{item.title}</h3>
                {item.link ? (
                  <a href={item.link} className="contact-value">
                    {item.value}
                  </a>
                ) : (
                  <span className="contact-value">{item.value}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
