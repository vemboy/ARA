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
          <a href="#">Facebook</a>
          <a href="#">Instagram</a>
          <a href="#">YouTube</a>
        </div>
        <div className="blurb">
          Made with 💙 սեր և սուճ ☕
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
