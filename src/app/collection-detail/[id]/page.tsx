"use client";

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
  const [records, setRecords] = useState<any[]>([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const pathName = usePathname();
  const recordId = pathName.split("/").slice(-1)[0];

  const [isImageEnlarged, setIsImageEnlarged] = useState(false);
  const [footerVisible, setFooterVisible] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false); // Added state for flip animation

  useEffect(() => {
    axios
      .get(`https://ara.directus.app/items/record_archive/${recordId}`)
      .then((response) => {
        const initialRecord = response.data.data;
        const ARAID = initialRecord["ARAID"];

        // Fetch all records with the same ARAID (both tracks)
        axios
          .get(
            `https://ara.directus.app/items/record_archive?filter[ARAID][_eq]=${ARAID}`
          )
          .then((recordsResponse) => {
            setRecords(recordsResponse.data.data);
          });
      });
  }, []);

  if (records.length === 0) {
    return null;
  }

  const currentRecord = records[currentTrackIndex];

  // Function to handle image click
  const handleImageClick = () => {
    // Flip the image and switch tracks
    setIsFlipped(true);
    setTimeout(() => {
      setCurrentTrackIndex((currentTrackIndex + 1) % records.length);
      setIsFlipped(false);
    }, 600); // Duration of the flip animation in milliseconds
  };

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
              <button className="sidebar-subscribe-button-cd">
                Subscribe
              </button>
            </div>

            <div className="sidebar-copyright-cd">
              <p>© 2024 ARA. All rights reserved. Fueled by Costco 🍗</p>
            </div>
          </div>
        </div>

        {/* Main Image & Thumbnails */}
        <div className="images">
          <div
            className={`main-image ${isFlipped ? "flipped" : ""}`}
            onClick={handleImageClick}
            style={{ cursor: "pointer" }}
          >
            <img
              src={
                currentRecord["record_image"]
                  ? getImageDetailUrl(currentRecord["record_image"])
                  : getDefaultImageDetailUrl()
              }
              alt="Record Image"
              className="record-image-cd"
            />
          </div>

          {/* Thumbnails */}
          <div className="thumbnails">
            {currentRecord["image_1"] && (
              <img
                src={getImageDetailUrl(currentRecord["image_1"])}
                alt="Small Image 1"
                className="small-image-cd"
              />
            )}
            {currentRecord["image_2"] && (
              <img
                src={getImageDetailUrl(currentRecord["image_2"])}
                alt="Small Image 2"
                className="small-image-cd"
              />
            )}
            {currentRecord["image_3"] && (
              <img
                src={getImageDetailUrl(currentRecord["image_3"])}
                alt="Small Image 3"
                className="small-image-cd"
              />
            )}
          </div>
        </div>

        {/* Text Content */}
        <div className="text-content">
          <div className="header">
            {/* Armenian Title */}
            <h1 className="armenian-title-cd">
              {currentRecord["title_armenian"] ?? "No Armenian Title"}
            </h1>

            {/* English Title */}
            <h2 className="english-title-cd">
              {currentRecord["title"] ?? "No English Title"}
            </h2>

            {/* Record Description */}
            <p className="record-description-cd">
              {currentRecord["description"] ??
                "No description available for this record."}
            </p>

            {/* Record Metadata */}
            <div className="record-metadata-cd">
              {/* Record ID */}
              <div className="record-id-cd">
                <strong className="record-id-label-cd">RECORD ID:</strong>
                <span className="record-id-value-cd">
                  {currentRecord["id"] ?? "N/A"}
                </span>
              </div>

              {/* ARAID */}
              <div className="record-araid-cd">
                <strong className="record-araid-label-cd">ARAID:</strong>
                <span className="record-araid-value-cd">
                  {currentRecord["ARAID"] ?? "N/A"}
                </span>
              </div>

              {/* Genres */}
              <div className="record-genres-cd">
                <strong className="record-genres-label-cd">GENRES:</strong>
                <span className="record-genres-value-cd">
                  {currentRecord["genres"]
                    ? currentRecord["genres"].join(", ")
                    : "N/A"}
                </span>
              </div>

              {/* Instruments */}
              <div className="record-instruments-cd">
                <strong className="record-instruments-label-cd">
                  INSTRUMENTS:
                </strong>
                <span className="record-instruments-value-cd">
                  {currentRecord["instruments"]
                    ? currentRecord["instruments"].join(", ")
                    : "N/A"}
                </span>
              </div>

              {/* Language */}
              <div className="record-language-cd">
                <strong className="record-language-label-cd">LANGUAGE:</strong>
                <span className="record-language-value-cd">
                  {currentRecord["language"]
                    ? currentRecord["language"].join(", ")
                    : "N/A"}
                </span>
              </div>

              {/* Artist */}
              <div className="record-artist-cd">
                <strong className="record-artist-label-cd">ARTIST:</strong>
                <span className="record-artist-value-cd">
                  {currentRecord["artist_original"] ?? "N/A"}
                </span>
              </div>

              {/* Artist 2 */}
              <div className="record-artist-2-cd">
                <strong className="record-artist-2-label-cd">ARTIST 2:</strong>
                <span className="record-artist-2-value-cd">
                  {currentRecord["artist_2"] ?? "N/A"}
                </span>
              </div>

              {/* Arranged By */}
              <div className="record-arranged-by-cd">
                <strong className="record-arranged-by-label-cd">
                  ARRANGED BY:
                </strong>
                <span className="record-arranged-by-value-cd">
                  {currentRecord["arranged_by"] ?? "N/A"}
                </span>
              </div>

              {/* Composed By */}
              <div className="record-composed-by-cd">
                <strong className="record-composed-by-label-cd">
                  COMPOSED BY:
                </strong>
                <span className="record-composed-by-value-cd">
                  {currentRecord["composed_by"] ?? "N/A"}
                </span>
              </div>

              {/* Conducted By */}
              <div className="record-conducted-by-cd">
                <strong className="record-conducted-by-label-cd">
                  CONDUCTED BY:
                </strong>
                <span className="record-conducted-by-value-cd">
                  {currentRecord["conducted_by"] ?? "N/A"}
                </span>
              </div>

              {/* Lyrics By */}
              <div className="record-lyrics-by-cd">
                <strong className="record-lyrics-by-label-cd">
                  LYRICS BY:
                </strong>
                <span className="record-lyrics-by-value-cd">
                  {currentRecord["lyrics_by"] ?? "N/A"}
                </span>
              </div>

              {/* Date */}
              <div className="record-date-cd">
                <strong className="record-date-label-cd">DATE:</strong>
                <span className="record-date-value-cd">
                  {currentRecord["track_year"] ?? "N/A"}
                </span>
              </div>

              {/* Region */}
              <div className="record-region-cd">
                <strong className="record-region-label-cd">REGION:</strong>
                <span className="record-region-value-cd">
                  {currentRecord["region"] ?? "N/A"}
                </span>
              </div>

              {/* Label */}
              <div className="record-label-cd">
                <strong className="record-label-label-cd">LABEL:</strong>
                <span className="record-label-value-cd">
                  {currentRecord["record_label"] ?? "N/A"}
                </span>
              </div>

              {/* Comment */}
              <div className="record-comment-cd">
                <strong className="record-comment-label-cd">COMMENT:</strong>
                <span className="record-comment-value-cd">
                  {currentRecord["comment"] ?? "N/A"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Tracklist (Side A / Side B) */}
        <div className="tracklist">
          <div className="tracklist-side tracklist-side-a">
            <div className="side-title">
              {currentRecord["track_side"] ?? "Side"}
            </div>
            <div className="track-item">
              <div className="track-name">
                {currentRecord["title"] ?? "Track Title"}
              </div>
              <div className="track-time">
                {currentRecord["duration"] ?? ""}
              </div>
            </div>
          </div>
        </div>

        {/* Detail Images */}
        <div className="detail-images">
          {/* Display supplemental images if available */}
          {currentRecord["supplemental_image"] && (
            <img
              src={getImageDetailUrl(currentRecord["supplemental_image"])}
              alt="Detail Image 1"
              className="detail-image"
            />
          )}
          {/* Additional detail images */}
          {currentRecord["image_1"] && (
            <img
              src={getImageDetailUrl(currentRecord["image_1"])}
              alt="Detail Image 2"
              className="detail-image"
            />
          )}
          {currentRecord["image_2"] && (
            <img
              src={getImageDetailUrl(currentRecord["image_2"])}
              alt="Detail Image 3"
              className="detail-image"
            />
          )}
        </div>
      </div>
    </>
  );
};

export default function CollectionDetail() {
  return <Album />;
}
