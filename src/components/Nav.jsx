import React, {useState} from 'react'
import { FiSun, FiMoon, FiGithub, FiLinkedin } from 'react-icons/fi'
import { Howl } from 'howler'
import clickMp3 from '../assets/sounds/click.mp3'

const clickSound = new Howl({ src: [clickMp3], volume: 0.15 })

export default function Nav(){
  const [theme, setTheme] = useState('dark')
  const [soundOn, setSoundOn] = useState(true)

  function toggleTheme(){
    const n = theme === 'dark' ? 'light' : 'dark'
    setTheme(n)
    document.documentElement.setAttribute('data-theme', n)
    if(soundOn) clickSound.play()
  }
  function toggleSound(){
    setSoundOn(s=>!s)
  }

  return (
    <header className='nav'>
      <div className='container nav-inner'>
        <div className='brand'>Sanjay</div>
        <nav className='nav-links'>
          <a href="#about">About</a>
          <a href="#skills">Skills</a>
          <a href="#projects">Projects</a>
          <a href="#certs">Certificates</a>
          <a href="#contact">Contact</a>
        </nav>
        <div className='nav-actions'>
          <a href="https://github.com/yourusername" target='_blank' rel='noreferrer'><FiGithub size={18} /></a>
          <a href="https://linkedin.com/in/kollimarla-sai-sanjay" target='_blank' rel='noreferrer'><FiLinkedin size={18} /></a>
          <button className='icon-btn' onClick={toggleTheme} aria-label='Toggle theme'>{theme==='dark'?<FiSun/>:<FiMoon/>}</button>
          <button className='icon-btn' onClick={toggleSound} aria-label='Toggle sound'>{soundOn?'🔊':'🔇'}</button>
        </div>
      </div>
    </header>
  )
}
