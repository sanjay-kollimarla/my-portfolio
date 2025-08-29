import resume from "../../data/resumeData";
import { BsEnvelope, BsTelephone, BsLinkedin, BsGeoAlt } from "react-icons/bs";
import "./Contact.css";

const GradientIcon = ({ icon: IconComponent, id, ...props }) => (
  <span className="gradient-icon-container" style={{ display: 'inline-block' }}>
    <svg width="0" height="0" style={{ position: 'absolute', opacity: 0 }}>
      <linearGradient id={`gradient-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="5%" style={{ stopColor: '#fffeffff', stopOpacity: 1 }} />
        <stop offset="90%" style={{ stopColor: '#042affff', stopOpacity: 1 }} />
        
      </linearGradient>
    </svg>
    <IconComponent {...props} style={{ fill: `url(#gradient-${id})` }} />
  </span>
);

const contactInfo = [
  {
    icon: <GradientIcon icon={BsEnvelope} id="email" className="fs-3 contact-icon" />,
    title: "Email",
    value: resume.contact.email,
    link: `mailto:${resume.contact.email}`,
  },
  {
    icon: <GradientIcon icon={BsTelephone} id="phone" className="fs-3 contact-icon" />,
    title: "Phone",
    value: resume.contact.phone,
    link: `tel:${resume.contact.phone}`,
  },
  {
    icon: <GradientIcon icon={BsGeoAlt} id="location" className="fs-3 contact-icon" />,
    title: "Location",
    value: "Hyderabad, India",
  },
  {
    icon: <GradientIcon icon={BsLinkedin} id="linkedin" className="fs-3 contact-icon" />,
    title: "LinkedIn",
    value: "Kollimarla Sai Sanjay",
    link: "https://www.linkedin.com/in/kollimarla-sai-sanjay/",
  },
];


const ContactCard = ({ icon, title, value, link }) => (
  <a href={link? link : ''} className="contact-card d-flex flex-column align-items-stretch gap-4 p-4 rounded-5 cursor-pointer" style={{color: 'inherit', textDecoration: 'none'}}>
    <div className="d-flex gap-3 align-items-center fw-medium fs-5">
      {icon}
      {title}
    </div>
    <div className="ps-3 h-100 d-flex align-items-center contact-card-content">{value}</div>
  </a>
)

export default function Contact() {
  const RenderContactCards = () => contactInfo.map(contact => <ContactCard {...contact} key={contact.title} />)
  return (
    // Add 'contact-section-advanced' for the animated background
    <section id="contact" className="section">
      <div className="container">
        <h2 className="fs-3">Contact</h2>
        <p>Let's connect and build something amazing !</p>
        <br />
        <div className="contact-card-container d-flex gap-3 align-items-center flex-wrap justify-content-center mx-5">
          <RenderContactCards />
        </div>
      </div>
    </section>
  );
}
