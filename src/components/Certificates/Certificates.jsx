import React, { useState } from "react";
import resume from "../../data/resumeData";
import { Button, Modal } from "react-bootstrap";
import "./Certificate.css";

export default function Certificates() {
  const [modal, setModal] = useState(null);

  const CertificateModal = ({ modal, onClose }) => {
    if (!modal) return null;

    return (
      <Modal
        show={!!modal}
        onHide={onClose}
        dialogClassName="certificate-modal"
        aria-labelledby="certificate-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title id="certificate-modal">{modal.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-0">
          <div className="certificate-modal-image ">
            <img src={modal.file} alt={modal.name} loading="lazy" />
          </div>
        </Modal.Body>
      </Modal>
    );
  };

  return (
    <section id="certifications" className="section">
      <div className="container">
        <h2>Certificates</h2>
        <div className="certificates-grid">
          {resume.certificates.map((cert, idx) => (
            <div
              key={idx}
              className="certificate-card"
              onClick={() => setModal(cert)}
            >
              <div className="certificate-image">
                <img src={cert.file} alt={cert.name} />
              </div>
              <div className="certificate-content">
                <h3>{cert.name}</h3>
                <button className="view-btn">View Certificate</button>
              </div>
            </div>
          ))}
        </div>

        <CertificateModal modal={modal} onClose={() => setModal(null)} />
      </div>
    </section>
  );
}
