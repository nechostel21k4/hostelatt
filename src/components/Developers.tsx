import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Developers.css";

interface Developer {
    name: string;
    role: string;
    id: string;
    batch: string;
    dept: string;
    college: string;
    image: string;
    linkedin: string;
    github?: string;
    facebook?: string;
    instagram?: string;
}

interface DeveloperCardProps {
    dev: Developer;
    isHorizontal?: boolean;
}

const developersV1: Developer[] = [
    {
        name: "Gangadhar Rongala",
        role: "Full Stack Web Developer",
        id: "21471A0521",
        batch: "2021-2025",
        dept: "Computer Science Engineering",
        college: "Narasaraopeta Engineering College",
        image: "/images/developers/21471A0521.png",
        linkedin: "https://www.linkedin.com/in/gangadhar-rongala-b65bb122a/",
        github: "#",
        facebook: "#",
        instagram: "#",
    },
    {
        name: "Bhuvanesh Thotakura",
        role: "Full Stack Web Developer",
        id: "21471A05K4",
        batch: "2021-2025",
        dept: "Computer Science Engineering",
        college: "Narasaraopeta Engineering College",
        image: "/images/developers/21471A05K4.png",
        linkedin: "https://www.linkedin.com/in/bhuvanesh-thotakura-079b37283/",
        github: "#",
        facebook: "#",
        instagram: "#",
    },
];

const developersV2: Developer[] = [
    {
        name: "JADAM SURYA TEJA",
        role: "Full Stack Web Developer",
        id: "22471A05M6",
        batch: "2022-2026",
        dept: "Computer Science Engineering",
        college: "Narasaraopeta Engineering College",
        image: "/images/developers/SuryaTeja.jpeg",
        linkedin: "https://www.linkedin.com/in/jadamsurya",
        github: "https://github.com/jadamsuryateja",
        facebook: "",
        instagram: "https://www.instagram.com/_s_u_r_y_a_.j_/",
    },
];

const galleryImages = [
    "/images/developers/hostel-2.jpg",
    "/images/developers/hostel-1.jpg",
    "/images/developers/hostel-4.jpg",
    "/images/developers/hostel-3.jpg",
];

const Developers = () => {
    const navigate = useNavigate();
    const [selectedDev, setSelectedDev] = useState<Developer | null>(null);
    const [currentIndex, setCurrentIndex] = useState<number>(0);

    const nextImage = React.useCallback(() => {
        setCurrentIndex((prev) => (prev + 1) % galleryImages.length);
    }, []);

    const prevImage = () => {
        setCurrentIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
    };

    useEffect(() => {
        const timer = setInterval(() => {
            nextImage();
        }, 3000);
        return () => clearInterval(timer);
    }, [nextImage]);

    const DeveloperCard: React.FC<DeveloperCardProps> = ({ dev, isHorizontal = false }) => (
        <div
            className={`developer-card ${isHorizontal ? "horizontal-card" : ""}`}
            onClick={() => setSelectedDev(dev)}
        >
            <div className="dev-img-container">
                <img src={dev.image} alt={dev.name} className="dev-img" onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/150'; }} />
            </div>
            <div className="dev-content">
                <h3 className="dev-name">{dev.name}</h3>
                <p className="dev-role">{dev.role}</p>
                <div className="dev-desc">
                    <div>
                        {dev.id} ({dev.batch})
                    </div>
                    <div>{dev.dept}</div>
                    <div>{dev.college}</div>
                </div>
                <div className="dev-socials">
                    {dev.linkedin && (
                        <a
                            href={dev.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="social-link"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <i className="pi pi-linkedin"></i>
                        </a>
                    )}
                    {dev.github && (
                        <a
                            href={dev.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="social-link"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <i className="pi pi-github"></i>
                        </a>
                    )}
                    {dev.facebook && (
                        <a
                            href={dev.facebook}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="social-link"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <i className="pi pi-facebook"></i>
                        </a>
                    )}
                    {dev.instagram && (
                        <a
                            href={dev.instagram}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="social-link"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <i className="pi pi-instagram"></i>
                        </a>
                    )}
                </div>
            </div>
        </div>
    );

    return (
        <div className="developers-container">
            {/* Background Glow Effect */}
            <div
                style={{
                    position: "fixed",
                    bottom: "-15vh",
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: "100vw",
                    height: "40vh",
                    background: "rgba(59, 130, 246, 0.5)",
                    filter: "blur(100px)",
                    borderRadius: "50% 50% 0 0",
                    zIndex: 0,
                    pointerEvents: "none",
                }}
            />
            <div className="developers-content">
                <div className="page-header">
                    <button className="back-btn" onClick={() => navigate("/")}>
                        <i className="pi pi-arrow-left" style={{ fontSize: '1.2rem' }}></i>
                    </button>
                    <h1 className="page-title">Meet the Developers</h1>
                </div>

                <h2 className="section-title">Version (V1.0) Developers</h2>
                <div className="developers-grid">
                    {developersV1.map((dev, index) => (
                        <DeveloperCard key={index} dev={dev} />
                    ))}
                </div>

                <h2 className="section-title">Version (V2.0) Developer</h2>
                <div className="developers-grid">
                    {developersV2.map((dev, index) => (
                        <DeveloperCard key={index} dev={dev} isHorizontal={true} />
                    ))}
                </div>

                <div className="gallery-section">
                    <div className="carousel-container-single">
                        <div className="carousel-wrapper">
                            <img
                                src={galleryImages[currentIndex]}
                                alt={`Gallery ${currentIndex + 1}`}
                                className="carousel-img-single"
                                style={{
                                    animation: 'fadeIn 0.5s ease-in-out'
                                }}
                            />

                            <button className="carousel-btn prev" onClick={prevImage}>
                                <i className="pi pi-chevron-left"></i>
                            </button>
                            <button className="carousel-btn next" onClick={nextImage}>
                                <i className="pi pi-chevron-right"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal */}
            {selectedDev && (
                <div
                    className="modal-overlay"
                    onClick={() => setSelectedDev(null)}
                >
                    <div
                        className="modal-content"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            className="modal-close"
                            onClick={() => setSelectedDev(null)}
                        >
                            <i className="pi pi-times"></i>
                        </button>
                        <div className="modal-body">
                            <div className="modal-img-container">
                                <img src={selectedDev.image} alt={selectedDev.name} className="modal-img" onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/150'; }} />
                            </div>
                            <h2 className="modal-name">{selectedDev.name}</h2>
                            <p className="modal-role">{selectedDev.role}</p>
                            <div className="modal-details">
                                <p>{selectedDev.id}</p>
                                <p>{selectedDev.batch}</p>
                                <p>{selectedDev.dept}</p>
                                <p>{selectedDev.college}</p>
                            </div>
                            <div className="dev-socials modal-socials">
                                {selectedDev.linkedin && (
                                    <a
                                        href={selectedDev.linkedin}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="social-link"
                                    >
                                        <i className="pi pi-linkedin" style={{ fontSize: '1.2rem' }}></i>
                                    </a>
                                )}
                                {selectedDev.github && (
                                    <a
                                        href={selectedDev.github}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="social-link"
                                    >
                                        <i className="pi pi-github" style={{ fontSize: '1.2rem' }}></i>
                                    </a>
                                )}
                                {selectedDev.facebook && (
                                    <a
                                        href={selectedDev.facebook}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="social-link"
                                    >
                                        <i className="pi pi-facebook" style={{ fontSize: '1.2rem' }}></i>
                                    </a>
                                )}
                                {selectedDev.instagram && (
                                    <a
                                        href={selectedDev.instagram}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="social-link"
                                    >
                                        <i className="pi pi-instagram" style={{ fontSize: '1.2rem' }}></i>
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Developers;
