import React, { useState } from 'react'
import resume from '../../data/resumeData'
import { Carousel, Button, Modal } from 'react-bootstrap'

export default function Certificates() {
  const [modal, setModal] = useState(null)

  function CertificateModal({ modal, onClose }) {
    if (!modal) return null
    return (
      <Modal show={!!modal} onHide={onClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>{modal.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{modal.link || 'No verification link provided'}</p>
          {modal.link && (
            <Button variant="primary" href={modal.link} target="_blank" rel="noreferrer">
              Open Certificate
            </Button>
          )}
        </Modal.Body>
      </Modal>
    )
  }

  return (
    <section id="certifications" className='section'>
      <div className="container">
        <h2>Certificates</h2>
        <Carousel
          interval={1000} // disable auto-slide, set to number for autoplay in ms
          indicators={true}
          controls={true}
          variant="dark"
          wrap={true} // infinite loop
          pause="hover"
          style={{backdropFilter: "blur(50px)",}}
        >
          {resume.certificates.map((cert, idx) => (
            <Carousel.Item key={idx}>
              <div
                onClick={() => setModal(cert)}
                style={{
                  cursor: 'pointer',
                  padding: '2rem',
                  borderRadius: 14,
                  boxShadow: '0 6px 15px rgba(0,0,0,0.1)',
                  height: '60rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#222',
                }}
                className='rounded-5'
              >
                <img src={cert.file} width='100%' className='rounded-3' height='100%'/>
              </div>
            </Carousel.Item>
          ))}
        </Carousel>

        <CertificateModal modal={modal} onClose={() => setModal(null)} />
      </div>
    </section>
  )
}
