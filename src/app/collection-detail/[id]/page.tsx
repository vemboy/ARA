"use client";

import Head from "next/head";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { usePathname } from "next/navigation";
import {
  getDefaultImageDetailUrl,
  getImageDetailUrl,
} from "@/utils/assetUtils";
import Link from "next/link";


import GridLayout from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

interface Props {}

const Album: React.FC<Props> = ({}) => {
  const [record, setRecord] = useState(null);
  const pathName = usePathname();
  const recordId = pathName.split("/").slice(-1)[0];
  console.log(pathName);
  console.log(recordId);

  const [isImageEnlarged, setIsImageEnlarged] = useState(false);
  const [footerVisible, setFooterVisible] = useState(false);

  const layout = [
    { i: "sidebar", x: 0, y: 0, w: 1, h: 10, static: true },  // Sidebar occupies 1 column
    { i: "main", x: 1, y: 0, w: 4, h: footerVisible ? 9 : 10, static: true },  // Main area
    { i: "footer", x: 1, y: 1, w: 4, h: 1, static: true },  // Footer area, y will adjust dynamically
  ];

  useEffect(() => {
    axios
      .get(`https://ara.directus.app/items/record_archive/${recordId}`)
      .then((response) => {
        console.log(response);
        setRecord(response.data.data);
      });
  }, []);

  console.log(recordId);
  if (record === null) {
    return null;
  }

  return (

        <>


    <div className="layout-container-cd">
    {/* Sidebar */}
    <div className="sidebar-cd">
      <div className="sidebar-logo-section-cd">
        <h1 className="sidebar-logo-text-cd">ARA</h1>
      </div>

      <div className="sidebar-content-cd">
        <div className="sidebar-nav-cd">
        <Link href="/collection" className="sidebar-nav-item-cd">Home</Link>
        <Link href="/about" className="sidebar-nav-item-cd">About</Link>

      </div>
      </div>

      <div className="sidebar-mini-footer-cd">
        <div className="sidebar-language-selector-cd">
          <label className="sidebar-footer-label-cd">Language:</label>
          <div className="sidebar-language-toggle-cd">
            <button className="sidebar-language-button-cd selected">EN</button>
            <button className="sidebar-language-button-cd">HY</button>
          </div>
        </div>

        <div className="sidebar-subscribe-section-cd">
          <label className="sidebar-footer-label-cd">Subscribe for updates:</label>
          <input type="email" className="sidebar-footer-input-cd" placeholder="Enter your email" />
          <button className="sidebar-subscribe-button-cd">Subscribe</button>
        </div>

        <div className="sidebar-copyright-cd">
          <p>© 2024 ARA. All rights reserved. Fueled by Costco 🍗</p>
        </div>
      </div>
    </div>

    {/* Main Content */}
    <div className={`main-content-cd ${footerVisible ? "main-content-footer-visible-cd" : ""}`}>
      {/* Left Column (Image) */}
<div
  className="main-image-column-cd"
  onClick={() => setIsImageEnlarged(!isImageEnlarged)}
>
  <img
    src={
      record["record_image"]
        ? getImageDetailUrl(record["record_image"])
        : getDefaultImageDetailUrl()
    }
    alt="Record Image"
    className="record-image-cd"
  />

  {isImageEnlarged && (
    <>
      <div className="image-backdrop-cd" style={{ visibility: isImageEnlarged ? 'visible' : 'hidden' }} />
      <img
        src={
          record["record_image"]
            ? getImageDetailUrl(record["record_image"])
            : getDefaultImageDetailUrl()
        }
        alt="Enlarged Record Image"
        className="enlarged-image-cd"
        style={{ visibility: isImageEnlarged ? 'visible' : 'hidden' }}
      />
    </>
  )}
</div>

  {/* New Right Column for Small Images */}
  <div className="small-images-column-cd">
    <img
      src={getImageDetailUrl(record["image_1"])}
      alt="Small Image 1"
      className="small-image-cd"
    />
    <img
      src={getImageDetailUrl(record["image_2"])}
      alt="Small Image 2"
      className="small-image-cd"
    />
    <img
      src={getImageDetailUrl(record["image_3"])}
      alt="Small Image 3"
      className="small-image-cd"
    />
  </div>

  {/* Right Column (Text Details) */}
  <div className="main-details-column-cd">
    {/* Armenian Title */}
    <h1 className="armenian-title-cd">{record["armenian_title"] ?? "No Armenian Title"}</h1>

    {/* English Title */}
    <h2 className="english-title-cd">{record["title"] ?? "No English Title"}</h2>

    {/* Record Description */}
    <p className="record-description-cd">
      {record["description"] ?? "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."}
    </p>

    {/* Record Metadata */}
    <div className="record-metadata-cd">
      <div className="record-id-cd">
        <strong className="record-id-label-cd">RECORD ID:</strong>
        <span className="record-id-value-cd">{record["id"] ?? "XXXXXXXXXXXXXXXXXXX"}</span>
      </div>

      <div className="record-genres-cd">
        <strong className="record-genres-label-cd">GENRES:</strong>
        <span className="record-genres-value-cd">{record["genre"] ?? "tarab"}</span>
      </div>

      <div className="record-date-cd">
        <strong className="record-date-label-cd">DATE:</strong>
        <span className="record-date-value-cd">{record["record_original_recording_date"] ?? "1932"}</span>
      </div>
    </div>
  </div>
</div>

    {/* Footer */}
    {footerVisible && (
      <div className="footer-cd">Footer Content</div>
    )}

    {/* Toggle Footer Button */}
    <button
      className="toggle-footer-button-cd"
      onClick={() => setFooterVisible(!footerVisible)}
    >
      Toggle Footer
    </button>
  </div>





 

    </>
  );
};

export default function CollectionDetail() {
  return (

    <>


        <Album></Album>





    </>
  );
}
