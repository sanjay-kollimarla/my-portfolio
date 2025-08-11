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
          <div className="certificate-modal-image">
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
            <div key={idx} className="certificate-card d-flex flex-column align-items-stretch" onClick={() => setModal(cert)}>
              <div className="certificate-image">
                <img src={cert.file} alt={cert.name} height='100%' />
              </div>
              <div className="certificate-content d-flex flex-row-reverse align-items-center justify-content-around gap-3 m-2 rounded p-2">
                <button className="arrow-btn" aria-label="View Certificate" onClick={() => setModal(cert)}>
                  <i className="bi bi-box-arrow-up-right text-white"></i>
                </button>
                <h3 className="m-0 w-100 text-white"><i>{cert.name}</i></h3>
                <div className="certificate-footer bg-light rounded m-0">
                  <img src={cert["company-logo"]} alt={cert.company} className="company-logo" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <CertificateModal modal={modal} onClose={() => setModal(null)} />
      </div>
    </section>
  );
}
