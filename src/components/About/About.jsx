import React from 'react'
import resume from '../../data/resumeData'

export default function About(){
  return (
    <section id="about" className="section">
      <div className="container">
        <h2>About Me</h2>
        <p className="muted">{resume.summary}</p>
      </div>
    </section>
  )
}
