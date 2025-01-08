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
  [key: string]: any;
}

const CollectionDetail: React.FC = () => {
  const [records, setRecords] = useState<RecordType[]>([]);
  const pathName = usePathname();
  const recordId = pathName.split("/").slice(-1)[0];

  const [images, setImages] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  
  // Add state to control menu visibility
  const [isMenuVisible, setIsMenuVisible] = useState(true);

  useEffect(() => {
    axios
      .get(`https://ara.directus.app/items/record_archive/${recordId}`)
      .then((response) => {
        const initialRecord = response.data.data;
        const ARAID = initialRecord["ARAID"];

        // Fetch all records with the same ARAID (both sides)
        axios
          .get(
            `https://ara.directus.app/items/record_archive?filter[ARAID][_eq]=${ARAID}&fields=*,audio.id,record_label.*`
          )
          .then((recordsResponse) => {
            let fetchedRecords = recordsResponse.data.data;

            // Sort the records to ensure Side A comes before Side B
            fetchedRecords.sort((a: RecordType, b: RecordType) => {
              const sideA = a.track_side || "A";
              const sideB = b.track_side || "B";
              return sideA.localeCompare(sideB);
            });

            // Include audio URLs in the records
            fetchedRecords = fetchedRecords.map((record: RecordType) => {
              return {
                ...record,
                audioUrl: record.audio
                  ? `https://ara.directus.app/assets/${record.audio.id}`
                  : null,
              };
            });

            setRecords(fetchedRecords);

            // Prepare images array
            const recordImages = fetchedRecords.map((record: RecordType) =>
              record["record_image"]
                ? getImageDetailUrl(record["record_image"])
                : getDefaultImageDetailUrl()
            );
            setImages(recordImages);
          });
      });
  }, [recordId]);

  if (records.length === 0) {
    return null;
  }

  const currentRecord = records[0];

  // Compute catalog numbers
  const catalogNumbers =
    [records[0]?.record_catalog_number, records[1]?.record_catalog_number]
      .filter(Boolean)
      .join("|") || "Unknown Cat#";

  // Metadata entries (Dynamically generated as before)
  const metadataEntries = [
    {
      title: "ARA ID",
      sideA: records[0]?.ARAID ?? "Unknown ARA ID",
      sideB: records[1]?.ARAID ?? "Unknown ARA ID",
    },
    {
      title: "Title",
      sideA: records[0]?.title ?? "Unknown title",
      sideB: records[1]?.title ?? "Unknown title",
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
        : "Unknown genre",
      sideB: records[1]?.genres
        ? records[1].genres.join(", ")
        : "Unknown genre",
    },
    {
      title: "Recording Label",
      sideA: records[0]?.record_label?.label_en ?? "Unknown Label",
      sideB: records[1]?.record_label?.label_en ?? "Unknown Label",
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
      sideA: records[0]?.conducted_by ?? "Unknown conductor",
      sideB: records[1]?.conducted_by ?? "Unknown conductor",
    },
    {
      title: "Language",
      sideA: records[0]?.language ?? "Language not assigned",
      sideB: records[1]?.language ?? "Language not assigned",
    },
    {
      title: "Instruments",
      sideA: records[0]?.instruments
        ? records[0].instruments.join(", ")
        : "Instruments not assigned",
      sideB: records[1]?.instruments
        ? records[1].instruments.join(", ")
        : "Instruments not assigned",
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

  // Handle main image click to switch images
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

  const sideA = records[0];
  const sideB = records[1];

  // Handle menu toggle (Change #1)
  const handleMenuToggle = () => {
    setIsMenuVisible((prev) => !prev);
  };

  return (
    <div className="ara-main" id="ara-main">
      <div className="ara-menu" id="ara-menu">
        <div className="ara-menu-title" id="ara-menu-title">
          ARMENIAN RECORD ARCHIVE
        </div>
        <div
          className={`ara-menu-links-wrapper ${isMenuVisible ? "expanded" : ""}`}
          id="ara-menu-links-wrapper"
        >
          {/* Change #2: bilingual menu items */}
          <Link href="https://ara-jet.vercel.app/">COLLECTION <br/> ՀԱՎԱՔԱՑՈՒ</Link> ● 
          <a href="#about">ABOUT US<br/>ՄԵՐ ՄԱՍԻՆ</a>
        </div>
        <div className="ara-menu-toggle" id="ara-menu-toggle" onClick={handleMenuToggle}>
          <div className={`ara-menu-icon ${isMenuVisible ? "clicked" : ""}`} id="menu-icon">
            <div className="ara-menu-icon-sleeve"></div>
            <div className="ara-menu-icon-record"></div>
          </div>
        </div>
      </div>

      <div className="container">
        {/* Header Section */}
        <div className="ara-record-header">
          <div className="ara-header__recording-label">
            {currentRecord.record_label?.label_en ?? "Unknown Label"}
          </div>
          <div className="ara-header__share">SHARE</div>
          <div className="ara-header__recording-catalog-number">{catalogNumbers}</div>
        </div>

        {/* Left: Image + Thumbnails */}
        <div className="ara-record-image" onClick={handleImageClick}>
          <div className="ara-record-image__container">
            <img
              src={images[currentImageIndex]}
              alt="Record"
              className="ara-record-image__main"
              draggable="false"
            />
          </div>
          <div className="ara-record-image__dots-container">
            {images.map((_, idx) => (
              <span
                key={idx}
                className={
                  "ara-record-image__dot" + (idx === currentImageIndex ? " active" : "")
                }
              ></span>
            ))}
          </div>
        </div>

        {/* Right: Text Information */}
        <div className="ara-record-info">
          {/* Track List */}
          <div className="ara-record-info__side-section">
            {/* Side A */}
            {sideA && (
              <div className="ara-record-info__side">
                <h4 className="ara-record-info__side-title">
                  {sideA.track_side
                    ? `▶ Side ${sideA.track_side.toUpperCase()}`
                    : "▶ Side A"}
                </h4>
                <div className="ara-record-info__track-list">
                  <div className="ara-record-info__track-entry">
                    <div className="ara-record-info__track-number">
                      {sideA.track_number ?? "1A"}
                    </div>
                    <div className="ara-record-info__song-title-container">
                      <div className="ara-record-info__song-title">
                        {sideA.title ?? "Unknown title"}
                      </div>
                      <div className="ara-record-info__transliteration">
                        {sideA.title_armenian ?? "Unknown Armenian title"}
                      </div>
                    </div>
                    <div className="ara-record-info__song-length">
                      {sideA.duration ?? "3:00"}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Side B */}
            {sideB && (
              <div className="ara-record-info__side">
                <h4 className="ara-record-info__side-title">
                  {sideB.track_side
                    ? `▶ Side ${sideB.track_side.toUpperCase()}`
                    : "▶ Side B"}
                </h4>
                <div className="ara-record-info__track-list">
                  <div className="ara-record-info__track-entry">
                    <div className="ara-record-info__track-number">
                      {sideB.track_number ?? "1B"}
                    </div>
                    <div className="ara-record-info__song-title-container">
                      <div className="ara-record-info__song-title">
                        {sideB.title ?? "Unknown title"}
                      </div>
                      <div className="ara-record-info__transliteration">
                        {sideB.title_armenian ?? "Unknown Armenian title"}
                      </div>
                    </div>
                    <div className="ara-record-info__song-length">
                      {sideB.duration ?? "3:00"}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Details Section */}
          <div className="ara-record-info__details-section">
            {/* Side A Details */}
            {sideA && (
              <div className="ara-record-info__details-entry">
                <div className="ara-record-info__details-title">
                  {sideA.track_side
                    ? `SIDE ${sideA.track_side.toUpperCase()} — DETAILS`
                    : "SIDE A — DETAILS"}
                </div>
                <div className="ara-record-info__details-content">
                  <div className="ara-record-info__item">
                    <span className="ara-record-info__label">Artist:</span>
                    <span className="ara-record-info__pill">
                      {sideA.artist_original ?? "Unknown artist"}
                    </span>
                  </div>
                  <div className="ara-record-info__item">
                    <span className="ara-record-info__label">Instrument Used:</span>
                    <span className="ara-record-info__pill">
                      {sideA.instruments
                        ? sideA.instruments.join(", ")
                        : "Unknown instrument"}
                    </span>
                  </div>
                  <div className="ara-record-info__item">
                    <span className="ara-record-info__label">Genre:</span>
                    <span className="ara-record-info__pill">
                      {sideA.genres ? sideA.genres.join(", ") : "Unknown genre"}
                    </span>
                  </div>
                  <div className="ara-record-info__item">
                    <span className="ara-record-info__label">Region:</span>
                    <span className="ara-record-info__pill">
                      {sideA.regions ? sideA.regions.join(", ") : "Unknown region"}
                    </span>
                  </div>
                  <div className="ara-record-info__item">
                    <span className="ara-record-info__label">Year Composed:</span>
                    <span className="ara-record-info__pill">
                      {sideA.track_year ?? "Unknown year"}
                    </span>
                  </div>
                </div>
              </div>
            )}
            {/* Side B Details */}
            {sideB && (
              <div className="ara-record-info__details-entry">
                <div className="ara-record-info__details-title">
                  {sideB.track_side
                    ? `SIDE ${sideB.track_side.toUpperCase()} — DETAILS`
                    : "SIDE B — DETAILS"}
                </div>
                <div className="ara-record-info__details-content">
                  <div className="ara-record-info__item">
                    <span className="ara-record-info__label">Artist:</span>
                    <span className="ara-record-info__pill">
                      {sideB.artist_original ?? "Unknown artist"}
                    </span>
                  </div>
                  <div className="ara-record-info__item">
                    <span className="ara-record-info__label">Instrument Used:</span>
                    <span className="ara-record-info__pill">
                      {sideB.instruments
                        ? sideB.instruments.join(", ")
                        : "Unknown instrument"}
                    </span>
                  </div>
                  <div className="ara-record-info__item">
                    <span className="ara-record-info__label">Genre:</span>
                    <span className="ara-record-info__pill">
                      {sideB.genres ? sideB.genres.join(", ") : "Unknown genre"}
                    </span>
                  </div>
                  <div className="ara-record-info__item">
                    <span className="ara-record-info__label">Region:</span>
                    <span className="ara-record-info__pill">
                      {sideB.regions ? sideB.regions.join(", ") : "Unknown region"}
                    </span>
                  </div>
                  <div className="ara-record-info__item">
                    <span className="ara-record-info__label">Year Composed:</span>
                    <span className="ara-record-info__pill">
                      {sideB.track_year ?? "Unknown year"}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Metadata Section */}
        <div className="ara-record-meta-section">
          <div className="ara-record-meta-section__metadata-row">
            <div className="ara-record-meta-section__data-title">DATA CATEGORY</div>
            <div className="ara-record-meta-section__side-a-data">SIDE A DATA</div>
            <div className="ara-record-meta-section__side-b-data">SIDE B DATA</div>
          </div>

          {metadataEntries.map((entry, idx) => (
            <div className="ara-record-meta-section__metadata-row" key={idx}>
              <div className="ara-record-meta-section__data-title">{entry.title}</div>
              <div className="ara-record-meta-section__side-a-data">{entry.sideA}</div>
              <div className="ara-record-meta-section__side-b-data">{entry.sideB}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Player (static for now, no audio context) */}
      <div className="ara-record-player-wrapper">
        <div className="ara-record-player-info">
          <div className="ara-record-player-image">
            <img
              src={images[0]}
              alt="Player Thumbnail"
              className="ara-record-player-thumbnail-img"
            />
          </div>
          <div className="ara-record-player-song-info">
            <div className="ara-record-player-song-title">
              {records[0]?.title ?? "Unknown Song"}
            </div>
            <div className="ara-record-player-artist-name">
              {records[0]?.artist_original ?? "Unknown Artist"}
            </div>
          </div>
        </div>
        <div className="ara-record-player-audio-section">
          <div className="ara-record-player-progress-bar"></div>
          <div className="ara-record-player-time">00:00 | {records[0]?.duration ?? "3:00"}</div>
        </div>
      </div>
    </div>
  );
};

export default CollectionDetail;
