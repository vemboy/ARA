"use client";
export const dynamic = "force-dynamic";

import { useRouter } from "next/navigation";
import { useState, useEffect, useContext, useRef } from "react";
import axios from "axios";
import { usePathname } from "next/navigation";
import { AudioContext } from "@/app/audioLayout";
import Link from "next/link";
import _ from "lodash";
import Footer from "@/app/footer";
import NewSampleRecordImage from "@/app/NewSampleRecordImage";
import {
  getImageDetailUrl,
  getPlaceholderRecordImageUrl,
} from "@/utils/assetUtils";
import SharePopup from "@/app/SharePopup";


function smoothScrollToElement(elementId: string, offset = 0) {
  const targetEl = document.getElementById(elementId);
  if (!targetEl) return;
  const start = window.scrollY;
  const end = targetEl.getBoundingClientRect().top + window.scrollY - offset;
  const duration = 1000;
  const startTime = performance.now();
  const animate = (currentTime: number) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easeInOutCubic =
      progress < 0.5
        ? 4 * progress * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;
    window.scrollTo(0, start + (end - start) * easeInOutCubic);
    if (progress < 1) {
      requestAnimationFrame(animate);
    }
  };
  requestAnimationFrame(animate);
}

function splitBilingualField(value: any) {
  if (!value) return { en: "", am: "" };
  if (typeof value !== "string") return { en: String(value), am: String(value) };
  const parts = value.split("|").map((part) => part.trim());
  return {
    en: parts[0] || "",
    am: parts[1] || parts[0],
  };
}

function isArmenianScript(text: string) {
  const armenianPattern = /[\u0530-\u058F]/;
  return armenianPattern.test(text);
}

function getEnglishVersion(text: string) {
  if (!text) return text;
  if (text.includes("-|-")) {
    return text.split("-|-")[0].trim();
  }
  return text;
}

function formatDuration(durationInSeconds: number) {
  const minutes = Math.floor(durationInSeconds / 60);
  const seconds = Math.floor(durationInSeconds % 60);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

function getAudioDuration(audioUrl: string): Promise<number> {
  return new Promise((resolve) => {
    const audio = new Audio(audioUrl);
    audio.addEventListener("loadedmetadata", () => {
      resolve(audio.duration);
    });
  });
}

interface RecordType {
  [key: string]: any;
}

type AvailableFilters = {
  genres: Set<string>;
  instruments: Set<string>;
  regions: Set<string>;
  artists: Set<string>;
  record_label: Set<string>;
};

export default function CollectionDetail() {
  const pathName = usePathname();
  const router = useRouter();
  const [availableFilters, setAvailableFilters] = useState<AvailableFilters>({
    genres: new Set<string>(),
    instruments: new Set<string>(),
    regions: new Set<string>(),
    artists: new Set<string>(),
    record_label: new Set<string>(),
  });
  const audioContext = useContext(AudioContext);
  const setSong = audioContext?.setSong;
  const setName = audioContext?.setName;
  const setArtistName = audioContext?.setArtistName;
  const setSongId = audioContext?.setSongId;
  const setAlbumArt = audioContext?.setAlbumArt;
  const audioPlayerRef = audioContext?.audioPlayerRef;
  const [records, setRecords] = useState<RecordType[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [isMenuVisible, setIsMenuVisible] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackUrl, setCurrentTrackUrl] = useState<string | null>(null);
  const [durations, setDurations] = useState<{ [key: string]: string }>({});
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [selectedSide, setSelectedSide] = useState<"A" | "B">("A");
  const araId = pathName.split("/").slice(-1)[0];
  const currentIsPlaceholder = images[currentImageIndex] === null;

  function handleCollectionClick(e: React.MouseEvent<HTMLAnchorElement>) {
    e.preventDefault();
    if (pathName === "/") {
      smoothScrollToElement("ara-search-bar", 150);
    } else {
      router.push("/");
      setTimeout(() => {
        smoothScrollToElement("ara-search-bar", 150);
      }, 500);
    }
  }

  function handleArchiveClick() {
    if (pathName === "/") {
      smoothScrollToElement("ara-main", 25);
    } else {
      router.push("/");
      setTimeout(() => {
        smoothScrollToElement("ara-main", 25);
      }, 500);
    }
  }

  function handlePillClick(filterType: string, value: string) {
    const filterParam = encodeURIComponent(
      JSON.stringify({
        [filterType]: [value],
      })
    );
    router.push(`/?filter=${filterParam}#filters`);
  }

  useEffect(() => {
    axios
      .get("https://ara.directus.app/items/record_archive?groupBy[]=artist_original")
      .then((response) => {
        const uniqueArtists: Set<string> = new Set();
        response.data.data.forEach((artistObj: any) => {
          if (artistObj.artist_original) {
            artistObj.artist_original.split(",").forEach((artist: string) => {
              uniqueArtists.add(getEnglishVersion(artist.trim()));
            });
          }
        });
        setAvailableFilters((prev) => ({
          ...prev,
          artists: uniqueArtists,
        }));
      });
  }, []);

  useEffect(() => {
    axios
      .get(`https://ara.directus.app/items/record_archive/?filter[ARAID][_eq]=${araId}`)
      .then((response) => {
        const initialRecord: any = _.first(response.data.data);
        const ARAID = initialRecord.ARAID;
        axios
          .get(
            `https://ara.directus.app/items/record_archive?filter[ARAID][_eq]=${ARAID}&fields=*,title_english,audio.id,record_label.*`
          )
          .then(async (recordsResponse) => {
            let fetchedRecords = recordsResponse.data.data;
            fetchedRecords.sort((a: RecordType, b: RecordType) => {
              const sideA = a.track_side || "A";
              const sideB = b.track_side || "B";
              return sideA.localeCompare(sideB);
            });
            const durationsObj: { [key: string]: string } = {};
            for (const record of fetchedRecords) {
              if (record.audio) {
                const audioUrl = `https://ara.directus.app/assets/${record.audio.id}`;
                record.audioUrl = audioUrl;
                try {
                  const duration = await getAudioDuration(audioUrl);
                  durationsObj[record.id] = formatDuration(duration);
                } catch {
                  durationsObj[record.id] = "0:00";
                }
              }
            }
            setDurations(durationsObj);
            setRecords(fetchedRecords);
            const recordImages = fetchedRecords.map((record: RecordType) =>
              record["record_image"]
                ? getImageDetailUrl(record["record_image"])
                : null
            );
            setImages(recordImages);
          });
      });
  }, [araId]);

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

if (records.length === 0) {
  return (
    <div className="loading-container">
      <div className="progress-bar"></div>
    </div>
  );
}

  function handleTrackClick(record: RecordType) {
    if (!audioContext || !record.audioUrl) return;
    const audioPlayer = audioPlayerRef?.current?.audio?.current;
    if (!audioPlayer) return;
    const imageIndex = records.findIndex((r) => r.id === record.id);
    if (imageIndex !== -1) {
      setCurrentImageIndex(imageIndex);
    }
    if (audioPlayer.src === record.audioUrl) {
      if (audioPlayer.paused) {
        void audioPlayer.play();
        setIsPlaying(true);
      } else {
        audioPlayer.pause();
        setIsPlaying(false);
      }
    } else {
      if (setSong) setSong(record.audioUrl);
      if (setName) setName(record.title || "Unknown Title");
      if (setArtistName) setArtistName(record.artist_original || "Unknown Artist");
      if (setAlbumArt) {
        setAlbumArt(images[imageIndex] || getPlaceholderRecordImageUrl());
      }
      if (record.id && setSongId) setSongId(record.id);
    }
    setCurrentTrackUrl(record.audioUrl);
  }

  function handleImageClick(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    const containerWidth = (event.currentTarget as HTMLElement).offsetWidth;
    const clickX = event.nativeEvent.offsetX;
    if (clickX < containerWidth / 2) {
      const newIndex = (currentImageIndex - 1 + images.length) % images.length;
      setCurrentImageIndex(newIndex);
    } else {
      const newIndex = (currentImageIndex + 1) % images.length;
      setCurrentImageIndex(newIndex);
    }
  }

  function handleMenuToggle() {
    setIsMenuVisible((prev) => !prev);
  }

  const hasImage = images.some((img) => img !== null);
  const sideA = records[0];
  const sideB = records[1];
  const catalogNumbers =
    [sideA?.record_catalog_number, sideB?.record_catalog_number]
      .filter(Boolean)
      .join("|") || "Unknown Cat#";

  const metadataEntries = [
    {
      title: "ARA ID",
      titleAm: "ARA ID",
      sideA: sideA?.ARAID ?? "Unknown ARA ID",
      sideAAm: sideA?.ARAID ?? "Անհայտ ARA ID",
      sideB: sideB?.ARAID ?? "Unknown ARA ID",
      sideBAm: sideB?.ARAID ?? "Անհայտ ARA ID",
    },
    {
      title: "Title",
      titleAm: "Վերնագիր",
      sideA: sideA?.title_english ?? "No title",
      sideAAm: sideA?.title_armenian ?? "Վերնագիր չկա",
      sideB: sideB?.title_english ?? "No title",
      sideBAm: sideB?.title_armenian ?? "Վերնագիր չկա",
    },
    {
      title: "Recording Label",
      titleAm: "Պիտակ",
      sideA: sideA?.record_label?.label_en ?? "Unknown Label",
      sideAAm: sideA?.record_label?.label_am ?? "Անհայտ պիտակ",
      sideB: sideB?.record_label?.label_en ?? "Unknown Label",
      sideBAm: sideB?.record_label?.label_am ?? "Անհայտ պիտակ",
    },
    {
      title: "Recording Catalog Number",
      titleAm: "Կատալոգի համար",
      sideA: sideA?.record_catalog_number ?? "No catalog number",
      sideAAm: sideA?.record_catalog_number ?? "Կատալոգի համար չկա",
      sideB: sideB?.record_catalog_number ?? "No catalog number",
      sideBAm: sideB?.record_catalog_number ?? "Կատալոգի համար չկա",
    },
    {
      title: "Language",
      titleAm: "Լեզու",
      sideA:
        typeof sideA?.language === "string"
          ? splitBilingualField(sideA.language).en.replace(/-$/, "")
          : "Unknown language",
      sideAAm:
        typeof sideA?.language === "string"
          ? splitBilingualField(sideA.language).am.replace(/^-/, "")
          : "Անհայտ լեզու",
      sideB:
        typeof sideB?.language === "string"
          ? splitBilingualField(sideB.language).en.replace(/-$/, "")
          : "Unknown language",
      sideBAm:
        typeof sideB?.language === "string"
          ? splitBilingualField(sideB.language).am.replace(/^-/, "")
          : "Անհայտ լեզու",
    },
    {
      title: "Instruments",
      titleAm: "Գործիքներ",
      sideA: Array.isArray(sideA?.instruments)
        ? sideA.instruments
            .map((i: string) => splitBilingualField(i).en.replace(/-$/, ""))
            .join(", ")
        : "Unknown instruments",
      sideAAm: Array.isArray(sideA?.instruments)
        ? sideA.instruments
            .map((i: string) => splitBilingualField(i).am.replace(/^-/, ""))
            .join(", ")
        : "Անհայտ գործիքներ",
      sideB: Array.isArray(sideB?.instruments)
        ? sideB.instruments
            .map((i: string) => splitBilingualField(i).en.replace(/-$/, ""))
            .join(", ")
        : "Unknown instruments",
      sideBAm: Array.isArray(sideB?.instruments)
        ? sideB.instruments
            .map((i: string) => splitBilingualField(i).am.replace(/^-/, ""))
            .join(", ")
        : "Անհայտ գործիքներ",
    },
    {
      title: "Recording Location",
      titleAm: "Տեղ",
      sideA: Array.isArray(sideA?.regions)
        ? sideA.regions
            .map((r: string) => splitBilingualField(r).en.replace(/-$/, ""))
            .join(", ")
        : "Unknown location",
      sideAAm: Array.isArray(sideA?.regions)
        ? sideA.regions
            .map((r: string) => splitBilingualField(r).am.replace(/^-/, ""))
            .join(", ")
        : "Անհայտ վայր",
      sideB: Array.isArray(sideB?.regions)
        ? sideB.regions
            .map((r: string) => splitBilingualField(r).en.replace(/-$/, ""))
            .join(", ")
        : "Unknown location",
      sideBAm: Array.isArray(sideB?.regions)
        ? sideB.regions
            .map((r: string) => splitBilingualField(r).am.replace(/^-/, ""))
            .join(", ")
        : "Անհայտ վայր",
    },
    {
      title: "Genre",
      titleAm: "Ժանր",
      sideA: Array.isArray(sideA?.genres)
        ? sideA.genres
            .map((g: string) => splitBilingualField(g).en.replace(/-$/, ""))
            .join(", ")
        : "Unknown genre",
      sideAAm: Array.isArray(sideA?.genres)
        ? sideA.genres
            .map((g: string) => splitBilingualField(g).am.replace(/^-/, ""))
            .join(", ")
        : "Անհայտ ժանր",
      sideB: Array.isArray(sideB?.genres)
        ? sideB.genres
            .map((g: string) => splitBilingualField(g).en.replace(/-$/, ""))
            .join(", ")
        : "Unknown genre",
      sideBAm: Array.isArray(sideB?.genres)
        ? sideB.genres
            .map((g: string) => splitBilingualField(g).am.replace(/^-/, ""))
            .join(", ")
        : "Անհայտ ժանր",
    },
    {
      title: "Recording Date",
      titleAm: "Ամսաթիվ",
      sideA: sideA?.track_year ?? "Unknown date",
      sideAAm: sideA?.track_year ?? "Անհայտ ամսաթիվ",
      sideB: sideB?.track_year ?? "Unknown date",
      sideBAm: sideB?.track_year ?? "Անհայտ ամսաթիվ",
    },
    {
      title: "Composed by",
      titleAm: "Հեղինակ",
      sideA: sideA?.composed_by ?? "Unknown composer",
      sideAAm: sideA?.composed_by ?? "Անհայտ հեղինակ",
      sideB: sideB?.composed_by ?? "Unknown composer",
      sideBAm: sideB?.composed_by ?? "Անհայտ հեղինակ",
    },
    {
      title: "Arranged by",
      titleAm: "Դասավորող",
      sideA: sideA?.arranged_by ?? "Unknown",
      sideAAm: sideA?.arranged_by ?? "Անհայտ",
      sideB: sideB?.arranged_by ?? "Unknown",
      sideBAm: sideB?.arranged_by ?? "Անհայտ",
    },
    {
      title: "Lyrics by",
      titleAm: "Բանաստեղծ",
      sideA: sideA?.lyrics_by ?? "Unknown",
      sideAAm: sideA?.lyrics_by ?? "Անհայտ",
      sideB: sideB?.lyrics_by ?? "Unknown",
      sideBAm: sideB?.lyrics_by ?? "Անհայտ",
    },
    {
      title: "Conducted by",
      titleAm: "Դիրիժոր",
      sideA: sideA?.conducted_by ?? "Unknown conductor",
      sideAAm: sideA?.conducted_by ?? "Անհայտ դիրիժոր",
      sideB: sideB?.conducted_by ?? "Unknown conductor",
      sideBAm: sideB?.conducted_by ?? "Անհայտ դիրիժոր",
    },
  ];

  return (
    <>
      <div className="ara-main" id="ara-main">
        <div className="ara-menu" id="ara-menu">
          <div
            className="ara-menu-title"
            id="ara-menu-title"
            onClick={handleArchiveClick}
            style={{ cursor: "pointer" }}
          >
            ARMENIAN RECORD ARCHIVE
          </div>
          <div
            className={`ara-menu-links-wrapper ${isMenuVisible ? "expanded" : ""}`}
            id="ara-menu-links-wrapper"
          >
            <Link href="/" onClick={handleCollectionClick}>
              COLLECTION <br /> ՀԱՎԱՔԱԾՈՅ
            </Link>
            ●
            <Link href="/about">
              ABOUT US
              <br />
              ՄԵՐ ՄԱՍԻՆ
            </Link>
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
          <div className="ara-record-header">
            <div className="ara-header__recording-label">
              {sideA?.record_label?.label_en ?? "Unknown Label"}
            </div>
            <div
              className="ara-header__share"
              onClick={() => setIsShareOpen(true)}
              style={{ cursor: "pointer" }}
            >
              SHARE
            </div>
            <div className="ara-header__recording-catalog-number">
              {catalogNumbers}
            </div>
          </div>

          <div
            className="ara-record-image"
            onClick={handleImageClick}
            style={{ aspectRatio: currentIsPlaceholder ? "1.2" : "1" }}
          >
            <div className="ara-record-image__container">
              {images[currentImageIndex] ? (
<img
  src={images[currentImageIndex]!}
  alt="Record"
  draggable="false"
  className={`ara-record-image__main ${
    isPlaying && records[currentImageIndex]?.audioUrl === currentTrackUrl
      ? "spinning-record"
      : ""
  }`}
/>
              ) : (
                <NewSampleRecordImage
                  className="ara-record-image__main"
                  isPlaying={isPlaying}
                />
              )}
            </div>
            {hasImage && (
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
            )}
          </div>

          <div className="ara-record-info__side-section">
            {sideA && (
              <div className="ara-record-info__side">
                <h4
                  className="ara-record-info__side-title"
                  onClick={() => handleTrackClick(sideA)}
                  style={{ cursor: "pointer" }}
                >
                  {sideA.track_side ? `▶ ${sideA.track_side.toUpperCase()}` : "▶ Side A"}
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
                        {isArmenianScript(sideA.title || "")
                          ? sideA.title
                          : sideA.title_armenian || "No Armenian title"}
                      </div>
                      <div className="ara-record-info__transliteration">
                        {isArmenianScript(sideA.title || "")
                          ? sideA.title_english || "No English transliteration"
                          : sideA.title}
                      </div>
                      <div className="ara-record-info__translation">
                        {sideA.title_translation || "No translation available"}
                      </div>
                    </div>
                    <div className="ara-record-info__song-length">
                      {durations[sideA.id] || "No Audio"}
                    </div>
                  </div>
                </div>
              </div>
            )}
            {sideB && (
              <div className="ara-record-info__side">
                <h4
                  className="ara-record-info__side-title"
                  onClick={() => handleTrackClick(sideB)}
                  style={{ cursor: "pointer" }}
                >
                  {sideB.track_side ? `▶ ${sideB.track_side.toUpperCase()}` : "▶ Side B"}
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
                        {isArmenianScript(sideB.title || "")
                          ? sideB.title
                          : sideB.title_armenian || "No Armenian title"}
                      </div>
                      <div className="ara-record-info__transliteration">
                        {isArmenianScript(sideB.title || "")
                          ? sideB.title_english || "No English transliteration"
                          : sideB.title}
                      </div>
                      <div className="ara-record-info__translation">
                        {sideB.title_translation || "No translation available"}
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

          <div className="ara-record-info__details-section">
            {sideA && (
              <div className="ara-record-info__details-entry">
                <div className="ara-record-info__details-title">
                  {sideA.track_side
                    ? `${sideA.track_side.toUpperCase()} — DETAILS`
                    : "SIDE A — DETAILS"}
                </div>
                <div className="ara-record-info__details-content">
                  <div className="ara-record-info__item">
                    <span className="ara-record-info__label">Artists:</span>
                    <div className="ara-record-info__pills-container">
                      {sideA.artist_original ? (
                        sideA.artist_original.split(",").map(
                          (artist: string, index: number) => {
                            const processedArtist = getEnglishVersion(artist.trim());
                            const isAvailable = availableFilters.artists.has(processedArtist);
                            return (
                              <span
                                key={index}
                                className={`ara-record-info__pill ${
                                  !isAvailable ? "disabled" : ""
                                }`}
                                onClick={() =>
                                  isAvailable &&
                                  handlePillClick("artist_original", processedArtist)
                                }
                                style={
                                  !isAvailable
                                    ? {
                                        opacity: 0.5,
                                        cursor: "not-allowed",
                                        backgroundColor: "#e0e0e0",
                                      }
                                    : undefined
                                }
                              >
                                {processedArtist}
                              </span>
                            );
                          }
                        )
                      ) : (
                        <span className="ara-record-info__pill">Unknown artist</span>
                      )}
                    </div>
                  </div>
                  <div className="ara-record-info__item">
                    <span className="ara-record-info__label">Instrument Used:</span>
                    <div className="ara-record-info__pills-container">
                      {sideA.instruments ? (
                        sideA.instruments.map((instrument: string, index: number) => (
                          <span
                            key={index}
                            className="ara-record-info__pill"
                            onClick={() =>
                              handlePillClick("instruments", getEnglishVersion(instrument))
                            }
                          >
                            {getEnglishVersion(instrument)}
                          </span>
                        ))
                      ) : (
                        <span className="ara-record-info__pill">Unknown instrument</span>
                      )}
                    </div>
                  </div>
                  <div className="ara-record-info__item">
                    <span className="ara-record-info__label">Genre:</span>
                    <div className="ara-record-info__pills-container">
                      {sideA.genres ? (
                        sideA.genres.map((genre: string, index: number) => (
                          <span
                            key={index}
                            className="ara-record-info__pill"
                            onClick={() =>
                              handlePillClick("genres", getEnglishVersion(genre))
                            }
                          >
                            {getEnglishVersion(genre)}
                          </span>
                        ))
                      ) : (
                        <span className="ara-record-info__pill">Unknown genre</span>
                      )}
                    </div>
                  </div>
                  <div className="ara-record-info__item">
                    <span className="ara-record-info__label">Region:</span>
                    <div className="ara-record-info__pills-container">
                      {sideA.regions ? (
                        sideA.regions.map((region: string, index: number) => (
                          <span
                            key={index}
                            className="ara-record-info__pill"
                            onClick={() =>
                              handlePillClick("regions", getEnglishVersion(region))
                            }
                          >
                            {getEnglishVersion(region)}
                          </span>
                        ))
                      ) : (
                        <span className="ara-record-info__pill">Unknown region</span>
                      )}
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
            {sideB && (
              <div className="ara-record-info__details-entry">
                <div className="ara-record-info__details-title">
                  {sideB.track_side
                    ? `${sideB.track_side.toUpperCase()} — DETAILS`
                    : "SIDE B — DETAILS"}
                </div>
                <div className="ara-record-info__details-content">
                  <div className="ara-record-info__item">
                    <span className="ara-record-info__label">Artists:</span>
                    <div className="ara-record-info__pills-container">
                      {sideB.artist_original ? (
                        sideB.artist_original.split(",").map(
                          (artist: string, index: number) => {
                            const processedArtist = getEnglishVersion(artist.trim());
                            const isAvailable = availableFilters.artists.has(processedArtist);
                            return (
                              <span
                                key={index}
                                className={`ara-record-info__pill ${
                                  !isAvailable ? "disabled" : ""
                                }`}
                                onClick={() =>
                                  isAvailable &&
                                  handlePillClick("artist_original", processedArtist)
                                }
                                style={
                                  !isAvailable
                                    ? {
                                        opacity: 0.5,
                                        cursor: "not-allowed",
                                        backgroundColor: "#e0e0e0",
                                      }
                                    : undefined
                                }
                              >
                                {processedArtist}
                              </span>
                            );
                          }
                        )
                      ) : (
                        <span className="ara-record-info__pill">Unknown artist</span>
                      )}
                    </div>
                  </div>
                  <div className="ara-record-info__item">
                    <span className="ara-record-info__label">Instrument Used:</span>
                    <div className="ara-record-info__pills-container">
                      {sideB.instruments ? (
                        sideB.instruments.map((instrument: string, index: number) => (
                          <span
                            key={index}
                            className="ara-record-info__pill"
                            onClick={() =>
                              handlePillClick("instruments", getEnglishVersion(instrument))
                            }
                          >
                            {getEnglishVersion(instrument)}
                          </span>
                        ))
                      ) : (
                        <span className="ara-record-info__pill">Unknown instrument</span>
                      )}
                    </div>
                  </div>
                  <div className="ara-record-info__item">
                    <span className="ara-record-info__label">Genre:</span>
                    <div className="ara-record-info__pills-container">
                      {sideB.genres ? (
                        sideB.genres.map((genre: string, index: number) => (
                          <span
                            key={index}
                            className="ara-record-info__pill"
                            onClick={() =>
                              handlePillClick("genres", getEnglishVersion(genre))
                            }
                          >
                            {getEnglishVersion(genre)}
                          </span>
                        ))
                      ) : (
                        <span className="ara-record-info__pill">Unknown genre</span>
                      )}
                    </div>
                  </div>
                  <div className="ara-record-info__item">
                    <span className="ara-record-info__label">Region:</span>
                    <div className="ara-record-info__pills-container">
                      {sideB.regions ? (
                        sideB.regions.map((region: string, index: number) => (
                          <span
                            key={index}
                            className="ara-record-info__pill"
                            onClick={() =>
                              handlePillClick("regions", getEnglishVersion(region))
                            }
                          >
                            {getEnglishVersion(region)}
                          </span>
                        ))
                      ) : (
                        <span className="ara-record-info__pill">Unknown region</span>
                      )}
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

          <div className="ara-record-meta-section">
            <div className="ara-record-meta-section__header">
              <div className="ara-record-meta-section__header-title">METADATA</div>
              <div className="ara-record-meta-section__header-toggle">
                <span
                  className={`toggle-option ${selectedSide === "A" ? "active" : ""}`}
                  onClick={() => setSelectedSide("A")}
                >
                  SIDE A
                </span>
                <span
                  className={`toggle-option ${selectedSide === "B" ? "active" : ""}`}
                  onClick={() => setSelectedSide("B")}
                >
                  SIDE B
                </span>
              </div>
            </div>
            {metadataEntries.map((entry, idx) => (
              <div className="ara-record-meta-section__metadata-row" key={idx}>
                <div className="ara-record-meta-section__data-title">
                  {entry.title}
                </div>
                <div className="ara-record-meta-section__data-english">
                  {selectedSide === "A" ? entry.sideA : entry.sideB}
                </div>
                <div className="ara-record-meta-section__data-armenian">
                  {selectedSide === "A" ? entry.sideAAm : entry.sideBAm}
                </div>
              </div>
            ))}
          </div>
        </div>

        {isShareOpen && (
          <SharePopup
            open={isShareOpen}
            onOpenChange={setIsShareOpen}
            recordTitle={sideA?.title || "Unknown Title"}
            recordId={sideA?.ARAID || ""}
          />
        )}
      </div>
      <Footer />
    </>
  );
}
