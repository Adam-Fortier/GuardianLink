import React from 'react';

const About = () => {
    return (
        <div className="max-w-4xl mx-auto p-6">
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
            <h2 className="text-2xl font-bold mb-2">Partnerships</h2>
            <ul className="list-disc pl-6">
                <li>CyberSecure Initiative</li>
                <li>Global Tech Volunteers</li>
                <li>SafetyNet Alliance</li>
            </ul>
        </div>
    );
};

export default About;
