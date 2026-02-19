
import { view } from "framer-motion";
import React from "react";
import { FaDownload } from "react-icons/fa";



const resumeUrl = "https://github.com/user-attachments/files/25412455/abhi.resume.pdf";

const Resume = () => {
    const handleViewResume = () => {
        window.open(resumeUrl, "_blank");
    };

    return (
        <div className="flex flex-col items-center justify-center gap-6">
            <button
                className="px-6 py-2 bg-primary rounded-full text-white hover:bg-blue-700  items-center gap-2 inline-flex text-sm font-semibold text-primary-foreground transition hover:opacity-90"
                onClick={handleViewResume}
            > 
                <FaDownload className="text-white" />
                Resume  
            </button>
        </div>
    );
};

export default Resume;