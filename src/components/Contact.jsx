import React from 'react'
import resume from '../data/resumeData'

export default function Contact(){
  return (
    <section id="contact" className="section">
      <div className="container">
        <h2>Contact</h2>
        <div className="contact-grid">
          <a className="contact-card" href={'mailto:' + resume.contact.email}>Email<br/><span className="muted">{resume.contact.email}</span></a>
          <a className="contact-card" href={'tel:' + resume.contact.phone}>Call<br/><span className="muted">{resume.contact.phone}</span></a>
          <a className="contact-card" href={resume.contact.linkedin} target="_blank" rel="noreferrer">LinkedIn<br/><span className="muted">Profile</span></a>
        </div>
      </div>
    </section>
  )
}
