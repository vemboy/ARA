"use client";

import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Link from "next/link";
import Footer from "../footer";

export default function AboutPage() {
  const [aboutHtml, setAboutHtml] = useState<string>("");
  const [recordImage, setRecordImage] = useState<string | null>(null);

  // Menu state and refs
  const [isMenuVisible, setIsMenuVisible] = useState(true);
  const [userToggledMenu, setUserToggledMenu] = useState(false);
  const menuLinksWrapperRef = useRef<HTMLDivElement>(null);
  const menuIconRef = useRef<HTMLDivElement>(null);

  // Use a ref to track the last time the menu was toggled
  const lastToggleTimeRef = useRef<number>(0);
  const toggleDelay = 300; // milliseconds delay before next toggle is allowed

  // Remodeled scroll effect using fixed thresholds and a time guard
  useEffect(() => {
    // Set thresholds that create a dead zone (hysteresis)
    const collapseThreshold = 120; // if scrollY exceeds 120 and menu is visible, collapse it
    const expandThreshold = 80; // if scrollY falls below 80 and menu is collapsed, expand it

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

  // Manual menu toggle function
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

  // Fetch About Us text
  useEffect(() => {
    axios
      .get("https://ara.directus.app/items/Copy/1?fields=Text")
      .then((response) => {
        if (response.data?.data?.Text) {
          setAboutHtml(response.data.data.Text);
        }
      })
      .catch((error) => {
        console.error("Error fetching About Us copy:", error);
      });
  }, []);

  // Fetch a random record image
  useEffect(() => {
    axios
      .get("https://ara.directus.app/items/record_archive?fields=record_image&limit=-1")
      .then((response) => {
        const records = response.data?.data;
        if (Array.isArray(records) && records.length > 0) {
          const randomRecord = records[Math.floor(Math.random() * records.length)];
          if (randomRecord?.record_image) {
            setRecordImage(`https://ara.directus.app/assets/${randomRecord.record_image}`);
          }
        }
      })
      .catch((error) => {
        console.error("Error fetching random record image:", error);
      });
  }, []);

  return (
    <div className="ara-main">
      <div className="ara-menu">
        <div className="ara-menu-title">ARMENIAN RECORD ARCHIVE</div>
        <div className="ara-menu-links-wrapper expanded" ref={menuLinksWrapperRef}>
          <Link href="/">
            COLLECTION <br /> ՀԱՎԱՔԱՑՈՒ
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

      <div className="ara-about-wrapper">
        <div className="ara-about-image-container">
          {recordImage && (
            <img src={recordImage} alt="Random Record" className="ara-about-image" />
          )}
        </div>
        <div className="ara-about-text">
          <h1>About Us</h1>
          <div dangerouslySetInnerHTML={{ __html: aboutHtml }} />
        </div>
      </div>

      <Footer />
    </div>
  );
}
