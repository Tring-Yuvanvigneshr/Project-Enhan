import React from "react";
import heroimg from "../../assets/Images/heroimg1.png";
import { Link } from "react-router-dom";
import "./landingPage.css";

const LandingPage = () => {
    const services = [
        { name: "Plumber", description: "Expert plumbing services for residential and commercial needs." },
        { name: "Electrician", description: "Professional electrical services for installations and repairs." },
        { name: "Carpenter", description: "High-quality carpentry services for furniture and home improvement." },
        { name: "Mechanic", description: "Car and bike repair services at your doorstep." },
        { name: "Painter", description: "Interior and exterior painting services for homes and offices." },
        { name: "Cleaner", description: "Professional cleaning services for homes, offices, and industries." },
        { name: "AC Technician", description: "Air conditioning installation, repair, and maintenance services." },
        { name: "Appliance Repairer", description: "Repair services for washing machines, refrigerators, and other appliances." },
    ];
    const d = new Date()

    return (
        <>
            <div id="home" className="home-page">
                <h3>LOCOS</h3>
                <section className="hero">
                    <h1>
                        Find the <span>Best Technicians</span>
                    </h1>
                    <h1>for Your Needs</h1>
                    <p>
                        Connect with local professionals for plumbing, electrical work, cleaning, and more.
                    </p>
                    <Link to="/signUp">
                        <button className="btn-dark">Get Started →</button>
                    </Link>
                </section>
            </div>

            <div className="white-space">
                <nav>
                    <ul>
                        <li><a href="#home">Home</a></li>
                        <li><a href="#services-page">Services</a></li>
                        <li><Link to="/signup" className="hs-link">Work with us</Link></li>
                        <li><a href="#footer">About us</a></li>
                        <Link to="/signIn">
                            <button className="btn-dark">Login</button>
                        </Link>
                    </ul>
                </nav>
                <img src={heroimg} alt="Technician at work" />
            </div>

            <div id="services-page">
                <h1>Services</h1>
                <div className="services-grid">
                    {services.map((service, index) => (
                        <div className="service-card" key={index}>
                            <h2>{service.name}</h2>
                            <p>{service.description}</p>
                            <Link to="/signIn">
                                <button>Book Now</button>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>

            <footer id="footer">
                <div className="footer-content">
                    <div className="footer-section">
                        <h3>About Us</h3>
                        <p>This website is intended for informational purposes only.
                            We connect clients with local service professionals.</p>
                    </div>
                    <div className="footer-section">
                        <h3>Quick Links</h3>
                        <ul>
                            <li><Link to="/">Home</Link></li>
                            <li><a href="#footer">About</a></li>
                            <li><a href="#services-page">Services</a></li>
                            <li><a href="#footer">Contact</a></li>
                        </ul>
                    </div>
                    <div className="footer-section">
                        <h3>Contact Us</h3>
                        <ul>
                            <li>Email: support@locos.com</li>
                            <li>Phone: 123456789</li>
                        </ul>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>&copy; { d.getFullYear() } Locos. All rights reserved.</p>
                </div>
            </footer>
        </>
    );
};

export default LandingPage;
