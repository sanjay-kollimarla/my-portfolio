import React, {useState} from 'react'
import resume from '../data/resumeData'
import { motion } from 'framer-motion'

export default function Certificates(){
  const [modal, setModal] = useState(null)
  return (
    <section id="certs" className="section">
      <div className="container">
        <h2>Certificates</h2>
        <div className="cert-scroll" role="list">
          {resume.certificates.map((c,i)=>(
            <motion.button key={i} className="cert-card" onClick={()=>setModal(c)} whileHover={{scale:1.02}}>
              <div className="cert-title">{c.name}</div>
              <div className="cert-issuer muted">{c.link? 'View' : 'No link'}</div>
            </motion.button>
          ))}
        </div>
        {modal && (
          <div className="modal" onClick={()=>setModal(null)}>
            <div className="modal-inner" onClick={(e)=>e.stopPropagation()}>
              <h3>{modal.name}</h3>
              <p className="muted">{modal.link || 'No verification link provided'}</p>
              {modal.link && <a href={modal.link} target="_blank" rel="noreferrer">Open Certificate</a>}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
