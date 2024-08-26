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

interface Props {}

const Album: React.FC<Props> = ({}) => {
  const [record, setRecord] = useState(null);
  const pathName = usePathname();
  const recordId = pathName.split("/").slice(-1)[0];
  console.log(pathName);
  console.log(recordId);

  const [isImageEnlarged, setIsImageEnlarged] = useState(false);
  const [footerVisible, setFooterVisible] = useState(false);

  useEffect(() => {
    axios
      .get(`https://ara.directus.app/items/record_archive/${recordId}`)
      .then((response) => {
        console.log(response);
        setRecord(response.data.data);
      });
  }, []);

  if (record === null) {
    return null;
  }

  return (
    <>
      <div className="main-container">
        {/* Sidebar */}
        <div className="sidebar">
          <div className="sidebar-logo-section-cd">
            <h1 className="sidebar-logo-text-cd">ARA</h1>
          </div>

          <div className="sidebar-content-cd">
            <div className="sidebar-nav-cd">
              <Link href="/collection" className="sidebar-nav-item-cd">
                Home
              </Link>
              <Link href="/about" className="sidebar-nav-item-cd">
                About
              </Link>
            </div>
          </div>

          <div className="sidebar-mini-footer-cd">
            <div className="sidebar-language-selector-cd">
              <label className="sidebar-footer-label-cd">Language:</label>
              <div className="sidebar-language-toggle-cd">
                <button className="sidebar-language-button-cd selected">
                  EN
                </button>
                <button className="sidebar-language-button-cd">HY</button>
              </div>
            </div>

            <div className="sidebar-subscribe-section-cd">
              <label className="sidebar-footer-label-cd">
                Subscribe for updates:
              </label>
              <input
                type="email"
                className="sidebar-footer-input-cd"
                placeholder="Enter your email"
              />
              <button className="sidebar-subscribe-button-cd">Subscribe</button>
            </div>

            <div className="sidebar-copyright-cd">
              <p>© 2024 ARA. All rights reserved. Fueled by Costco 🍗</p>
            </div>
          </div>
        </div>

        {/* Main Image & Thumbnails */}
        <div className="images">
          <div
            className="main-image"
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
                <div
                  className="image-backdrop-cd"
                  style={{ visibility: isImageEnlarged ? "visible" : "hidden" }}
                />
                <img
                  src={
                    record["record_image"]
                      ? getImageDetailUrl(record["record_image"])
                      : getDefaultImageDetailUrl()
                  }
                  alt="Enlarged Record Image"
                  className="enlarged-image-cd"
                  style={{ visibility: isImageEnlarged ? "visible" : "hidden" }}
                />
              </>
            )}
          </div>

          {/* Thumbnails */}
          <div className="thumbnails">
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
        </div>

        {/* Text Content */}
        <div className="text-content">
          <div className="header">
            {/* Armenian Title */}
            <h1 className="armenian-title-cd">
              {record["armenian_title"] ?? "No Armenian Title"}
            </h1>

            {/* English Title */}
            <h2 className="english-title-cd">
              {record["title"] ?? "No English Title"}
            </h2>

            {/* Record Description */}
            <p className="record-description-cd">
              {record["description"] ??
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit."}
            </p>

            {/* Record Metadata */}
            <div className="record-metadata-cd">
              <div className="record-id-cd">
                <strong className="record-id-label-cd">RECORD ID:</strong>
                <span className="record-id-value-cd">
                  {record["id"] ?? "XXXXXXXXXXXXXXXXXXX"}
                </span>
              </div>

              <div className="record-genres-cd">
                <strong className="record-genres-label-cd">GENRES:</strong>
                <span className="record-genres-value-cd">
                  {record["genre"] ?? "tarab"}
                </span>
              </div>

              <div className="record-date-cd">
                <strong className="record-date-label-cd">DATE:</strong>
                <span className="record-date-value-cd">
                  {record["record_original_recording_date"] ?? "1932"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Tracklist (Side A / Side B) */}
        <div className="tracklist">
          <div className="tracklist-side tracklist-side-a">
            <div className="side-title">Side A</div>
            {/* Example tracks */}
            <div className="track-item">
              <div className="track-name">Track 1</div>
              <div className="track-time">1:52</div>
            </div>
            <div className="track-item">
              <div className="track-name">Track 2</div>
              <div className="track-time">2:30</div>
            </div>
          </div>

          <div className="tracklist-side tracklist-side-b">
            <div className="side-title">Side B</div>
            <div className="track-item">
              <div className="track-name">Track 3</div>
              <div className="track-time">3:00</div>
            </div>
            <div className="track-item">
              <div className="track-name">Track 4</div>
              <div className="track-time">4:15</div>
            </div>
          </div>
        </div>

        {/* Detail Images */}
        <div className="detail-images">
          <div className="detail-image">Detail Image 1</div>
          <div className="detail-image">Detail Image 2</div>
        </div>
      </div>
    </>
  );
};

export default function CollectionDetail() {
  return <Album />;
}