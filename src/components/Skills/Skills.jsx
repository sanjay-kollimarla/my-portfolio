import React from 'react'
import resume from '../../data/resumeData'
import { motion } from 'framer-motion'
import { Howl } from 'howler'
import clickMp3 from '../../assets/sounds/click.mp3'
import './skills.css'
const click = new Howl({src:[clickMp3], volume:0.12})
const skills = resume.skills

export default function Skills(){
  return (
    <section id="skills" className="section">
      <div className="container">
        <h2>Skills</h2>
        <div className="skills-bars">
          {resume.streams.map((s,i)=>(
            <div key={i} className="skill-row" onMouseEnter={()=>click.play()}>
              <div className="skill-name">{s.name}</div>
              <div className="skill-bar-bg">
                <motion.div className="skill-bar" initial={{width:0}} whileInView={{width: s.value + '%'}} transition={{duration:1, delay:i*0.2}} />
              </div>
            </div>
          ))}
        </div>
         <div className="scrolling-chips-container">
          <div className="scrolling-chips-track">
            {/* We map the array twice to create a seamless loop */}
            {[...skills, ...skills].map((skill, index) => (
              <div key={index} className="skill-chip">
                <img src={skill.icon} alt={`${skill.name} icon`} className="skill-chip-icon" />
                <span className='text-dark'>{skill.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
