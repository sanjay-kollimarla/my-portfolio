import React from 'react';
import resume from '../../data/resumeData';
import { BsEnvelope, BsTelephone, BsLinkedin, BsGithub } from 'react-icons/bs';
// Import the new, advanced CSS
import './Contact.css';

export default function Contact() {
  const contactMethods = [
    {
      icon: <BsEnvelope className="icon" />,
      title: 'Email',
      subtitle: resume.contact.email,
      link: `mailto:${resume.contact.email}`,
    },
    {
      icon: <BsTelephone className="icon" />,
      title: 'Call',
      subtitle: resume.contact.phone,
      link: `tel:${resume.contact.phone}`,
    },
    {
      icon: <BsLinkedin className="icon" />,
      title: 'LinkedIn',
      subtitle: 'Profile',
      link: resume.contact.linkedin,
    },
    {
      icon: <BsGithub className="icon" />,
      title: 'GitHub',
      subtitle: 'Code & Projects',
      link: resume.contact.github,
    },
  ];

  return (
    // Add 'contact-section-advanced' for the animated background
    <section id="contact" className="section contact-section-advanced m-5 rounded">
      <div className="container">
        <h2 className="contact-section-header fw-bold">Get in Touch</h2>
        <p className="section-subtitle text-secondary fw-medium">
          I'm currently open to new opportunities. Feel free to reach out.
        </p>
        <div className="d-flex align-items-center justify-content-center gap-2">
          {contactMethods.map((method, index) => (
            <a
              key={index}
              href={method.link}
              className="contact-card"
              target="_blank"
              rel="noopener noreferrer"
            >
              {/* This inner div is for the 3D parallax effect */}
              <div className="card-content rounded-5">
                {method.icon}
                <span className="title">{method.title}</span>
                <span className="subtitle">{method.subtitle}</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}