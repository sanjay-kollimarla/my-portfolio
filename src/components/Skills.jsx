import React from 'react'
import resume from '../data/resumeData'
import { motion } from 'framer-motion'
import { Howl } from 'howler'
import clickMp3 from '../assets/sounds/click.mp3'
const click = new Howl({src:[clickMp3], volume:0.12})

export default function Skills(){
  return (
    <section id="skills" className="section">
      <div className="container">
        <h2>Skills</h2>
        <div className="skills-bars">
          {resume.skills.map((s,i)=>(
            <div key={i} className="skill-row" onMouseEnter={()=>click.play()}>
              <div className="skill-name">{s.name}</div>
              <div className="skill-bar-bg">
                <motion.div className="skill-bar" initial={{width:0}} whileInView={{width: s.value + '%'}} transition={{duration:1, delay:i*0.2}} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
