"use client";

import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Link from "next/link";
import Footer from "@/app/footer";
import AboutStats from "@/app/AboutStats"; // or wherever you placed it
import { useRouter, usePathname } from "next/navigation";

export default function AboutPage() {
    const router = useRouter();
  const pathName = usePathname();

  // This function scrolls to the element with id "filters" with a 200px offset
const smoothScrollToFilters = () => {
  const filterEl = document.getElementById("filters");
  if (filterEl) {
    const offset = 200; // 200px offset; adjust as needed
    const start = window.scrollY;
    const end = Math.max(filterEl.offsetTop - offset, 0);
    const duration = 1000; // duration in ms
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeInOutCubic =
        progress < 0.5
          ? 4 * progress * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 3) / 2;
      window.scrollTo(0, start + (end - start) * easeInOutCubic);
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }
};

// Handler that checks the current pathname and either smooth scrolls
// or redirects to "/" and then scrolls.
const handleArchiveClick = () => {
  if (pathName === "/") {
    // On the collection page—smooth scroll to the Filters element.
    smoothScrollToFilters();
  } else {
    // Not on the collection page—redirect to "/" then scroll.
    router.push("/");
    setTimeout(() => {
      smoothScrollToFilters();
    }, 500);
  }
};

  const [aboutHtml, setAboutHtml] = useState<string>("");
  const [aboutHtmlAr, setAboutHtmlAr] = useState<string>("");

  // Menu state and refs
  const [isMenuVisible, setIsMenuVisible] = useState(true);
  const [userToggledMenu, setUserToggledMenu] = useState(false);
  const menuLinksWrapperRef = useRef<HTMLDivElement>(null);
  const menuIconRef = useRef<HTMLDivElement>(null);
  const lastToggleTimeRef = useRef<number>(0);
  const toggleDelay = 300; // milliseconds delay before next toggle is allowed

  // Scroll effect for menu
  useEffect(() => {
    const collapseThreshold = 120;
    const expandThreshold = 80;
    let ticking = false;

    const handleScroll = () => {
      if (userToggledMenu) return;
      const menuLinks = menuLinksWrapperRef.current;
      const menuIcon = menuIconRef.current;
      if (!menuLinks || !menuIcon) return;

      const currentScrollY = window.scrollY;
      const now = Date.now();
      if (now - lastToggleTimeRef.current < toggleDelay) return;

      if (isMenuVisible && currentScrollY > collapseThreshold) {
        menuLinks.classList.remove("expanded");
        menuIcon.classList.remove("clicked");
        setIsMenuVisible(false);
        lastToggleTimeRef.current = now;
      } else if (!isMenuVisible && currentScrollY < expandThreshold) {
        menuLinks.classList.add("expanded");
        menuIcon.classList.add("clicked");
        setIsMenuVisible(true);
        lastToggleTimeRef.current = now;
      }
    };

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [isMenuVisible, userToggledMenu]);

  // Manual menu toggle
  const toggleMenu = () => {
    setUserToggledMenu(true);
    const menuLinks = menuLinksWrapperRef.current;
    const menuIcon = menuIconRef.current;
    if (!menuLinks || !menuIcon) return;
    if (isMenuVisible) {
      menuLinks.classList.remove("expanded");
      menuIcon.classList.remove("clicked");
      setIsMenuVisible(false);
    } else {
      menuLinks.classList.add("expanded");
      menuIcon.classList.add("clicked");
      setIsMenuVisible(true);
    }
    setTimeout(() => {
      setUserToggledMenu(false);
    }, toggleDelay);
  };

  // Fetch About Us text (both languages)
  useEffect(() => {
    axios
      .get("https://ara.directus.app/items/Copy/1?fields=Text,text_ar")
      .then((response) => {
        if (response.data?.data) {
          const data = response.data.data;
          if (data.Text) {
            setAboutHtml(data.Text);
          }
          if (data.text_ar) {
            setAboutHtmlAr(data.text_ar);
          }
        }
      })
      .catch((error) => {
        console.error("Error fetching About Us copy:", error);
      });
  }, []);

  return (
    <>
      <div className="ara-main">
        {/* Top Menu */}
        <div className="ara-menu">
                <div
        className="ara-menu-title"
        id="ara-menu-title"
        onClick={handleArchiveClick}
        style={{ cursor: "pointer" }}
      >
        ARMENIAN RECORD ARCHIVE
      </div>
          <div
            className="ara-menu-links-wrapper expanded"
            ref={menuLinksWrapperRef}
          >
            <Link href="/">COLLECTION <br /> ՀԱՎԱՔԱՑՈՒ</Link>
            ●
            <Link href="/about">ABOUT US <br /> ՄԵՐ ՄԱՍԻՆ</Link>
          </div>
          <div className="ara-menu-toggle" onClick={toggleMenu}>
            <div className="ara-menu-icon" ref={menuIconRef}>
              <div className="ara-menu-icon-sleeve"></div>
              <div className="ara-menu-icon-record"></div>
            </div>
          </div>
        </div>

        {/* About Content: Two-column layout */}
        <div className="ara-about-wrapper">
          <div className="ara-about-text-left">
            <h1>About Us</h1>
            <div dangerouslySetInnerHTML={{ __html: aboutHtml }} />
          </div>
          <div className="ara-about-text-right">
            <h1>Text AR</h1>
            <div dangerouslySetInnerHTML={{ __html: aboutHtmlAr }} />
          </div>

        </div>
        <AboutStats />
      </div>
      <Footer />
    </>
  );
}
