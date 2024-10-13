"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { usePathname } from "next/navigation";
import {
  getDefaultImageDetailUrl,
  getImageDetailUrl,
} from "@/utils/assetUtils";
import Link from "next/link";

interface RecordType {
  track_side: "A" | "B";
  track_number?: string;
  title_armenian?: string;
  title?: string;
  duration?: string;
  liner_notes_side_a?: string;
  liner_notes_side_b?: string;
  summary_side_a?: string;
  summary_side_b?: string;
  names_side_a?: string;
  names_side_b?: string;
  genre_side_a?: string;
  genre_side_b?: string;
  media_size_side_a?: string;
  media_size_side_b?: string;
  record_label_side_a?: string;
  record_label_side_b?: string;
  catalog_number_side_a?: string;
  catalog_number_side_b?: string;
  matrix_number_side_a?: string;
  matrix_number_side_b?: string;
  take_number_side_a?: string;
  take_number_side_b?: string;
  recording_date_side_a?: string;
  recording_date_side_b?: string;
  recording_location_side_a?: string;
  recording_location_side_b?: string;
  recording_repository_side_a?: string;
  recording_repository_side_b?: string;
  rights_advisory_side_a?: string;
  rights_advisory_side_b?: string;
  online_format_side_a?: string;
  online_format_side_b?: string;
  [key: string]: any; // For any additional fields
}

const Album: React.FC = () => {
  const [records, setRecords] = useState<RecordType[]>([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(0);
  const pathName = usePathname();
  const recordId = pathName.split("/").slice(-1)[0];

  const [currentIndex, setCurrentIndex] = useState<number>(0);

  // Images array for carousel
  const [images, setImages] = useState<string[]>([]);

  // Error and Loading States
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Find Side A and Side B records
  const sideARecord = records.find((record) => record.track_side === "A");
  const sideBRecord = records.find((record) => record.track_side === "B");

  // Fetching data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const initialResponse = await axios.get(
          `https://ara.directus.app/items/record_archive/${recordId}`
        );
        const initialRecord = initialResponse.data.data;
        const ARAID = initialRecord["ARAID"];

        // Fetch all records with the same ARAID (both tracks)
        const recordsResponse = await axios.get(
          `https://ara.directus.app/items/record_archive?filter[ARAID][_eq]=${ARAID}`
        );
        const fetchedRecords: RecordType[] = recordsResponse.data.data;
        setRecords(fetchedRecords);

        // Set up images for the carousel
        const imageUrls = fetchedRecords.map((record: any) =>
          record["record_image"]
            ? getImageDetailUrl(record["record_image"])
            : getDefaultImageDetailUrl()
        );

        // Add additional images if available
        if (initialRecord["image_1"]) {
          imageUrls.push(getImageDetailUrl(initialRecord["image_1"]));
        }
        if (initialRecord["image_2"]) {
          imageUrls.push(getImageDetailUrl(initialRecord["image_2"]));
        }
        if (initialRecord["image_3"]) {
          imageUrls.push(getImageDetailUrl(initialRecord["image_3"]));
        }

        setImages(imageUrls);
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load album details.");
        setIsLoading(false);
      }
    };

    fetchData();
  }, [recordId]);

  // Update current track based on image index
  useEffect(() => {
    if (records.length > 0) {
      setCurrentTrackIndex(currentIndex % records.length);
    }
  }, [currentIndex, records.length]);

  // Handle Image Click for Carousel
  const handleImageClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const containerWidth = event.currentTarget.offsetWidth;
    const clickPosition = event.nativeEvent.offsetX;

    if (clickPosition < containerWidth / 2) {
      // Previous image
      setCurrentIndex((prevIndex) =>
        (prevIndex - 1 + images.length) % images.length
      );
    } else {
      // Next image
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }
  };

  // Apply inline styles to <body> using useEffect
  useEffect(() => {
    // Define your desired body styles here
    const bodyStyles: React.CSSProperties = {
      backgroundColor: "#f4f4f4",
      fontFamily: "Arial, sans-serif",
      padding: "20px",
      margin: "0",
    };

    // Apply styles
    Object.assign(document.body.style, bodyStyles);

    // Cleanup function to reset styles when component unmounts
    return () => {
      // Reset to original styles or remove specific styles
      document.body.style.backgroundColor = "";
      document.body.style.fontFamily = "";
      document.body.style.padding = "";
      document.body.style.margin = "";
    };
  }, []); // Empty dependency array ensures this runs once on mount and cleanup on unmount

  // Early returns for loading and error states
  if (isLoading) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        Loading album details...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ color: "red", textAlign: "center", marginTop: "50px" }}>
        {error}
      </div>
    );
  }

  if (records.length === 0) {
    return (
      <div style={{ color: "red", textAlign: "center", marginTop: "50px" }}>
        No records found for this album.
      </div>
    );
  }

  const currentRecord = records[currentTrackIndex];

  return (
    <>
      <style jsx global>{`
        /* Global Styles with Increased Specificity */

        /* Ensure body styles override any external CSS */
        body {
          background-color: #f4f4f4 !important;
          font-family: Arial, sans-serif !important;
          padding: 20px !important;
          margin: 0 !important;
        }

        .container {
          /* max-width: 1200px; */
          margin: 0 auto;
          display: grid;
          gap: 50px;
          grid-template-areas:
            "images heading"
            "images tracklist"
            "images info"
            "metadata metadata";
          /* "gallery gallery"; */

          grid-template-columns: 35vw 2fr; /* Two columns for larger screens */
          /* grid-template-columns: 20vw 2fr; /* Two columns for larger screens */ */
        }

        /* Main Info Section */
        .main-info {
          display: contents; /* Keep structure, but remove the additional grid */
        }

        /* Left: Image + Thumbnails */
        .album-info {
          display: flex;
          flex-direction: column;
          gap: 10px;
          grid-area: images; /* Assign area name */
          border-radius: 20%;
          background-color: lightgray;
          padding: 50px;
          position: relative; /* Set position to relative */
          aspect-ratio: 1;
          overflow: hidden; /* Ensure no overflow */
        }

        .main-image-container {
          position: relative;
          width: 100%;
          cursor: default; /* Default cursor for the image container */
        }

        /* Change cursor to left arrow when hovering on the left side */
        .album-info::before {
          content: "";
          position: absolute;
          left: 0;
          top: 0;
          width: 50%; /* Half width for left side */
          height: 100%; /* Full height */
          cursor: url(
              "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='60' height='60' fill='white'><path d='M35 45l-15-15 15-15v30z'/></svg>"
            )
            30 30,
            auto; /* Larger custom left arrow */
          z-index: 10; /* Ensure it's above other content */
        }

        /* Change cursor to right arrow when hovering on the right side */
        .album-info::after {
          content: "";
          position: absolute;
          right: 0;
          top: 0;
          width: 50%; /* Half width for right side */
          height: 100%; /* Full height */
          cursor: url(
              "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='60' height='60' fill='white'><path d='M25 45l15-15-15-15v30z'/></svg>"
            )
            30 30,
            auto; /* Larger custom right arrow */
          z-index: 10; /* Ensure it's above other content */
        }

        .dots-container {
          text-align: center;
          /* margin-top: 10px; */
        }

        .dot {
          display: inline-block;
          width: 10px;
          height: 10px;
          background-color: #ccc;
          border-radius: 50%;
          /* margin: 0 5px; */
          cursor: pointer;
        }

        .dot.active {
          background-color: #333;
        }

        .main-image-container img {
          width: 100%;
          border-radius: 100%;
          outline: none; /* Removes the focus outline */
          user-select: none; /* Prevents text/image selection */
          -webkit-user-drag: none; /* For Safari */
          user-drag: none; /* Prevents image dragging */
        }

        .thumbnails {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr 1fr;
          /* grid-template-columns: 1fr 1fr; */
          gap: 10px;
        }

        .thumbnails img {
          width: 100%;
          /* border-radius: 20%; */
        }

        /* Right: Text Section */
        .text-info {
          display: flex;
          flex-direction: column;
          gap: 20px;
          /* grid-area: heading; /* Assign area name for text info */ */
        }

        /* Header Section */
        .header {
          display: grid;
          grid-template-columns: max-content 1fr;
          /* justify-content: space-between; */
          /* align-items: baseline; */
          border-bottom: 2px solid black;
          padding-bottom: 10px;
          grid-area: heading; /* Assign area name for text info */
        }

        .header h1 {
          font-size: 32px;
          text-transform: uppercase;
        }

        .header span {
          font-family: monospace;
          font-size: 16px;
          justify-self: end;
          /* font-feature-settings: "tnum" on; */
        }

        .album-subtitle {
          font-size: 24px;
          font-weight: lighter;
        }

        /* Side Section */
        .side-section {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 30px;
          /* border-top: 2px solid black; */
          grid-area: tracklist; /* Assign area name for the tracklist */
        }

        .side {
          /* padding-top: 10px; */
          /* border-top: 2px solid black; */
        }

        .side h4 {
          text-transform: uppercase;
          margin-bottom: 5px;
          font-size: 16px;
        }

        /* Song List: Three columns (Track Number, Title, Length) */
        .track-list {
          display: grid;
          grid-template-columns: 2ch 1fr 6ch; /* Track number, song title, song length */
          gap: 10px;
          align-items: baseline;
          border-top: 1px solid black;
          padding-top: 10px;
          /* align-items: start; /* Align items to the start of the cell */ */
        }

        .track-entry {
          display: contents; /* Allows track-entry to be a wrapper without affecting grid layout */
        }

        .track-entry:hover .track-number,
        .track-entry:hover .song-title,
        .track-entry:hover .song-length {
          font-weight: bold;
        }

        .track-number {
          font-size: 16px;
          /* text-align: center; /* Center align track number */ */
        }

        .song-title-container {
          display: flex;
          flex-direction: column; /* Stack the title and transliteration */
          align-items: flex-start; /* Align left */
        }

        .song-title {
          font-size: 24px;
          /* margin-bottom: 2px; /* Add spacing below song title */ */
          text-align: start; /* Align left */
          text-transform: uppercase;
        }

        /* .song-title:hover {
          font-weight: bold;
        } */

        .transliteration {
          font-style: italic;
          font-size: 16px;
          color: #555; /* Optional: softer color for transliteration */
          text-align: start; /* Align left */
        }

        .song-length {
          font-family: monospace;
          text-align: right;
          font-size: 18px;
        }

        /* Info Section below Side A and Side B */
        .info-section {
          display: grid;
          /* grid-template-columns: 1fr ; */
          grid-template-columns: 1fr 1fr;
          /* grid-template-rows: 1fr 1fr; */
          gap: 20px;
          padding-top: 20px;
          /* border-top: 2px solid black; */
          border-top: 1px solid black;
          grid-area: info; /* Assign area name for info section */
        }

        .info-entry {
          display: grid;
          grid-template-columns: 1fr;
        }

        .info-title {
          /* grid-column: span 2; */
          grid-row: 1;
          font-size: 16px;
          font-weight: bold;
          margin-bottom: 10px;
        }

        .info-content {
          /* grid-column: 2; */
          grid-row: 2;
          font-size: 14px;
          margin-bottom: 20px;
          max-width: 50ch;
          /* margin-left:30px; */
        }

        .gallery-section {
          grid-area: gallery; /* Assign area name */
        }

        .gallery-images {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr 1fr;
          /* grid-template-columns: 1fr 1fr; */
          gap: 10px;
        }

        .gallery-images img {
          /* width: 100%; */
          height: 100vh;
          /* border-radius: 20%; */
        }

        .meta-section {
          display: grid;
          grid-template-columns: 1fr;
          border-top: 2px solid black;
          border-bottom: 2px solid black;
          padding-bottom: 10px;
          grid-area: metadata; /* Assign area name */
        }

        .metadata-row {
          display: grid;
          grid-template-columns: 250px 1fr 1fr;
          border-top: 1px solid lightgray;
          grid-gap: 10px;
          padding: 10px 0;
        }

        /* Metadata Table Section */
        .metadata {
          background-color: #fff;
          border-collapse: collapse;
          width: 100%;
          margin-top: 20px;
        }

        .metadata th,
        .metadata td {
          border: 1px solid #ddd;
          padding: 10px;
          text-align: left;
        }

        .metadata th {
          background-color: #f9f9f9;
        }

        /* Footer Section (Images) */
        .footer-images {
          display: flex;
          justify-content: space-between;
        }

        .footer-images img {
          width: 45%;
        }

        /* Media Queries for Breakpoints */
        @media (max-width: 1024px) {
          /* Breakpoint for typical laptop */
          .container {
            grid-template-columns: 35vw 1fr; /* Stack images and text */
            /* grid-template-columns: 1fr 1fr; /* Stack images and text */ */
          }

          .side-section {
            grid-template-columns: 1fr; /* Stack Side A and Side B */
          }

          .info-section {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 800px) {
          /* Mobile narrow breakpoint */
          .container {
            grid-template-areas:
              "heading"
              "images"
              "tracklist"
              "info"
              "metadata";
            /* "gallery"; */
            grid-template-columns: 1fr; /* Single column layout */
          }

          .dots-container {
            margin-top: 5px;
          }

          .footer-images {
            flex-direction: column; /* Stack footer images vertically */
            align-items: center; /* Center footer images */
          }

          .footer-images img {
            width: 80%; /* Adjust width for footer images on mobile */
            margin-bottom: 10px; /* Add spacing between images */
          }
        }
      `}</style>

      <div className="container">
        {/* Header Section */}
        <div className="header">
          <h1>
            {currentRecord["record_label"] ? (
              currentRecord["record_label"]
            ) : (
              <span style={{ color: "red" }}>Label Name</span>
            )}
          </h1>
          <span>
            {currentRecord["id"] ? (
              currentRecord["id"]
            ) : (
              <span style={{ color: "red" }}>Record ID</span>
            )}
          </span>
          <h2 className="album-subtitle">
            {currentRecord["title"] ? (
              currentRecord["title"]
            ) : (
              <span style={{ color: "red" }}>Album Subtitle</span>
            )}
          </h2>
        </div>

        {/* Main Info Section */}
        <div className="main-info">
          {/* Left: Image + Thumbnails */}
          <div className="album-info">
            <div
              className="main-image-container"
              onClick={handleImageClick}
              onMouseMove={(e) => {
                const containerWidth = e.currentTarget.offsetWidth;
                if (e.nativeEvent.offsetX < containerWidth / 2) {
                  e.currentTarget.style.cursor =
                    "url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"60\" height=\"60\" fill=\"white\"><path d=\"M35 45l-15-15 15-15v30z\"/></svg>') 30 30, auto";
                } else {
                  e.currentTarget.style.cursor =
                    "url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"60\" height=\"60\" fill=\"white\"><path d=\"M25 45l15-15-15-15v30z\"/></svg>') 30 30, auto";
                }
              }}
            >
              <img
                src={images[currentIndex]}
                alt={`Side ${currentRecord.track_side}`}
                className="main-image"
                draggable="false"
              />
            </div>
            {/* Dots for image carousel */}
            <div className="dots-container">
              {images.map((_, index) => (
                <span
                  key={index}
                  className={`dot ${index === currentIndex ? "active" : ""}`}
                  onClick={() => setCurrentIndex(index)}
                ></span>
              ))}
            </div>
            {/* Uncomment and adjust thumbnails if needed */}
            {/* <div className="thumbnails">
              {images.map((imgSrc, index) => (
                <img key={index} src={imgSrc} alt={`Thumbnail ${index}`} />
              ))}
            </div> */}
          </div>

          {/* Right: Text Information */}
          <div className="text-info">
            {/* Track List */}
            <div className="side-section">
              <div className="side">
                <h4>Side A</h4>
                <div className="track-list">
                  {records
                    .filter((record) => record.track_side === "A")
                    .map((record: RecordType, index: number) => (
                      <div className="track-entry" key={`A-${index}`}>
                        <div className="track-number">
                          {record.track_number ? (
                            record.track_number
                          ) : (
                            <span style={{ color: "red" }}>Track #</span>
                          )}
                        </div>
                        <div className="song-title-container">
                          <div className="song-title">
                            {record.title_armenian ? (
                              record.title_armenian
                            ) : (
                              <span style={{ color: "red" }}>Armenian Title</span>
                            )}
                          </div>
                          <div className="transliteration">
                            {record.title ? (
                              record.title
                            ) : (
                              <span style={{ color: "red" }}>Transliteration</span>
                            )}
                          </div>
                        </div>
                        <div className="song-length">
                          {record.duration ? (
                            record.duration
                          ) : (
                            <span style={{ color: "red" }}>Duration</span>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              <div className="side">
                <h4>Side B</h4>
                <div className="track-list">
                  {records
                    .filter((record) => record.track_side === "B")
                    .map((record: RecordType, index: number) => (
                      <div className="track-entry" key={`B-${index}`}>
                        <div className="track-number">
                          {record.track_number ? (
                            record.track_number
                          ) : (
                            <span style={{ color: "red" }}>Track #</span>
                          )}
                        </div>
                        <div className="song-title-container">
                          <div className="song-title">
                            {record.title_armenian ? (
                              record.title_armenian
                            ) : (
                              <span style={{ color: "red" }}>Armenian Title</span>
                            )}
                          </div>
                          <div className="transliteration">
                            {record.title ? (
                              record.title
                            ) : (
                              <span style={{ color: "red" }}>Transliteration</span>
                            )}
                          </div>
                        </div>
                        <div className="song-length">
                          {record.duration ? (
                            record.duration
                          ) : (
                            <span style={{ color: "red" }}>Duration</span>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>

            {/* Info Section below Side A and Side B */}
            <div className="info-section">
              <div className="info-entry">
                <div className="info-title">SIDE A — LINER NOTES</div>
                <div className="info-content">
                  {sideARecord && sideARecord.liner_notes_side_a ? (
                    sideARecord.liner_notes_side_a
                  ) : (
                    <span style={{ color: "red" }}>Liner notes for Side A</span>
                  )}
                </div>
              </div>
              <div className="info-entry">
                <div className="info-title">SIDE B — LINER NOTES</div>
                <div className="info-content">
                  {sideBRecord && sideBRecord.liner_notes_side_b ? (
                    sideBRecord.liner_notes_side_b
                  ) : (
                    <span style={{ color: "red" }}>Liner notes for Side B</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Gallery Section (Optional) */}
        {/* <div className="gallery-section">
          <div className="gallery-images">
            {images.map((imgSrc, index) => (
              <img key={index} src={imgSrc} alt={`Gallery Image ${index}`} />
            ))}
          </div>
        </div> */}

        {/* Metadata Section */}
        <div className="meta-section">
          <h4>METADATA</h4>
          <br />
          <div className="metadata-row">
            <div>DATA TITLE</div>
            <div>SIDE A DATA</div>
            <div>SIDE B DATA</div>
          </div>

          {/* Title Row */}
          <div className="metadata-row">
            <div>Title</div>
            <div>
              {sideARecord && sideARecord.title ? (
                sideARecord.title
              ) : (
                <span style={{ color: "red" }}>Side A Title</span>
              )}
            </div>
            <div>
              {sideBRecord && sideBRecord.title ? (
                sideBRecord.title
              ) : (
                <span style={{ color: "red" }}>Side B Title</span>
              )}
            </div>
          </div>

          {/* Summary Row */}
          <div className="metadata-row">
            <div>Summary</div>
            <div>
              {sideARecord && sideARecord.summary_side_a ? (
                sideARecord.summary_side_a
              ) : (
                <span style={{ color: "red" }}>Summary for Side A</span>
              )}
            </div>
            <div>
              {sideBRecord && sideBRecord.summary_side_b ? (
                sideBRecord.summary_side_b
              ) : (
                <span style={{ color: "red" }}>Summary for Side B</span>
              )}
            </div>
          </div>

          {/* Names Row */}
          <div className="metadata-row">
            <div>Names</div>
            <div>
              {sideARecord && sideARecord.names_side_a ? (
                <div
                  dangerouslySetInnerHTML={{
                    __html: sideARecord.names_side_a.replace(
                      /\n/g,
                      "<br/>"
                    ),
                  }}
                />
              ) : (
                <span style={{ color: "red" }}>Names for Side A</span>
              )}
            </div>
            <div>
              {sideBRecord && sideBRecord.names_side_b ? (
                <div
                  dangerouslySetInnerHTML={{
                    __html: sideBRecord.names_side_b.replace(
                      /\n/g,
                      "<br/>"
                    ),
                  }}
                />
              ) : (
                <span style={{ color: "red" }}>Names for Side B</span>
              )}
            </div>
          </div>

          {/* Genre Row */}
          <div className="metadata-row">
            <div>Genre</div>
            <div>
              {sideARecord && sideARecord.genre_side_a ? (
                sideARecord.genre_side_a.replace(/\n/g, "<br/>")
              ) : (
                <span style={{ color: "red" }}>Genre for Side A</span>
              )}
            </div>
            <div>
              {sideBRecord && sideBRecord.genre_side_b ? (
                sideBRecord.genre_side_b.replace(/\n/g, "<br/>")
              ) : (
                <span style={{ color: "red" }}>Genre for Side B</span>
              )}
            </div>
          </div>

          {/* Media Size Row */}
          <div className="metadata-row">
            <div>Media Size</div>
            <div>
              {sideARecord && sideARecord.media_size_side_a ? (
                sideARecord.media_size_side_a
              ) : (
                <span style={{ color: "red" }}>Media Size for Side A</span>
              )}
            </div>
            <div>
              {sideBRecord && sideBRecord.media_size_side_b ? (
                sideBRecord.media_size_side_b
              ) : (
                <span style={{ color: "red" }}>Media Size for Side B</span>
              )}
            </div>
          </div>

          {/* Recording Label Row */}
          <div className="metadata-row">
            <div>Recording Label</div>
            <div>
              {sideARecord && sideARecord.record_label_side_a ? (
                sideARecord.record_label_side_a
              ) : (
                <span style={{ color: "red" }}>Recording Label for Side A</span>
              )}
            </div>
            <div>
              {sideBRecord && sideBRecord.record_label_side_b ? (
                sideBRecord.record_label_side_b
              ) : (
                <span style={{ color: "red" }}>Recording Label for Side B</span>
              )}
            </div>
          </div>

          {/* Recording Catalog Number Row */}
          <div className="metadata-row">
            <div>Recording Catalog Number</div>
            <div>
              {sideARecord && sideARecord.catalog_number_side_a ? (
                sideARecord.catalog_number_side_a
              ) : (
                <span style={{ color: "red" }}>Catalog Number for Side A</span>
              )}
            </div>
            <div>
              {sideBRecord && sideBRecord.catalog_number_side_b ? (
                sideBRecord.catalog_number_side_b
              ) : (
                <span style={{ color: "red" }}>Catalog Number for Side B</span>
              )}
            </div>
          </div>

          {/* Recording Matrix Number Row */}
          <div className="metadata-row">
            <div>Recording Matrix Number</div>
            <div>
              {sideARecord && sideARecord.matrix_number_side_a ? (
                sideARecord.matrix_number_side_a
              ) : (
                <span style={{ color: "red" }}>Matrix Number for Side A</span>
              )}
            </div>
            <div>
              {sideBRecord && sideBRecord.matrix_number_side_b ? (
                sideBRecord.matrix_number_side_b
              ) : (
                <span style={{ color: "red" }}>Matrix Number for Side B</span>
              )}
            </div>
          </div>

          {/* Recording Take Number Row */}
          <div className="metadata-row">
            <div>Recording Take Number</div>
            <div>
              {sideARecord && sideARecord.take_number_side_a ? (
                sideARecord.take_number_side_a
              ) : (
                <span style={{ color: "red" }}>Take Number for Side A</span>
              )}
            </div>
            <div>
              {sideBRecord && sideBRecord.take_number_side_b ? (
                sideBRecord.take_number_side_b
              ) : (
                <span style={{ color: "red" }}>Take Number for Side B</span>
              )}
            </div>
          </div>

          {/* Recording Date Row */}
          <div className="metadata-row">
            <div>Recording Date</div>
            <div>
              {sideARecord && sideARecord.recording_date_side_a ? (
                sideARecord.recording_date_side_a
              ) : (
                <span style={{ color: "red" }}>Recording Date for Side A</span>
              )}
            </div>
            <div>
              {sideBRecord && sideBRecord.recording_date_side_b ? (
                sideBRecord.recording_date_side_b
              ) : (
                <span style={{ color: "red" }}>Recording Date for Side B</span>
              )}
            </div>
          </div>

          {/* Recording Location Row */}
          <div className="metadata-row">
            <div>Recording Location</div>
            <div>
              {sideARecord && sideARecord.recording_location_side_a ? (
                sideARecord.recording_location_side_a
              ) : (
                <span style={{ color: "red" }}>Recording Location for Side A</span>
              )}
            </div>
            <div>
              {sideBRecord && sideBRecord.recording_location_side_b ? (
                sideBRecord.recording_location_side_b
              ) : (
                <span style={{ color: "red" }}>Recording Location for Side B</span>
              )}
            </div>
          </div>

          {/* Recording Repository Row */}
          <div className="metadata-row">
            <div>Recording Repository</div>
            <div>
              {sideARecord && sideARecord.recording_repository_side_a ? (
                sideARecord.recording_repository_side_a
              ) : (
                <span style={{ color: "red" }}>Recording Repository for Side A</span>
              )}
            </div>
            <div>
              {sideBRecord && sideBRecord.recording_repository_side_b ? (
                sideBRecord.recording_repository_side_b
              ) : (
                <span style={{ color: "red" }}>Recording Repository for Side B</span>
              )}
            </div>
          </div>

          {/* Rights Advisory Row */}
          <div className="metadata-row">
            <div>Rights Advisory</div>
            <div>
              {sideARecord && sideARecord.rights_advisory_side_a ? (
                sideARecord.rights_advisory_side_a
              ) : (
                <span style={{ color: "red" }}>Rights Advisory for Side A</span>
              )}
            </div>
            <div>
              {sideBRecord && sideBRecord.rights_advisory_side_b ? (
                sideBRecord.rights_advisory_side_b
              ) : (
                <span style={{ color: "red" }}>Rights Advisory for Side B</span>
              )}
            </div>
          </div>

          {/* Online Format Row */}
          <div className="metadata-row">
            <div>Online Format</div>
            <div>
              {sideARecord && sideARecord.online_format_side_a ? (
                sideARecord.online_format_side_a.replace(/\n/g, "<br/>")
              ) : (
                <span style={{ color: "red" }}>Online Format for Side A</span>
              )}
            </div>
            <div>
              {sideBRecord && sideBRecord.online_format_side_b ? (
                sideBRecord.online_format_side_b.replace(/\n/g, "<br/>")
              ) : (
                <span style={{ color: "red" }}>Online Format for Side B</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default function CollectionDetail() {
  return <Album />;
}
