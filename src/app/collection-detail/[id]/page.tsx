"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { usePathname } from "next/navigation";
import {
  getDefaultImageDetailUrl,
  getImageDetailUrl,
} from "@/utils/assetUtils";

interface RecordType {
  [key: string]: any;
}

const Album: React.FC = () => {
  const [records, setRecords] = useState<RecordType[]>([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(0);
  const pathName = usePathname();
  const recordId = pathName.split("/").slice(-1)[0];

  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [images, setImages] = useState<string[]>([]);

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

            // Prepare images array for the image slider
            const recordImages = recordsResponse.data.data.map(
              (record: RecordType) =>
                record["record_image"]
                  ? getImageDetailUrl(record["record_image"])
                  : getDefaultImageDetailUrl()
            );
            setImages(recordImages);
          });
      });
  }, []);

  if (records.length === 0) {
    return null;
  }

  const currentRecord = records[currentTrackIndex];

  // Function to handle image click
  const handleImageClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    const containerWidth = (event.currentTarget as HTMLElement).offsetWidth;
    const clickX = event.nativeEvent.offsetX;

    if (clickX < containerWidth / 2) {
      // Previous image
      const newIndex = (currentImageIndex - 1 + images.length) % images.length;
      setCurrentImageIndex(newIndex);
      setCurrentTrackIndex(newIndex);
    } else {
      // Next image
      const newIndex = (currentImageIndex + 1) % images.length;
      setCurrentImageIndex(newIndex);
      setCurrentTrackIndex(newIndex);
    }
  };

  // Metadata entries
  const metadataEntries = [
    {
      title: "Title",
      sideA: currentRecord["title"] ?? "N/A",
      sideB: records[1] ? records[1]["title"] ?? "N/A" : "N/A",
    },
    {
      title: "Summary",
      sideA: currentRecord["description"] ?? "N/A",
      sideB: records[1] ? records[1]["description"] ?? "N/A" : "N/A",
    },
    {
      title: "Names",
      sideA: currentRecord["names"] ? currentRecord["names"].join("\n") : "N/A",
      sideB:
        records[1] && records[1]["names"]
          ? records[1]["names"].join("\n")
          : "N/A",
    },
    {
      title: "Genre",
      sideA: currentRecord["genres"] ? currentRecord["genres"].join(", ") : "N/A",
      sideB:
        records[1] && records[1]["genres"]
          ? records[1]["genres"].join(", ")
          : "N/A",
    },
    {
      title: "Media Size",
      sideA: currentRecord["media_size"] ?? "N/A",
      sideB: records[1] ? records[1]["media_size"] ?? "N/A" : "N/A",
    },
    {
      title: "Recording Label",
      sideA: currentRecord["record_label"] ?? "N/A",
      sideB: records[1] ? records[1]["record_label"] ?? "N/A" : "N/A",
    },
    {
      title: "Recording Catalog Number",
      sideA: currentRecord["catalog_number"] ?? "N/A",
      sideB: records[1] ? records[1]["catalog_number"] ?? "N/A" : "N/A",
    },
    {
      title: "Recording Matrix Number",
      sideA: currentRecord["matrix_number"] ?? "N/A",
      sideB: records[1] ? records[1]["matrix_number"] ?? "N/A" : "N/A",
    },
    {
      title: "Recording Take Number",
      sideA: currentRecord["take_number"] ?? "N/A",
      sideB: records[1] ? records[1]["take_number"] ?? "N/A" : "N/A",
    },
    {
      title: "Recording Date",
      sideA: currentRecord["track_year"] ?? "N/A",
      sideB: records[1] ? records[1]["track_year"] ?? "N/A" : "N/A",
    },
    {
      title: "Recording Location",
      sideA: currentRecord["region"] ?? "N/A",
      sideB: records[1] ? records[1]["region"] ?? "N/A" : "N/A",
    },
    {
      title: "Recording Repository",
      sideA: currentRecord["repository"] ?? "N/A",
      sideB: records[1] ? records[1]["repository"] ?? "N/A" : "N/A",
    },
    {
      title: "Rights Advisory",
      sideA: currentRecord["rights"] ?? "N/A",
      sideB: records[1] ? records[1]["rights"] ?? "N/A" : "N/A",
    },
    {
      title: "Online Format",
      sideA: currentRecord["online_format"] ?? "N/A",
      sideB: records[1] ? records[1]["online_format"] ?? "N/A" : "N/A",
    },
  ];

  return (
    <div className="album-container">
      {/* Header Section */}
      <div className="header">
        <h1>{currentRecord["title"] ?? "Album Title"}</h1>
        <span>{currentRecord["id"] ?? "ID"}</span>
        <h2 className="album-subtitle">
          {currentRecord["title_armenian"] ?? "Armenian Title"}
        </h2>
      </div>

      {/* Main Info Section */}
      <div className="main-info">
        {/* Left: Image + Thumbnails */}
        <div className="album-info" onClick={handleImageClick}>
          <div className="main-image-container">
            <img
              src={images[currentImageIndex]}
              alt="Main Image"
              className="main-image"
              draggable="false"
            />
          </div>
          <div className="dots-container">
            {images.map((_, index) => (
              <span
                key={index}
                className={`dot ${index === currentImageIndex ? "active" : ""}`}
                data-image={index}
              ></span>
            ))}
          </div>
        </div>

        {/* Right: Text Information */}
        <div className="text-info">
          {/* Track List */}
          <div className="side-section">
            <div className="side">
              <h4>{currentRecord["track_side"] ?? "Side A"}</h4>
              <div className="track-list">
                <div className="track-entry">
                  <div className="track-number">
                    {currentRecord["track_number"] ?? "1A"}
                  </div>
                  <div className="song-title-container">
                    <div className="song-title">
                      {currentRecord["title_armenian"] ?? "Track Title"}
                    </div>
                    <div className="transliteration">
                      {currentRecord["title_transliteration"] ??
                        "Transliteration"}
                    </div>
                  </div>
                  <div className="song-length">
                    {currentRecord["duration"] ?? "3:00"}
                  </div>
                </div>
                {/* Add more tracks if available */}
              </div>
            </div>

            {/* Side B */}
            {records.length > 1 && records[1] && (
              <div className="side">
                <h4>{records[1]["track_side"] ?? "Side B"}</h4>
                <div className="track-list">
                  <div className="track-entry">
                    <div className="track-number">
                      {records[1]["track_number"] ?? "1B"}
                    </div>
                    <div className="song-title-container">
                      <div className="song-title">
                        {records[1]["title_armenian"] ?? "Track Title"}
                      </div>
                      <div className="transliteration">
                        {records[1]["title_transliteration"] ??
                          "Transliteration"}
                      </div>
                    </div>
                    <div className="song-length">
                      {records[1]["duration"] ?? "3:00"}
                    </div>
                  </div>
                  {/* Add more tracks if available */}
                </div>
              </div>
            )}
          </div>

          {/* Info Section */}
          <div className="info-section">
            <div className="info-entry">
              <div className="info-title">SIDE A — LINER NOTES</div>
              <div className="info-content">
                {currentRecord["liner_notes"] ?? "No liner notes available."}
              </div>
            </div>
            {records.length > 1 && records[1] && (
              <div className="info-entry">
                <div className="info-title">SIDE B — LINER NOTES</div>
                <div className="info-content">
                  {records[1]["liner_notes"] ?? "No liner notes available."}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Metadata Section */}
      <div className="meta-section">
        <h4>METADATA</h4>
        <br />
        <div className="metadata-row">
          <div className="metadata-title">DATA TITLE</div>
          <div className="metadata-side">SIDE A DATA</div>
          <div className="metadata-side">SIDE B DATA</div>
        </div>

        {/* Render metadata entries */}
        {metadataEntries.map((entry, index) => (
          <div className="metadata-row" key={index}>
            <div className="metadata-title">{entry.title}</div>
            <div className="metadata-content">{entry.sideA}</div>
            <div className="metadata-content">{entry.sideB}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function CollectionDetail() {
  return <Album />;
}
