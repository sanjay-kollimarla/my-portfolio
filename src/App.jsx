import React, {useEffect} from 'react'
import Nav from './components/Nav'
import Hero from './components/Hero'
import About from './components/About'
import Skills from './components/Skills'
import Projects from './components/Projects'
import Certificates from './components/Certificates'
import Contact from './components/Contact'
import Footer from './components/Footer'
import { initWaves } from './lib/waves'

export default function App(){
  useEffect(()=>{
    initWaves()
  },[])
  return (
    <div className='app'>
      <Nav />
      <Hero />
      <main>
        <About />
        <Skills />
        <Projects />
        <Certificates />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}
