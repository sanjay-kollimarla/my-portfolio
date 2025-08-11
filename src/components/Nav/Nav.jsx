import React, { useEffect, useState } from "react";

export default function Nav() {
  const sections = ["about", "skills", "projects", "certifications", "contact"];
  const [activeHash, setActiveHash] = useState(
    window.location.hash || "#about"
  );
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    function onHashChange() {
      setActiveHash(window.location.hash || "#about");
    }
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  // useEffect(() => {
  //   function onScroll() {
  //     const scrollPosition = window.scrollY + window.innerHeight; // offset to detect early

  //     for (let i = 0; i < sections.length; i++) {
  //       const sectionId = sections[i];
  //       const el = document.getElementById(sectionId);
  //       if (el) {
  //         const top = el.offsetTop;
  //         const height = el.offsetHeight;
  //         if (scrollPosition >= top && scrollPosition < top + height) {
  //           const newHash = `#${sectionId}`;
  //           if (newHash !== window.location.hash) {
  //             // update URL without jumping or adding to history stack
  //             history.replaceState(null, '', newHash);
  //             setActiveHash(newHash);
  //           }
  //           break;
  //         }
  //       }
  //     }
  //   }

  //   window.addEventListener('scroll', onScroll, { passive: true });

  //   // initial call in case page loads mid-scroll
  //   onScroll();

  //   return () => window.removeEventListener('scroll', onScroll);
  // }, [sections]);

  const NavLink = ({ section }) => (
    <a
      key={section}
      href={`#${section}`}
      onClick={() => setIsMenuOpen(false)}
      className="nav-link rounded-5"
      style={{
        backgroundColor: activeHash === `#${section}` ? "white" : "transparent",
        color: activeHash === `#${section}` ? "black" : "inherit",
        borderRadius: "4px",
        padding: "6px 8px",
        minWidth: "75px",
        textAlign: "center",
      }}
    >
      {section.charAt(0).toUpperCase() + section.slice(1)}
    </a>
  );

  const NavLinks = () =>
    sections.map((section, i) => <NavLink key={i} section={section} />);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="nav">
      <div className="container nav-inner">
        <a className="brand" href="">
          <i className="bi bi-file-code fs-2 text-white"></i>
        </a>
        <button
          className={`hamburger ${isMenuOpen ? "nav-open" : ""}`}
          onClick={toggleMenu}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
        <nav className={`nav-links ms-auto ${isMenuOpen ? "nav-open" : ""}`}>
          <NavLinks />
        </nav>
      </div>
    </header>
  );
}
