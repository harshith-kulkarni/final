import React from "react";
import {BrowserRouter as Router, Routes, Route, Link} from "react-router-dom";
import "./App.css";
import Login from "./login";
import Text from "./text";
import Sketch from "./sketch";
import Black from "./black";
import Dashboard from "./dashboard";
import ContactUs from "./contactus";
const Home = () => {
  return (
      <>
          <title>HALSVAR - Jewellery Generator</title>
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
                  </nav>
              </div>
          </header>

          {/* Hero Section */}
          <main className="wrapper">
              {/* Existing Content Sections */}
              <section className="hero-section">
                  <div className="container w-container">
                      <h1 className="heading hero"> HALSVAR - Jewellery Generator</h1>
                  </div>
              </section>
              <div className="section">
                  <div className="container w-container">
                      <div className="spacer _48"></div>
                      <div className="content-section">
                          <div className="content-text">
                              <h2>From Text to Visuals</h2>
                              <p>Transform your ideas from simple text into stunning visual representations. Our tools
                                  make it effortless to bring your concepts to life.</p>
                              <a href="/login" className="button underline w-button">Get Started</a>
                          </div>
                          <div className="content-image">
                              <a href="/product/clear-earrings" className="image-banner w-inline-block">
                                  <img
                                      src="https://cdn.prod.website-files.com/606a817e5976f2ad842e21e6/6078f9ea92b64ac7223d31af_section2-min.png"
                                      loading="lazy" alt="Clear Earrings" className="image-cover"/>
                              </a>
                          </div>
                      </div>

                      <div className="spacer _128"></div>

                      <div className="content-section reverse">
                          <div className="content-text">
                              <h3>Sketches to Reality</h3>
                              <p>Bring your sketches to life with our advanced rendering tools. Turn your hand-drawn
                                  designs into professional-grade jewelry pieces.</p>
                              <a href="/login" className="button underline w-button">Get Started</a>
                          </div>
                          <div className="content-image">
                              <a href="/product/chain-necklace-silver" className="product-link w-inline-block">
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


                      <div className="content-section">
                          <div className="content-text">
                              <h2>From Monochrome to Multicolor</h2>
                              <p>Expand your designs from simple monochrome to vibrant multicolor palettes. Enhance the
                                  appeal and uniqueness of your jewelry pieces.</p>
                              <a href="/login" className="button underline w-button">Get Started</a>
                          </div>
                          <div className="content-image">
                              <a href="#" className="product-link w-inline-block">
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

function App() {
React.useEffect(() => {
    // Load Google Fonts using WebFontLoader
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

    // Add custom class names to the root element
    const rootElement = document.documentElement;
    rootElement.className += " w-mod-js";
    if ("ontouchstart" in window || navigator.maxTouchPoints > 0) {
        rootElement.className += " w-mod-touch";
    }

    // Inject the AI chatbot script
    (function (w, d, s, ...args) {
        // Create a div for the chatbot
        const div = d.createElement("div");
        div.id = "aichatbot";
        d.body.appendChild(div);

        // Set chatbot configuration
        w.chatbotConfig = args;

        // Create and inject the script element
        const f = d.getElementsByTagName(s)[0];
        const j = d.createElement(s);
        j.defer = true;
        j.type = "module";
        j.src = "https://aichatbot.sendbird.com/index.js";
        f.parentNode.insertBefore(j, f);
    })(
        window,
        document,
        "script",
        "C8AB161C-F5AA-4268-A122-F4FA6AC039F4",
        "5OrlY1Rrw0jBUwc-esxLk",
        {
            apiHost: "https://api-cf-us-3.sendbird.com",
        }
    );
}, []);


    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home/>}/>
                <Route path="/login" element={<Login/>}/>
                <Route path="/dashboard" element={<Dashboard/>}/>
                <Route path="/text" element={<Text/>}/>
                <Route path="/sketch" element={<Sketch/>}/>
                <Route path="/black" element={<Black/>}/>
                <Route path="/contactus" element={<ContactUs/>}/>
            </Routes>
        </Router>
    );
}

export default App;
