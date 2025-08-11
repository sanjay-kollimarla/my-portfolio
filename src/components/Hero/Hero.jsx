import React, {useRef, useEffect} from 'react'
import { motion } from 'framer-motion'
import resume from '../../data/resumeData'
import { Howl } from 'howler'
import clickMp3 from '../../assets/sounds/click.mp3'

const clickSound = new Howl({ src: [clickMp3], volume: 0.18 })

export default function Hero(){
  const imgRef = useRef(null)

  useEffect(()=>{
    function onMove(e){
      const el = imgRef.current
      if(!el) return
      const rect = el.getBoundingClientRect()
      const x = (e.clientX - rect.left) - rect.width/2
      const y = (e.clientY - rect.top) - rect.height/2
      el.style.transform = `translate3d(${x*0.03}px, ${y*0.03}px, 0) rotate(${x*0.002}deg)`
    }
    window.addEventListener('mousemove', onMove)
    return ()=> window.removeEventListener('mousemove', onMove)
  },[])

  return (
    <section id="home" className="hero section-hero">
      <div className="container hero-inner">
        <motion.div className="hero-left" initial={{opacity:0, x:-30}} animate={{opacity:1, x:0}} transition={{duration:0.8}}>
          <div className="floating-pic" 
            // ref={imgRef}
          >
            <img src="/profile.png" alt="Sanjay" style={{borderRadius: "100%"}} />
          </div>
        </motion.div>
        <motion.div className="hero-right" initial={{opacity:0, x:30}} animate={{opacity:1, x:0}} transition={{duration:0.8, delay:0.15}}>
          <h1>{resume.name}</h1>
          <p className="lead">{resume.title}</p>
          <p className="summary">{resume.summary}</p>
          <div className="hero-cta">
            {/* <a className="btn primary" href={resume.projects[0].demoLink} target="_blank" rel="noreferrer" onClick={()=>clickSound.play()}>View Jobby App</a> */}
            <a className="btn resume" href="/resume.pdf" download onClick={()=>clickSound.play()}>Resume <i className="bi bi-box-arrow-up-right"></i></a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
