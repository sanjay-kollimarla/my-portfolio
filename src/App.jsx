import {useEffect} from 'react'
import Nav from './components/Nav/Nav'
import Hero from './components/Hero/Hero'
import About from './components/About/About'
import Skills from './components/Skills/Skills'
import Projects from './components/Projects/Projects'
import Certificates from './components/Certificates/Certificates'
import Contact from './components/Contact/Contact'
import Footer from './components/Footer/Footer'
import { initWaves } from './lib/waves'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/js/bootstrap.js'
import 'bootstrap-icons/font/bootstrap-icons.css'

export default function App(){
  useEffect(()=>{
    initWaves()
  },[])
  return (
    <div className='app'>
      <Nav />
      <Hero />
      <hr/>
      <main>
        <About />
        <hr/>
        <Skills />
        <hr/>
        <Projects />
        <hr/>
        <Certificates />
        <hr/>
        <Contact />
      </main>
      <Footer />
    </div>
  )
}
