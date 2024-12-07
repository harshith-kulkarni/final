import React from "react";
import "./dashboard.css";
import 'bootstrap/dist/css/bootstrap.min.css';
const Modal = () => {
   const [user, setUser] = React.useState({ name: "", photo: "" });
     React.useEffect(() => {
    // Retrieve user details from localStorage
    const username = localStorage.getItem("username") || "Guest";
    const photoUrl = localStorage.getItem("userPhoto") || "https://via.placeholder.com/40"; // Default placeholder
    setUser({ name: username, photo: photoUrl });
  }, []);
    const scrollToSection = (id) => {
      const section = document.getElementById(id);
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }
    };

const handleClick = (e, targetId) => {
  e.preventDefault();
  scrollToSection(targetId);
};


  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };
    return (
        <>
            <title>Welcome {user.name}</title>
            <link
                href="https://assets.website-files.com/606a817e5976f2ad842e21e6/css/refraction-jewelry.webflow.a587c5872.css"
                rel="stylesheet"
                type="text/css"
            />
            <link href="https://fonts.googleapis.com" rel="preconnect"/>
            <link
                href="https://fonts.gstatic.com"
                rel="preconnect"
                crossOrigin="anonymous"
            />
            <header className="navbar-white fixed w-nav" role="banner">
                <div className="nav-container white w-container">
                    <nav role="navigation" className="nav-menu dark w-nav-menu">
                        <div className="nav-dropdown-wrapper white w-dropdown">
                            <div className="navdropdown white w-dropdown-toggle">
                                <span className="text-dark">Categories / Services</span>
                                <span className="dropdown-arrow w-icon-dropdown-toggle text-dark"></span>
                            </div>
                            <div className="dropdown-content">
                                <a href="#text-to-visuals" onClick={(e) => handleClick(e, "text-to-visuals")} className="dropdown-link mobile-white">
                                    Text to Visuals
                                </a>
                                <a href="#sketch" onClick={(e) => handleClick(e, "sketch")} className="dropdown-link mobile-white">
                                    Sketch to Reality
                                </a>
                                <a href="#black" onClick={(e) => handleClick(e, "black")} className="dropdown-link mobile-white">
                                    Monochrome to MultiColour
                                </a>
                            </div>
                        </div>

                        <a href="/info" className="navlink white w-nav-link">
                        </a>
                        <div className="centred-logo-container">

                        </div>
                        <form action="/search" className="search-bar w-form">
                            <label htmlFor="search" className="nav-search-text white">
                                <a href="./login">Login</a>
                            </label>
                        </form>
                        <a href="/contactus" className="navlink white w-nav-link text-dark">
                            Contact
                        </a>
                        <div className="profile-menu">
                            <button className="model"
                                    onClick={() => document.getElementById("dropdown").classList.toggle("show")}>
                                {user.name.charAt(0).toUpperCase()}
                            </button>
                            <div id="dropdown" className="dropdown-content">
                                <span className="text-dark">Hello, {user.name.split(" ").slice(0, 2).join(" ")}
                                    <br/><br/></span>
                                <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
                            </div>
                        </div>
                    </nav>
                </div>
            </header>

            {/* Hero Section */}
            <main className="wrapper">
                {/* Existing Content Sections */}
                <section className="hero-section">
                    <div className="container w-container">
                        <h1 className="heading hero">Welcome {user.name}</h1>
                    </div>
                </section>
                <div className="section">
                    <div className="container w-container">
                        <div className="spacer _48" ></div>
                        <div className="content-section" id="text-to-visuals">
                            <div className="content-text" >
                            <h2>From Text to Visuals</h2>
                                <p>Transform your ideas from simple text into stunning visual representations. Our tools
                                    make it effortless to bring your concepts to life.</p>
                                <a href="/text" className="button underline w-button">Get Started</a>
                            </div>
                            <div className="content-image">
                                <a href="/text" className="image-banner w-inline-block">
                                    <img
                                        src="https://cdn.prod.website-files.com/606a817e5976f2ad842e21e6/6078f9ea92b64ac7223d31af_section2-min.png"
                                        loading="lazy" alt="Clear Earrings" className="image-cover"/>
                                </a>
                            </div>
                        </div>

                        <div className="spacer _128"></div>

                        <div className="content-section reverse" id="sketch">
                            <div className="content-text">
                                <h3>Sketches to Reality</h3>
                                <p>Bring your sketches to life with our advanced rendering tools. Turn your hand-drawn
                                    designs into professional-grade jewelry pieces.</p>
                                <a href="/sketch" className="button underline w-button">Get Started</a>
                            </div>
                            <div className="content-image">
                                <a href="/sketch" className="product-link w-inline-block">
                                    <img
                                        src="https://cdn.prod.website-files.com/606a817e5976f2ad842e21e6/6078f9ea4eed16570ea9af17_necklace4-min.png"
                                        loading="lazy" alt="Silver Chain Necklace"
                                        sizes="(max-width: 479px) 92vw, (max-width: 767px) 88vw, (max-width: 991px) 27vw, (max-width: 1279px) 28vw, 351.953125px"
                                        srcSet="https://assets.website-files.com/606a817e5976f2ad842e21e6/6078f9ea4eed16570ea9af17_necklace4-min-p-500.png 500w, https://assets.website-files.com/606a817e5976f2ad842e21e6/6078f9ea4eed16570ea9af17_necklace4-min.png 700w"
                                        className="product-image"/>
                                </a>
                            </div>
                        </div>

                        <div className="spacer _128"></div>


                        <div className="content-section" id="black">
                            <div className="content-text">
                                <h2>From Monochrome to Multicolor</h2>
                                <p>Expand your designs from simple monochrome to vibrant multicolor palettes. Enhance
                                    the
                                    appeal and uniqueness of your jewelry pieces.</p>
                                <a href="/black" className="button underline w-button">Get Started</a>
                            </div>
                            <div className="content-image">
                                <a href="/black" className="product-link w-inline-block">
                                    <img
                                        src="https://cdn.prod.website-files.com/606a817e5976f2ad842e21e6/6078f9ead5e352794cca67ea_ring1-min.png"
                                        loading="lazy" alt="Stack Ring"
                                        sizes="(max-width: 479px) 92vw, (max-width: 767px) 88vw, (max-width: 991px) 27vw, (max-width: 1279px) 28vw, 351.953125px"
                                        srcSet="https://assets.website-files.com/606a817e5976f2ad842e21e6/6078f9ead5e352794cca67ea_ring1-min-p-500.png 500w, https://assets.website-files.com/606a817e5976f2ad842e21e6/6078f9ead5e352794cca67ea_ring1-min.png 700w"
                                        className="product-image"/>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <footer className="footer">
                <div className="footer">
                    <div className="footer-container w-container">
                        <div className="spacer _32"></div>
                        <div className="_12-columns mob-swap">
                            <div className="column desk-4 tab-4">
                                <p className="paragraph xs">© HALSVAR. All Rights Reserved.<br/>Built by HALSVAR.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    );
};

function Modal1() {
    React.useEffect(() => {
        const WebFont = require("webfontloader");
        WebFont.load({
            google: {
                families: [
                    "Roboto:regular,italic,500,500italic,700,700italic",
                    "Libre Baskerville:regular,italic,700",
                    "Roboto Mono:regular,500,600,700",
                    "Playfair Display:regular,500,600,700,italic,500italic,600italic",
                ],
            },
        });

        const rootElement = document.documentElement;
        rootElement.className += " w-mod-js";

        if ("ontouchstart" in window || navigator.maxTouchPoints > 0) {
            rootElement.className += " w-mod-touch";
        }
    }, []);

}

export default Modal;
