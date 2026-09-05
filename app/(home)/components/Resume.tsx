import React from "react";
import { FaDownload } from "react-icons/fa";

const Resume = () => {
  return (
    <a
      href="/resume.pdf"
      download="Abhishek_Kumar_Resume.pdf"
      className="brutal-btn w-full sm:w-auto bg-brutal-cyan text-black px-4 sm:px-6 py-2.5 text-xs sm:text-sm font-black tracking-wider gap-2 cursor-pointer relative z-20 pointer-events-auto select-auto"
    >
      <FaDownload className="h-3.5 w-3.5" />
      <span>RESUME.PDF</span>
    </a>
  );
};

export default Resume;