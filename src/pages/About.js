import React from 'react';
import cyberSecureLogo from '../images/cyberSecureLogo.png';
import globalTechLogo from '../images/globalTechLogo.png';
import safetyNetLogo from '../images/safetyNetLogo.png';

const About = () => {
    return (
        <div className="retro-container max-w-4xl mx-auto p-6 border border-gray-400 rounded-lg bg-gray-900 text-black terminal-text">
            <h1 className="text-3xl font-bold mb-4">About GuardianLink</h1>
            <p className="mb-4">
                GuardianLink is a platform connecting cybersecurity specialists with non-profits in need of assistance.
                Our mission is to provide essential security services at no cost to non-profits.
            </p>
            <h2 className="text-2xl font-bold mb-2">Who Are We?</h2>
            <p className="mb-4">
                We are a team of dedicated professionals focused on making the digital world safer for non-profits.
            </p>
            <h2 className="text-2xl font-bold mb-2">What Do We Do?</h2>
            <p className="mb-4">
                We connect skilled cybersecurity volunteers with non-profits to address their cybersecurity challenges.
            </p>
            <h2 className="text-2xl font-bold mb-2">Why Do We Do It?</h2>
            <p className="mb-4">
                Non-profits often lack the resources to handle cybersecurity threats. We aim to bridge that gap by leveraging
                volunteers' expertise.
            </p>
            <h2 className="text-2xl font-bold mb-4">Partnerships</h2>
            <div className="partnership-logos flex justify-between items-center">
                <img
                    src={cyberSecureLogo}
                    alt="CyberSecure Initiative Logo"
                    className="partnership-logo"
                />
                <img
                    src={globalTechLogo}
                    alt="Global Tech Volunteers Logo"
                    className="partnership-logo"
                />
                <img
                    src={safetyNetLogo}
                    alt="SafetyNet Alliance Logo"
                    className="partnership-logo"
                />
            </div>
        </div>
    );
};

export default About;

