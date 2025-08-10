import React from 'react'
import { motion } from 'framer-motion'
import resume from '../data/resumeData'

export default function Projects(){
  return (
    <section id="projects" className="section">
      <div className="container">
        <h2>Projects</h2>
        <div className="projects-grid">
          {resume.projects.map((p,i)=>(
            <motion.article key={i} className="project-card" whileHover={{scale:1.03}} initial={{opacity:0,y:10}} whileInView={{opacity:1,y:0}} viewport={{once:true}}>
              <h3>{p.name}</h3>
              <p className="muted">{p.description}</p>
              <div className="techs">{p.tech.join(' • ')}</div>
              <div className="project-actions">
                {p.demoLink && <a className="link" href={p.demoLink} target="_blank" rel="noreferrer">Live Demo</a>}
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
