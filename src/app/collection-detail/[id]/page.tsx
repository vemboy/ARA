"use client";
export const dynamic = "force-dynamic";

import React, { useState, useEffect, useRef } from "react";
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
  // ----------------------------------------------------------------
  // 1) All Hooks/State at the top (no conditional Hooks)
  // ----------------------------------------------------------------
  // Basic record + image state
  const [records, setRecords] = useState<RecordType[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);

  // Menu visibility
  const [isMenuVisible, setIsMenuVisible] = useState(true);

  // Audio states
  const [currentAudioUrl, setCurrentAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Grab the record ID from the URL
  const pathName = usePathname();
  const recordId = pathName.split("/").slice(-1)[0];

  // ----------------------------------------------------------------
  // 2) useEffect to fetch data for this record
  // ----------------------------------------------------------------
  useEffect(() => {
    axios
      .get(`https://ara.directus.app/items/record_archive/${recordId}`)
      .then((response) => {
        const initialRecord = response.data.data;
        const ARAID = initialRecord["ARAID"];

        // Fetch all records with the same ARAID
        axios
          .get(
            `https://ara.directus.app/items/record_archive?filter[ARAID][_eq]=${ARAID}&fields=*,audio.id,record_label.*`
          )
          .then((recordsResponse) => {
            let fetchedRecords = recordsResponse.data.data;

            // Sort so Side A is first, Side B second, etc.
            fetchedRecords.sort((a: RecordType, b: RecordType) => {
              const sideA = a.track_side || "A";
              const sideB = b.track_side || "B";
              return sideA.localeCompare(sideB);
            });

            // Add audioUrl field
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

  // ----------------------------------------------------------------
  // 3) useEffect to initialize the <audio> once
  // ----------------------------------------------------------------
  useEffect(() => {
    const audio = new Audio();
    audioRef.current = audio;

    const handleEnded = () => {
      setIsPlaying(false);
    };
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("ended", handleEnded);
      audio.pause();
      audioRef.current = null;
    };
  }, []);

  // ----------------------------------------------------------------
  // 4) If we have no records yet (loading or empty), return a fallback
  // ----------------------------------------------------------------
  if (records.length === 0) {
    return <div style={{ color: "white" }}>Loading or No Records Found</div>;
  }

  // ----------------------------------------------------------------
  // 5) Helper: click a track to play/pause
  // ----------------------------------------------------------------
  function handleTrackClick(audioUrl: string | null) {
    if (!audioUrl) return;
    const audio = audioRef.current;
    if (!audio) return;

    // If the same track is loaded
    if (audio.src.includes(audioUrl)) {
      if (!audio.paused) {
        // Pause
        audio.pause();
        setIsPlaying(false);
      } else {
        // Resume
        audio.play();
        setIsPlaying(true);
      }
    } else {
      // Load a new track
      audio.pause();
      audio.src = audioUrl;
      audio.load();
      audio.play();
      setCurrentAudioUrl(audioUrl);
      setIsPlaying(true);
    }
  }

  // ----------------------------------------------------------------
  // 6) Additional local variables
  // ----------------------------------------------------------------
  const currentRecord = records[0];
  const sideA = records[0];
  const sideB = records[1];

  // Compute catalog numbers
  const catalogNumbers =
    [sideA?.record_catalog_number, sideB?.record_catalog_number]
      .filter(Boolean)
      .join("|") || "Unknown Cat#";

  // Dynamic metadata array
  const metadataEntries = [
    {
      title: "ARA ID",
      sideA: sideA?.ARAID ?? "Unknown ARA ID",
      sideB: sideB?.ARAID ?? "Unknown ARA ID",
    },
    {
      title: "Title",
      sideA: sideA?.title ?? "Unknown title",
      sideB: sideB?.title ?? "Unknown title",
    },
    {
      title: "Names",
      sideA: sideA?.artist_original ?? "Unknown artists",
      sideB: sideB?.artist_original ?? "Unknown artists",
    },
    {
      title: "Genre",
      sideA: sideA?.genres ? sideA.genres.join(", ") : "Unknown genre",
      sideB: sideB?.genres ? sideB.genres.join(", ") : "Unknown genre",
    },
    {
      title: "Recording Label",
      sideA: sideA?.record_label?.label_en ?? "Unknown Label",
      sideB: sideB?.record_label?.label_en ?? "Unknown Label",
    },
    {
      title: "Recording Catalog Number",
      sideA: sideA?.record_catalog_number ?? "No catalog number assigned",
      sideB: sideB?.record_catalog_number ?? "No catalog number assigned",
    },
    {
      title: "Recording Date",
      sideA: sideA?.track_year ?? "Unknown date",
      sideB: sideB?.track_year ?? "Unknown date",
    },
    {
      title: "Composed by",
      sideA: sideA?.composed_by ?? "Unknown composer",
      sideB: sideB?.composed_by ?? "Unknown composer",
    },
    {
      title: "Arranged by",
      sideA: sideA?.arranged_by ?? "Unknown",
      sideB: sideB?.arranged_by ?? "Unknown",
    },
    {
      title: "Lyrics by",
      sideA: sideA?.lyrics_by ?? "Unknown",
      sideB: sideB?.lyrics_by ?? "Unknown",
    },
    {
      title: "Conducted by",
      sideA: sideA?.conducted_by ?? "Unknown conductor",
      sideB: sideB?.conducted_by ?? "Unknown conductor",
    },
    {
      title: "Language",
      sideA: sideA?.language ?? "Language not assigned",
      sideB: sideB?.language ?? "Language not assigned",
    },
    {
      title: "Instruments",
      sideA: sideA?.instruments
        ? sideA.instruments.join(", ")
        : "Instruments not assigned",
      sideB: sideB?.instruments
        ? sideB.instruments.join(", ")
        : "Instruments not assigned",
    },
    {
      title: "Recording Location",
      sideA: sideA?.regions ? sideA.regions.join(", ") : "Unknown location",
      sideB: sideB?.regions ? sideB.regions.join(", ") : "Unknown location",
    },
  ];

  // ----------------------------------------------------------------
  // 7) Handle main image click to switch images
  // ----------------------------------------------------------------
  const handleImageClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    const containerWidth = (event.currentTarget as HTMLElement).offsetWidth;
    const clickX = event.nativeEvent.offsetX;

    if (clickX < containerWidth / 2) {
      // Previous
      const newIndex = (currentImageIndex - 1 + images.length) % images.length;
      setCurrentImageIndex(newIndex);
    } else {
      // Next
      const newIndex = (currentImageIndex + 1) % images.length;
      setCurrentImageIndex(newIndex);
    }
  };

  // ----------------------------------------------------------------
  // 8) Handle menu toggle
  // ----------------------------------------------------------------
  const handleMenuToggle = () => {
    setIsMenuVisible((prev) => !prev);
  };

  // ----------------------------------------------------------------
  // 9) Render final JSX
  // ----------------------------------------------------------------
  return (
    <div className="ara-main" id="ara-main">
      {/* Top Menu */}
      <div className="ara-menu" id="ara-menu">
        <div className="ara-menu-title" id="ara-menu-title">
          ARMENIAN RECORD ARCHIVE
        </div>
        <div
          className={`ara-menu-links-wrapper ${
            isMenuVisible ? "expanded" : ""
          }`}
          id="ara-menu-links-wrapper"
        >
          <Link href="https://ara-jet.vercel.app/">
            COLLECTION <br /> ՀԱՎԱՔԱՑՈՒ
          </Link>{" "}
          ●
          <a href="#about">
            ABOUT US
            <br />
            ՄԵՐ ՄԱՍԻՆ
          </a>
        </div>
        <div
          className="ara-menu-toggle"
          id="ara-menu-toggle"
          onClick={handleMenuToggle}
        >
          <div
            className={`ara-menu-icon ${isMenuVisible ? "clicked" : ""}`}
            id="menu-icon"
          >
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
          <div className="ara-header__recording-catalog-number">
            {catalogNumbers}
          </div>
        </div>

        {/* Left: Image + Thumbnails */}
        <div className="ara-record-image" onClick={handleImageClick}>
          <div className="ara-record-image__container">
            {/* SPIN if "isPlaying" */}
            <img
              src={images[currentImageIndex]}
              alt="Record"
              draggable="false"
              className={`ara-record-image__main ${
                isPlaying ? "spinning-record" : ""
              }`}
            />
          </div>
          <div className="ara-record-image__dots-container">
            {images.map((_, idx) => (
              <span
                key={idx}
                className={
                  "ara-record-image__dot" +
                  (idx === currentImageIndex ? " active" : "")
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
                  {/* CLICKABLE: play/pause audioUrl */}
                  <div
                    className="ara-record-info__track-entry"
                    onClick={() => handleTrackClick(sideA.audioUrl)}
                  >
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
                  <div
                    className="ara-record-info__track-entry"
                    onClick={() => handleTrackClick(sideB.audioUrl)}
                  >
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
                    <span className="ara-record-info__label">
                      Instrument Used:
                    </span>
                    <span className="ara-record-info__pill">
                      {sideA.instruments
                        ? sideA.instruments.join(", ")
                        : "Unknown instrument"}
                    </span>
                  </div>
                  <div className="ara-record-info__item">
                    <span className="ara-record-info__label">Genre:</span>
                    <span className="ara-record-info__pill">
                      {sideA.genres
                        ? sideA.genres.join(", ")
                        : "Unknown genre"}
                    </span>
                  </div>
                  <div className="ara-record-info__item">
                    <span className="ara-record-info__label">Region:</span>
                    <span className="ara-record-info__pill">
                      {sideA.regions
                        ? sideA.regions.join(", ")
                        : "Unknown region"}
                    </span>
                  </div>
                  <div className="ara-record-info__item">
                    <span className="ara-record-info__label">
                      Year Composed:
                    </span>
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
                    <span className="ara-record-info__label">
                      Instrument Used:
                    </span>
                    <span className="ara-record-info__pill">
                      {sideB.instruments
                        ? sideB.instruments.join(", ")
                        : "Unknown instrument"}
                    </span>
                  </div>
                  <div className="ara-record-info__item">
                    <span className="ara-record-info__label">Genre:</span>
                    <span className="ara-record-info__pill">
                      {sideB.genres
                        ? sideB.genres.join(", ")
                        : "Unknown genre"}
                    </span>
                  </div>
                  <div className="ara-record-info__item">
                    <span className="ara-record-info__label">Region:</span>
                    <span className="ara-record-info__pill">
                      {sideB.regions
                        ? sideB.regions.join(", ")
                        : "Unknown region"}
                    </span>
                  </div>
                  <div className="ara-record-info__item">
                    <span className="ara-record-info__label">
                      Year Composed:
                    </span>
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
              <div className="ara-record-meta-section__data-title">
                {entry.title}
              </div>
              <div className="ara-record-meta-section__side-a-data">
                {entry.sideA}
              </div>
              <div className="ara-record-meta-section__side-b-data">
                {entry.sideB}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Player (static for now) */}
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
          <div className="ara-record-player-time">
            00:00 | {records[0]?.duration ?? "3:00"}
          </div>
        </div>

        {/* Our hidden audio element */}
        <audio ref={audioRef} hidden />
      </div>
    </div>
  );
};

export default CollectionDetail;
