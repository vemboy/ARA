"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { usePathname } from "next/navigation";
import {
  getDefaultImageDetailUrl,
  getImageDetailUrl,
} from "@/utils/assetUtils";

// Import Flickity and its CSS
import Flickity from "react-flickity-component";
import "flickity/css/flickity.css"; // Make sure to install flickity via npm

interface RecordType {
  [key: string]: any;
}

const Album: React.FC = () => {
  const [records, setRecords] = useState<RecordType[]>([]);
  const pathName = usePathname();
  const recordId = pathName.split("/").slice(-1)[0];

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
            const fetchedRecords = recordsResponse.data.data;
            setRecords(fetchedRecords);

            // Prepare images array for the image slider
            const recordImages = fetchedRecords.map((record: RecordType) =>
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

  const currentRecord = records[0]; // Use the first record as the current record

  // Metadata entries
  const metadataEntries = [
    {
      title: "Title",
      sideA:
        records[0]?.title ?? "INFO DOES NOT EXIST IN DB",
      sideB:
        records[1]?.title ?? "INFO DOES NOT EXIST IN DB",
    },
    {
      title: "Names",
      sideA:
        records[0]?.artist_original ?? "INFO DOES NOT EXIST IN DB",
      sideB:
        records[1]?.artist_original ?? "INFO DOES NOT EXIST IN DB",
    },
    {
      title: "Genre",
      sideA:
        records[0]?.genres
          ? records[0].genres.join(", ")
          : "Genre Unavailable",
      sideB:
        records[1]?.genres
          ? records[1].genres.join(", ")
          : "Genre Unavailable",
    },
    {
      title: "Recording Label",
      sideA:
        records[0]?.record_label ?? "INFO DOES NOT EXIST IN DB",
      sideB:
        records[1]?.record_label ?? "INFO DOES NOT EXIST IN DB",
    },
    {
      title: "Recording Catalog Number",
      sideA:
        records[0]?.record_catalog_number ?? "INFO DOES NOT EXIST IN DB",
      sideB:
        records[1]?.record_catalog_number ?? "INFO DOES NOT EXIST IN DB",
    },
    {
      title: "Recording Date",
      sideA:
        records[0]?.track_year ?? "INFO DOES NOT EXIST IN DB",
      sideB:
        records[1]?.track_year ?? "INFO DOES NOT EXIST IN DB",
    },
    {
      title: "Recording Location",
      sideA:
        records[0]?.regions
          ? records[0].regions.join(", ")
          : "INFO DOES NOT EXIST IN DB",
      sideB:
        records[1]?.regions
          ? records[1].regions.join(", ")
          : "INFO DOES NOT EXIST IN DB",
    },
    // Fields not present in the record
    {
      title: "Summary",
      sideA: "INFO DOES NOT EXIST IN DB",
      sideB: "INFO DOES NOT EXIST IN DB",
    },
    {
      title: "Media Size",
      sideA: "INFO DOES NOT EXIST IN DB",
      sideB: "INFO DOES NOT EXIST IN DB",
    },
    {
      title: "Recording Matrix Number",
      sideA: "INFO DOES NOT EXIST IN DB",
      sideB: "INFO DOES NOT EXIST IN DB",
    },
    {
      title: "Recording Take Number",
      sideA: "INFO DOES NOT EXIST IN DB",
      sideB: "INFO DOES NOT EXIST IN DB",
    },
    {
      title: "Recording Repository",
      sideA: "INFO DOES NOT EXIST IN DB",
      sideB: "INFO DOES NOT EXIST IN DB",
    },
    {
      title: "Rights Advisory",
      sideA: "INFO DOES NOT EXIST IN DB",
      sideB: "INFO DOES NOT EXIST IN DB",
    },
    {
      title: "Online Format",
      sideA: "INFO DOES NOT EXIST IN DB",
      sideB: "INFO DOES NOT EXIST IN DB",
    },
  ];

  // Flickity options
  const flickityOptions = {
    wrapAround: true,
    cellAlign: "center",
    autoPlay: false,
    pageDots: false,
    prevNextButtons: true,
    imagesLoaded: true,
    adaptiveHeight: true,
    arrowShape: "M 10,50 L 70,100 L 70,50 L 70,50  L 70,50 L 70,0 Z",
  };

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
        {/* Left: Image Carousel */}
        <div className="album-info">
          <Flickity
            className={"carousel"} // default ''
            elementType={"div"} // default 'div'
            options={flickityOptions} // takes flickity options {}
            disableImagesLoaded={false} // default false
            reloadOnUpdate={false} // default false
            static={false} // default false
          >
            
            {images.map((imageSrc, index) => (
              <div className="carousel-cell" key={index}>
                <img
                  src={imageSrc}
                  alt={`Slide ${index}`}
                  className="main-image"
                  draggable="false"
                />
              </div>
            ))}
          </Flickity>
        </div>

        {/* Right: Text Information */}
        <div className="text-info">
          {/* Track List */}
          <div className="side-section">
            {/* Side A */}
            {records[0] && (
              <div className="side">
                <h4>{records[0]["track_side"] ?? "Side A"}</h4>
                <div className="track-list">
                  <div className="track-entry">
                    <div className="track-number">
                      {records[0]["track_number"] ?? "1A"}
                    </div>
                    <div className="song-title-container">
                      <div className="song-title">
                        {records[0]["title_armenian"] ?? "Track Title"}
                      </div>
                      <div className="transliteration">
                        {records[0]["title_transliterated"] ??
                          "Transliteration"}
                      </div>
                    </div>
                    <div className="song-length">
                      {records[0]["duration"] ?? "3:00"}
                    </div>
                  </div>
                  {/* Add more tracks if available */}
                </div>
              </div>
            )}

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
                        {records[1]["title_transliterated"] ??
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
            {records[0] && (
              <div className="info-entry">
                <div className="info-title">
                  {records[0]["track_side"] ?? "Side A"} — LINER NOTES
                </div>
                <div className="info-content">
                  {records[0]["liner_notes"] ??
                    "This side features traditional Armenian folk tunes, showcasing the rich cultural heritage of the region. Musicians include renowned players of the duduk and other traditional instruments."}
                </div>
              </div>
            )}
            {records.length > 1 && records[1] && (
              <div className="info-entry">
                <div className="info-title">
                  {records[1]["track_side"] ?? "Side B"} — LINER NOTES
                </div>
                <div className="info-content">
                  {records[1]["liner_notes"] ??
                    "Side B includes contemporary interpretations of classic melodies, performed by a mix of local artists and international collaborators, bringing a fresh sound to the folk genre."}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Metadata Section */}
      <div className="meta-section">
        <h4 style={{ fontWeight: "bold" }}>METADATA</h4>
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
