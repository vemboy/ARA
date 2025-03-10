"use client";
import React, { useEffect } from "react";

const Footer: React.FC = () => {
  useEffect(() => {
    const rotatingElement = document.querySelector(".rotating");
    if (!rotatingElement) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          rotatingElement.classList.remove("paused");
        } else {
          rotatingElement.classList.add("paused");
        }
      });
    });
    observer.observe(rotatingElement);
    return () => observer.disconnect();
  }, []);

  return (
    <>
<div className="footer">
  <img src="/ara_footer.svg" alt="Armenian Record Archive" />
</div>
      <div className="footer_grid">
<div className="social_media_links">
  <a href="https://www.facebook.com/ArmenianRecordArchive/" target="_blank" rel="noopener noreferrer">Facebook</a>
  <a href="https://www.instagram.com/armenianrecordarchive" target="_blank" rel="noopener noreferrer">Instagram</a>
  <a href="https://www.youtube.com/@armenianrecordarchive6025" target="_blank" rel="noopener noreferrer">YouTube</a>
</div>
        <div className="blurb">
          Made with 💙 սէր և սուրճ ☕
        </div>
        <div className="animated-text">
          <span>[</span>
          <span>,</span>
          <span className="rotating">֎</span>
          <span>/]</span>
          <span>~~~</span>
          <span>d[(-_-)]b</span>
        </div>
      </div>
    </>
  );
};

export default Footer;
