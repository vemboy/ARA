"use client";
export const dynamic = "force-dynamic";

import { useRouter } from 'next/navigation';  // Add this import
import { useState, useEffect, useContext } from "react";  // Modified this line
import axios from "axios";
import { usePathname } from "next/navigation";
import { AudioContext } from "@/app/audioLayout";
import Link from "next/link";
import {
  getDefaultImageDetailUrl,
  getImageDetailUrl,
} from "@/utils/assetUtils";

interface RecordType {
  [key: string]: any;
}



// Add this helper function with your other functions
const formatDuration = (durationInSeconds: number) => {
  const minutes = Math.floor(durationInSeconds / 60);
  const seconds = Math.floor(durationInSeconds % 60);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

// Add this function to get duration
const getAudioDuration = (audioUrl: string): Promise<number> => {
  return new Promise((resolve) => {
    const audio = new Audio(audioUrl);
    audio.addEventListener('loadedmetadata', () => {
      resolve(audio.duration);
    });
  });
};

const getEnglishVersion = (text: string) => {
  if (!text) return text;
  if (text.includes('-|-')) {
    return text.split('-|-')[0].trim();
  }
  return text;
};

const CollectionDetail: React.FC = () => {
  
  const router = useRouter();

const handlePillClick = (filterType: string, value: string) => {
  // Create an encoded filter object that our main page can understand
  const filter = {
    [filterType]: new Set([value])
  };

  // Convert to URL-safe string
  const filterParam = encodeURIComponent(JSON.stringify({
    [filterType]: [value]  // Use an array instead of a Set
  }));
  
  // Navigate to main page with filter
  router.push(`/?filter=${filterParam}`);
};
  
  // Audio Context
  const audioContext = useContext(AudioContext);
  const setSong = audioContext?.setSong;
  const setName = audioContext?.setName;
  const setArtistName = audioContext?.setArtistName;
  const setSongId = audioContext?.setSongId;
  const setAlbumArt = audioContext?.setAlbumArt;
  const audioPlayerRef = audioContext?.audioPlayerRef;

  // State
  const [records, setRecords] = useState<RecordType[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [isMenuVisible, setIsMenuVisible] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackUrl, setCurrentTrackUrl] = useState<string | null>(null);
  const [durations, setDurations] = useState<{ [key: string]: string }>({});

  // Grab the record ID from the URL
  const pathName = usePathname();
  const recordId = pathName.split("/").slice(-1)[0];

  

  // ----------------------------------------------------------------
  // 2) useEffect to fetch data for this record
  // ----------------------------------------------------------------
  useEffect(() => {
  axios.get(`https://ara.directus.app/items/record_archive/${recordId}`)
    .then((response) => {
      const initialRecord = response.data.data;
      const ARAID = initialRecord["ARAID"];

      axios.get(`https://ara.directus.app/items/record_archive?filter[ARAID][_eq]=${ARAID}&fields=*,audio.id,record_label.*`)
        .then(async (recordsResponse) => {
          let fetchedRecords = recordsResponse.data.data;

          // Sort sides
          fetchedRecords.sort((a: RecordType, b: RecordType) => {
            const sideA = a.track_side || "A";
            const sideB = b.track_side || "B";
            return sideA.localeCompare(sideB);
          });

          // Get durations for all tracks
          const durationsObj: { [key: string]: string } = {};
          
          for (const record of fetchedRecords) {
            if (record.audio) {
              const audioUrl = `https://ara.directus.app/assets/${record.audio.id}`;
              record.audioUrl = audioUrl;
              try {
                const duration = await getAudioDuration(audioUrl);
                durationsObj[record.id] = formatDuration(duration);
              } catch (error) {
                console.error('Error getting duration:', error);
                durationsObj[record.id] = "0:00";
              }
            }
          }

          setDurations(durationsObj);
          setRecords(fetchedRecords);

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
  const handleGlobalPause = () => setIsPlaying(false);
  const handleGlobalPlay = () => {
    const currentAudioSrc = audioPlayerRef?.current?.audio?.current?.src;
    if (currentAudioSrc === currentTrackUrl) {
      setIsPlaying(true);
    }
  };

  window.addEventListener("audioPause", handleGlobalPause);
  window.addEventListener("audioPlay", handleGlobalPlay);

  return () => {
    window.removeEventListener("audioPause", handleGlobalPause);
    window.removeEventListener("audioPlay", handleGlobalPlay);
  };
}, [currentTrackUrl, audioPlayerRef]);

  // ----------------------------------------------------------------
  // 4) If we have no records yet (loading or empty), return a fallback
  // ----------------------------------------------------------------
  if (records.length === 0) {
    return <div style={{ color: "white" }}>Loading or No Records Found</div>;
  }

  // ----------------------------------------------------------------
  // 5) Helper: click a track to play/pause
  // ----------------------------------------------------------------
const handleTrackClick = (record: RecordType) => {
  if (!audioContext || !record.audioUrl) return;
  const { setSong, setName, setArtistName, setAlbumArt, setSongId, audioPlayerRef } = audioContext;
  
  const audioPlayer = audioPlayerRef?.current?.audio?.current;
  if (!audioPlayer) return;

  // Find the correct image index based on the side
  const imageIndex = records.findIndex(r => r.id === record.id);
  if (imageIndex !== -1) {
    setCurrentImageIndex(imageIndex);
  }

  if (audioPlayer.src === record.audioUrl) {
    // Same track - toggle play/pause
    if (audioPlayer.paused) {
      void audioPlayer.play();
      setIsPlaying(true);
    } else {
      audioPlayer.pause();
      setIsPlaying(false);
    }
  } else {
    // New track - set up and play
    setSong(record.audioUrl);
    setName(record.title || "Unknown Title");
    setArtistName(record.artist_original || "Unknown Artist");
    setAlbumArt(images[imageIndex]); // Use the correct image for this side
    if (record.id) setSongId(record.id);
    
    setCurrentTrackUrl(record.audioUrl);
    setIsPlaying(true);
    
    setTimeout(() => {
      void audioPlayer.play();
    }, 100);
  }
};

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
    <h4 
      className="ara-record-info__side-title"
      onClick={() => handleTrackClick(sideA)}
      style={{ cursor: 'pointer' }}  // Add this
    >
      {sideA.track_side
        ? `▶ ${sideA.track_side.toUpperCase()}`
        : "▶ Side A"}
    </h4>
    <div className="ara-record-info__track-list">
      <div
        className="ara-record-info__track-entry"
        onClick={() => handleTrackClick(sideA)}  
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
  {durations[sideA.id] || "No Audio"}
</div>
      </div>
    </div>
  </div>
)}

            {/* Side B */}
{sideB && (
  <div className="ara-record-info__side">
    <h4 
      className="ara-record-info__side-title"
      onClick={() => handleTrackClick(sideB)}
      style={{ cursor: 'pointer' }}  // Add this
    >
      {sideB.track_side
        ? `▶ ${sideB.track_side.toUpperCase()}`
        : "▶ Side B"}
    </h4>
    <div className="ara-record-info__track-list">
      <div
        className="ara-record-info__track-entry"
        onClick={() => handleTrackClick(sideB)}  
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
  {durations[sideB.id] || "No audio"}
</div>
      </div>
    </div>
  </div>
)}
          </div>

          {/* Details Section */}
          <div className="ara-record-info__details-section">
            {/* Side A Details */}
            {/* Side A Details */}
{sideA && (
  <div className="ara-record-info__details-entry">
    <div className="ara-record-info__details-title">
      {sideA.track_side
        ? ` ${sideA.track_side.toUpperCase()} — DETAILS`
        : "SIDE A — DETAILS"}
    </div>
    <div className="ara-record-info__details-content">
      <div className="ara-record-info__item">
        <span className="ara-record-info__label">Artist:</span>
        <span 
          className="ara-record-info__pill"
          onClick={() => handlePillClick('artist_original', getEnglishVersion(sideA.artist_original))}
        >
          {getEnglishVersion(sideA.artist_original) ?? "Unknown artist"}
        </span>
      </div>
      <div className="ara-record-info__item">
        <span className="ara-record-info__label">Instrument Used:</span>
        <div className="ara-record-info__pills-container">
          {sideA.instruments
            ? sideA.instruments.map((instrument: string, index: number) => (
                <span 
                  key={index} 
                  className="ara-record-info__pill"
                  onClick={() => handlePillClick('instruments', getEnglishVersion(instrument))}
                >
                  {getEnglishVersion(instrument)}
                </span>
              ))
            : <span className="ara-record-info__pill">Unknown instrument</span>
          }
        </div>
      </div>
      <div className="ara-record-info__item">
        <span className="ara-record-info__label">Genre:</span>
        <div className="ara-record-info__pills-container">
          {sideA.genres
            ? sideA.genres.map((genre: string, index: number) => (
                <span 
                  key={index} 
                  className="ara-record-info__pill"
                  onClick={() => handlePillClick('genres', getEnglishVersion(genre))}
                >
                  {getEnglishVersion(genre)}
                </span>
              ))
            : <span className="ara-record-info__pill">Unknown genre</span>
          }
        </div>
      </div>
      <div className="ara-record-info__item">
        <span className="ara-record-info__label">Region:</span>
        <div className="ara-record-info__pills-container">
          {sideA.regions
            ? sideA.regions.map((region: string, index: number) => (
                <span 
                  key={index} 
                  className="ara-record-info__pill"
                  onClick={() => handlePillClick('regions', getEnglishVersion(region))}
                >
                  {getEnglishVersion(region)}
                </span>
              ))
            : <span className="ara-record-info__pill">Unknown region</span>
          }
        </div>
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
        ? ` ${sideB.track_side.toUpperCase()} — DETAILS`
        : "SIDE B — DETAILS"}
    </div>
    <div className="ara-record-info__details-content">
      <div className="ara-record-info__item">
        <span className="ara-record-info__label">Artist:</span>
        <span 
          className="ara-record-info__pill"
          onClick={() => handlePillClick('artist_original', getEnglishVersion(sideB.artist_original))}
        >
          {getEnglishVersion(sideB.artist_original) ?? "Unknown artist"}
        </span>
      </div>
      <div className="ara-record-info__item">
        <span className="ara-record-info__label">Instrument Used:</span>
        <div className="ara-record-info__pills-container">
          {sideB.instruments
            ? sideB.instruments.map((instrument: string, index: number) => (
                <span 
                  key={index} 
                  className="ara-record-info__pill"
                  onClick={() => handlePillClick('instruments', getEnglishVersion(instrument))}
                >
                  {getEnglishVersion(instrument)}
                </span>
              ))
            : <span className="ara-record-info__pill">Unknown instrument</span>
          }
        </div>
      </div>
      <div className="ara-record-info__item">
        <span className="ara-record-info__label">Genre:</span>
        <div className="ara-record-info__pills-container">
          {sideB.genres
            ? sideB.genres.map((genre: string, index: number) => (
                <span 
                  key={index} 
                  className="ara-record-info__pill"
                  onClick={() => handlePillClick('genres', getEnglishVersion(genre))}
                >
                  {getEnglishVersion(genre)}
                </span>
              ))
            : <span className="ara-record-info__pill">Unknown genre</span>
          }
        </div>
      </div>
      <div className="ara-record-info__item">
        <span className="ara-record-info__label">Region:</span>
        <div className="ara-record-info__pills-container">
          {sideB.regions
            ? sideB.regions.map((region: string, index: number) => (
                <span 
                  key={index} 
                  className="ara-record-info__pill"
                  onClick={() => handlePillClick('regions', getEnglishVersion(region))}
                >
                  {getEnglishVersion(region)}
                </span>
              ))
            : <span className="ara-record-info__pill">Unknown region</span>
          }
        </div>
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

    </div>
  );
};

export default CollectionDetail;
