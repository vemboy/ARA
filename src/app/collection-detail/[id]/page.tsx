"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { usePathname } from "next/navigation";
import {
  getDefaultImageDetailUrl,
  getImageDetailUrl,
} from "@/utils/assetUtils";

import Flickity from "react-flickity-component";
import "flickity/css/flickity.css"; // Import Flickity CSS

interface RecordType {
  [key: string]: any;
}

const Album: React.FC = () => {
  const [records, setRecords] = useState<RecordType[]>([]);
  const pathName = usePathname();
  const recordId = pathName.split("/").slice(-1)[0];

  const [images, setImages] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0); // Existing code

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
      sideA: records[0]?.title ?? "INFO DOES NOT EXIST IN DB",
      sideB: records[1]?.title ?? "INFO DOES NOT EXIST IN DB",
    },
    {
      title: "Names",
      sideA: records[0]?.artist_original ?? "Unknown artists",
      sideB: records[1]?.artist_original ?? "Unknown artists",
    },
    {
      title: "Genre",
      sideA: records[0]?.genres
        ? records[0].genres.join(", ")
        : "No genre assigned",
      sideB: records[1]?.genres
        ? records[1].genres.join(", ")
        : "No genre assigned",
    },
    {
      title: "Recording Label",
      sideA: records[0]?.record_label ?? "INFO DOES NOT EXIST IN DB",
      sideB: records[1]?.record_label ?? "INFO DOES NOT EXIST IN DB",
    },
    {
      title: "Recording Catalog Number",
      sideA:
        records[0]?.record_catalog_number ?? "No catalog number assigned",
      sideB:
        records[1]?.record_catalog_number ?? "No catalog number assigned",
    },
    {
      title: "Recording Date",
      sideA: records[0]?.track_year ?? "Unknown date",
      sideB: records[1]?.track_year ?? "Unknown date",
    },
    {
      title: "Composed by",
      sideA: records[0]?.composed_by ?? "Unknown composer",
      sideB: records[1]?.composed_by ?? "Unknown composer",
    },
    {
      title: "Arranged by",
      sideA: records[0]?.arranged_by ?? "Unknown",
      sideB: records[1]?.arranged_by ?? "Unknown",
    },
    {
      title: "Lyrics by",
      sideA: records[0]?.lyrics_by ?? "Unknown",
      sideB: records[1]?.lyrics_by ?? "Unknown",
    },
    {
      title: "Conducted by",
      sideA: records[0]?.composed_by ?? "Unknown composer",
      sideB: records[1]?.composed_by ?? "Unknown composer",
    },
    {
      title: "Language",
      sideA: records[0]?.language ?? "Language not assigned",
      sideB: records[1]?.language ?? "Language not assigned",
    },
    {
      title: "Instruments",
      sideA: records[0]?.instruments ?? "Instruments not assigned",
      sideB: records[1]?.instruments ?? "Instruments not assigned",
    },
    {
      title: "Recording Location",
      sideA: records[0]?.regions
        ? records[0].regions.join(", ")
        : "Unknown location",
      sideB: records[1]?.regions
        ? records[1].regions.join(", ")
        : "Unknown location",
    },
  ];

  // Function to handle image click (existing code)
  const handleImageClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    const containerWidth = (event.currentTarget as HTMLElement).offsetWidth;
    const clickX = event.nativeEvent.offsetX;

    if (clickX < containerWidth / 2) {
      // Previous image
      const newIndex = (currentImageIndex - 1 + images.length) % images.length;
      setCurrentImageIndex(newIndex);
    } else {
      // Next image
      const newIndex = (currentImageIndex + 1) % images.length;
      setCurrentImageIndex(newIndex);
    }
  };

  // Prepare carousel images (repeat images to match the example)
  const carouselImages = images.concat(images);

  return (
    <div className="album-container">
      {/* Header Section */}
      <div className="header">
        {/* <h1>{currentRecord["title"] ?? "Album Title"}</h1> */}
        <h1>Record Label Title</h1>
        <span>
          {currentRecord["record_catalog_number"] ?? "Unknown Catalog Number"}
        </span>
        <h2 className="album-subtitle">
          {/* {currentRecord["title_armenian"] ?? "Armenian Title"} */}
          ՌԵՔՈՐԴ ԼԵՅԲԼ ԹԱՅԹԼ
        </h2>
      </div>

      {/* Main Info Section */}
      <div className="main-info">
        {/* Left: Image Carousel */}
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
                className={`dot ${
                  index === currentImageIndex ? "active" : ""
                }`}
                data-image={index}
              ></span>
            ))}
          </div>
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
                        {records[0]["title"] ?? "Unknown title"}
                      </div>
                      <div className="transliteration">
                        {records[0]["title_armenian"] ??
                          "Unknown Armenian title"}
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
                        {records[1]["title"] ?? "Unknown title"}
                      </div>
                      <div className="transliteration">
                        {records[1]["title_armenian"] ??
                          "Unknown Armenian title"}
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
        <br />
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

      {/* Carousel Section */}
      <div className="carousel-container">
        <Flickity
          className={"carousel"}
          elementType={"div"}
          options={{
            wrapAround: true,
            cellAlign: "left",
            autoPlay: false,
            pageDots: false,
            arrowShape: "M 10,50 L 70,100 L 70,50 L 70,50  L 70,50 L 70,0 Z",
          }}
          disableImagesLoaded={false}
          reloadOnUpdate={false}
          static={false}
        >
          {carouselImages.map((imageSrc, index) => (
            <div className="carousel-cell" key={index}>
              <img src={imageSrc} alt={`Slide ${index}`} />
            </div>
          ))}
        </Flickity>
      </div>
    </div>
  );
};

export default function CollectionDetail() {
  return <Album />;
}
