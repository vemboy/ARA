"use client";

import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Link from "next/link";
import Footer from "@/app/footer";
import AboutStats from "@/app/AboutStats"; // adjust import if needed
import { useRouter, usePathname } from "next/navigation";

/**
 * Smoothly scroll to an element by id, applying a positive offset (scroll above the element).
 * E.g., offset = 25 will stop 25px *above* the element's top.
 */
const smoothScrollToElement = (elementId: string, offset = 0) => {
  const targetEl = document.getElementById(elementId);
  if (!targetEl) return;

  const start = window.scrollY;
  const end = targetEl.getBoundingClientRect().top + window.scrollY - offset;
  const duration = 1000; // 1 second
  const startTime = performance.now();

  const animate = (currentTime: number) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    // A simple cubic ease
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
};

export default function AboutPage() {
  const router = useRouter();
  const pathName = usePathname();

  // Scroll handlers
  const handleCollectionClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (pathName === "/") {
      smoothScrollToElement("ara-search-bar", 150);
    } else {
      router.push("/");
      setTimeout(() => {
        smoothScrollToElement("ara-search-bar", 150);
      }, 500);
    }
  };

  const handleArchiveClick = () => {
    if (pathName === "/") {
      smoothScrollToElement("ara-main", 25);
    } else {
      router.push("/");
      setTimeout(() => {
        smoothScrollToElement("ara-main", 25);
      }, 500);
    }
  };

  const [aboutHtml, setAboutHtml] = useState<string>("");
  const [aboutHtmlAr, setAboutHtmlAr] = useState<string>("");
  const [creditsHtml, setCreditsHtml] = useState<string>("");

  // Menu state and refs
  const [isMenuVisible, setIsMenuVisible] = useState(true);
  const [userToggledMenu, setUserToggledMenu] = useState(false);
  const menuLinksWrapperRef = useRef<HTMLDivElement>(null);
  const menuIconRef = useRef<HTMLDivElement>(null);
  const lastToggleTimeRef = useRef<number>(0);
  const toggleDelay = 300; // ms delay before next toggle is allowed

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

  useEffect(() => {
  // Force a tiny scroll to trigger reflow
  window.scrollBy(0, 1);
  window.scrollBy(0, -1);
}, []);

  // Fetch Credits copy (filter by area === "Credits")
  useEffect(() => {
    axios
      .get(
        "https://ara.directus.app/items/Copy?filter[area][_eq]=Credits&fields=Text"
      )
      .then((response) => {
        const creditsData = response.data?.data;
        if (creditsData && creditsData.length > 0 && creditsData[0].Text) {
          setCreditsHtml(creditsData[0].Text);
        }
      })
      .catch((error) => {
        console.error("Error fetching Credits copy:", error);
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
            {/* COLLECTION link with our custom onClick */}
            <Link href="/" onClick={handleCollectionClick}>
              COLLECTION <br /> ՀԱՎԱՔԱԾՈՅ
            </Link>
            ●
            <Link href="/about">
              ABOUT US <br /> ՄԵՐ ՄԱՍԻՆ
            </Link>
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
            <h1>Մեր Մասին</h1>
            <div dangerouslySetInnerHTML={{ __html: aboutHtmlAr }} />
          </div>
        </div>

        <AboutStats />

        {/* Credits Section (centered horizontally) */}
        {creditsHtml && (
          <div
            className="ara-credits"
            dangerouslySetInnerHTML={{ __html: creditsHtml }}
          />
        )}
      </div>
      <Footer />
    </>
  );
}
