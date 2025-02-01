// collection detail page - page.tsx

"use client";
export const dynamic = "force-dynamic";

import { useRouter } from "next/navigation"; // Add this import
import { useState, useEffect, useContext } from "react"; // Modified this line
import axios from "axios";
import { usePathname } from "next/navigation";
import { AudioContext } from "@/app/audioLayout";
import Link from "next/link";
import {
  getDefaultImageDetailUrl,
  getImageDetailUrl,
} from "@/utils/assetUtils";
import SharePopup from "@/app/SharePopup";
import _ from "lodash";

interface RecordType {
  [key: string]: any;
}

const splitBilingualField = (value: any) => {
  if (!value) return { en: "", am: "" };
  // Check if value is a string
  if (typeof value !== 'string') {
    console.warn('Non-string value passed to splitBilingualField:', value);
    return { en: String(value), am: String(value) };
  }
  const parts = value.split("|").map(part => part.trim());
  return {
    en: parts[0] || "",
    am: parts[1] || parts[0] // fallback to English if no Armenian
  };
};

const isArmenianScript = (text: string) => {
  // Armenian Unicode range is U+0530 to U+058F
  const armenianPattern = /[\u0530-\u058F]/;
  return armenianPattern.test(text);
};

const splitArtistNames = (artistString: string): string[] => {
  if (!artistString) return [];
  return artistString.split(',').map(name => name.trim());
};

// Add this helper function with your other functions
const formatDuration = (durationInSeconds: number) => {
  const minutes = Math.floor(durationInSeconds / 60);
  const seconds = Math.floor(durationInSeconds % 60);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

// Add this function to get duration
const getAudioDuration = (audioUrl: string): Promise<number> => {
  return new Promise((resolve) => {
    const audio = new Audio(audioUrl);
    audio.addEventListener("loadedmetadata", () => {
      resolve(audio.duration);
    });
  });
};

const getEnglishVersion = (text: string) => {
  if (!text) return text;
  if (text.includes("-|-")) {
    return text.split("-|-")[0].trim();
  }
  return text;
};

const CollectionDetail: React.FC = () => {
  const router = useRouter();


type AvailableFilters = {
  genres: Set<string>;
  instruments: Set<string>;
  regions: Set<string>;
  artists: Set<string>;
  record_label: Set<string>;
};

const [availableFilters, setAvailableFilters] = useState<AvailableFilters>({
  genres: new Set<string>(),
  instruments: new Set<string>(),
  regions: new Set<string>(),
  artists: new Set<string>(),
  record_label: new Set<string>(),
});

  useEffect(() => {
  axios.get("https://ara.directus.app/items/record_archive?groupBy[]=artist_original")
    .then((response) => {
      const uniqueArtists: Set<string> = new Set();
      response.data.data.forEach((artistObj: any) => {
        if (artistObj.artist_original) {
          artistObj.artist_original.split(',').forEach((artist: string) => {
            uniqueArtists.add(getEnglishVersion(artist.trim()));
          });
        }
      });
      setAvailableFilters(prev => ({
        ...prev,
        artists: uniqueArtists
      }));
    })
    .catch((error) => {
      console.error("Error fetching artists:", error);
    });
}, []);

const handlePillClick = (filterType: string, value: string) => {
  // Create an encoded filter object that our main page can understand
  const filterParam = encodeURIComponent(
    JSON.stringify({
      [filterType]: [value],
    })
  );

  // Navigate to main page with filter and scroll position marker
  router.push(`/?filter=${filterParam}#filters`);  // Changed from #collection to #filters
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
  const [isShareOpen, setIsShareOpen] = useState(false);

  // Grab the record ID from the URL
  const pathName = usePathname();
  const araId = pathName.split("/").slice(-1)[0];

  // ----------------------------------------------------------------
  // 2) useEffect to fetch data for this record
  // ----------------------------------------------------------------
  useEffect(() => {
    axios
      .get(
        `https://ara.directus.app/items/record_archive/?filter[ARAID][_eq]=${araId}`
      )
      .then((response) => {
        const initialRecord: any = _.first(response.data.data);
        console.log("initialRecord", initialRecord);
        const ARAID = initialRecord.ARAID;

        axios
          .get(
            `https://ara.directus.app/items/record_archive?filter[ARAID][_eq]=${ARAID}&fields=*,title_english,audio.id,record_label.*`
          ) // Note: added title_english here
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
                  console.error("Error getting duration:", error);
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
  }, [araId]);



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
    const {
      setSong,
      setName,
      setArtistName,
      setAlbumArt,
      setSongId,
      audioPlayerRef,
    } = audioContext;

    const audioPlayer = audioPlayerRef?.current?.audio?.current;
    if (!audioPlayer) return;

    // Find the correct image index based on the side
    const imageIndex = records.findIndex((r) => r.id === record.id);
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
      title: "Title (Armenian)",
      sideA: sideA?.title_armenian ?? "Unknown title",
      sideB: sideB?.title_armenian ?? "Unknown title",
    },
    {
      title: "Title (English)",
      sideA: sideA?.title_english ?? "Unknown title",
      sideB: sideB?.title_english ?? "Unknown title",
    },
    {
      title: "Title (Translation)",
      sideA: sideA?.title_translation ?? "No translation available",
      sideB: sideB?.title_translation ?? "No translation available",
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
                  style={{ cursor: "pointer" }} // Add this
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

            {/* Side B */}
            {sideB && (
              <div className="ara-record-info__side">
                <h4
                  className="ara-record-info__side-title"
                  onClick={() => handleTrackClick(sideB)}
                  style={{ cursor: "pointer" }} // Add this
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
  <span className="ara-record-info__label">Artists:</span>
  <div className="ara-record-info__pills-container">
    {sideA.artist_original ? (
      sideA.artist_original.split(',').map((artist: string, index: number) => {
        const processedArtist = getEnglishVersion(artist.trim());
        const isAvailable = availableFilters.artists.has(processedArtist);
        
        return (
          <span
            key={index}
            className={`ara-record-info__pill ${!isAvailable ? 'disabled' : ''}`}
            onClick={() => isAvailable && handlePillClick("artist_original", processedArtist)}
            style={!isAvailable ? {
              opacity: 0.5,
              cursor: 'not-allowed',
              backgroundColor: '#e0e0e0'
            } : undefined}
          >
            {processedArtist}
          </span>
        );
      })
    ) : (
      <span className="ara-record-info__pill">Unknown artist</span>
    )}
  </div>
</div>
                  <div className="ara-record-info__item">
                    <span className="ara-record-info__label">
                      Instrument Used:
                    </span>
                    <div className="ara-record-info__pills-container">
                      {sideA.instruments ? (
                        sideA.instruments.map(
                          (instrument: string, index: number) => (
                            <span
                              key={index}
                              className="ara-record-info__pill"
                              onClick={() =>
                                handlePillClick(
                                  "instruments",
                                  getEnglishVersion(instrument)
                                )
                              }
                            >
                              {getEnglishVersion(instrument)}
                            </span>
                          )
                        )
                      ) : (
                        <span className="ara-record-info__pill">
                          Unknown instrument
                        </span>
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
                              handlePillClick(
                                "genres",
                                getEnglishVersion(genre)
                              )
                            }
                          >
                            {getEnglishVersion(genre)}
                          </span>
                        ))
                      ) : (
                        <span className="ara-record-info__pill">
                          Unknown genre
                        </span>
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
                              handlePillClick(
                                "regions",
                                getEnglishVersion(region)
                              )
                            }
                          >
                            {getEnglishVersion(region)}
                          </span>
                        ))
                      ) : (
                        <span className="ara-record-info__pill">
                          Unknown region
                        </span>
                      )}
                    </div>
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
                    ? ` ${sideB.track_side.toUpperCase()} — DETAILS`
                    : "SIDE B — DETAILS"}
                </div>
                <div className="ara-record-info__details-content">
<div className="ara-record-info__item">
  <span className="ara-record-info__label">Artists:</span>
  <div className="ara-record-info__pills-container">
    {sideB.artist_original ? (
      sideB.artist_original.split(',').map((artist: string, index: number) => {
        const processedArtist = getEnglishVersion(artist.trim());
        const isAvailable = availableFilters.artists.has(processedArtist);
        
        return (
          <span
            key={index}
            className={`ara-record-info__pill ${!isAvailable ? 'disabled' : ''}`}
            onClick={() => isAvailable && handlePillClick("artist_original", processedArtist)}
            style={!isAvailable ? {
              opacity: 0.5,
              cursor: 'not-allowed',
              backgroundColor: '#e0e0e0'
            } : undefined}
          >
            {processedArtist}
          </span>
        );
      })
    ) : (
      <span className="ara-record-info__pill">Unknown artist</span>
    )}
  </div>
</div>
                  <div className="ara-record-info__item">
                    <span className="ara-record-info__label">
                      Instrument Used:
                    </span>
                    <div className="ara-record-info__pills-container">
                      {sideB.instruments ? (
                        sideB.instruments.map(
                          (instrument: string, index: number) => (
                            <span
                              key={index}
                              className="ara-record-info__pill"
                              onClick={() =>
                                handlePillClick(
                                  "instruments",
                                  getEnglishVersion(instrument)
                                )
                              }
                            >
                              {getEnglishVersion(instrument)}
                            </span>
                          )
                        )
                      ) : (
                        <span className="ara-record-info__pill">
                          Unknown instrument
                        </span>
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
                              handlePillClick(
                                "genres",
                                getEnglishVersion(genre)
                              )
                            }
                          >
                            {getEnglishVersion(genre)}
                          </span>
                        ))
                      ) : (
                        <span className="ara-record-info__pill">
                          Unknown genre
                        </span>
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
                              handlePillClick(
                                "regions",
                                getEnglishVersion(region)
                              )
                            }
                          >
                            {getEnglishVersion(region)}
                          </span>
                        ))
                      ) : (
                        <span className="ara-record-info__pill">
                          Unknown region
                        </span>
                      )}
                    </div>
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
    <div className="ara-record-meta-section__side-a-data-armenian">ԿՈՂՄ Ա ՏՎՅԱԼՆԵՐ</div>
    <div className="ara-record-meta-section__side-b-data">SIDE B DATA</div>
    <div className="ara-record-meta-section__side-b-data-armenian">ԿՈՂՄ Բ ՏՎՅԱԼՆԵՐ</div>
  </div>

  {[
    {
      title: "ARA ID",
      titleAm: "ARA ID",
      sideA: sideA?.ARAID ?? "Unknown ARA ID",
      sideAAm: sideA?.ARAID ?? "Անհայտ ARA ID",
      sideB: sideB?.ARAID ?? "Unknown ARA ID",
      sideBAm: sideB?.ARAID ?? "Անհայտ ARA ID"
    },
    {
      title: "Title",
      titleAm: "ՏՎՅԱԼՆԵՐ",
      sideA: sideA?.title_english ?? "No title",
      sideAAm: sideA?.title_armenian ?? "Վերնագիր չկա",
      sideB: sideB?.title_english ?? "No title",
      sideBAm: sideB?.title_armenian ?? "Վերնագիր չկա"
    },
    {
      title: "Recording Label",
      titleAm: "ՏՎՅԱԼՆԵՐ",
      sideA: sideA?.record_label?.label_en ?? "Unknown Label",
      sideAAm: sideA?.record_label?.label_am ?? "Անհայտ պիտակ",
      sideB: sideB?.record_label?.label_en ?? "Unknown Label",
      sideBAm: sideB?.record_label?.label_am ?? "Անհայտ պիտակ"
    },
    {
      title: "Recording Catalog Number",
      titleAm: "ՏՎՅԱԼՆԵՐ",
      sideA: sideA?.record_catalog_number ?? "No catalog number",
      sideAAm: sideA?.record_catalog_number ?? "Կատալոգի համար չկա",
      sideB: sideB?.record_catalog_number ?? "No catalog number",
      sideBAm: sideB?.record_catalog_number ?? "Կատալոգի համար չկա"
    },
    {
      title: "Language",
      titleAm: "ՏՎՅԱԼՆԵՐ",
      sideA: typeof sideA?.language === 'string' 
        ? splitBilingualField(sideA.language).en.replace(/-$/, '') 
        : "Unknown language",
      sideAAm: typeof sideA?.language === 'string' 
        ? splitBilingualField(sideA.language).am.replace(/^-/, '') 
        : "Անհայտ լեզու",
      sideB: typeof sideB?.language === 'string' 
        ? splitBilingualField(sideB.language).en.replace(/-$/, '') 
        : "Unknown language",
      sideBAm: typeof sideB?.language === 'string' 
        ? splitBilingualField(sideB.language).am.replace(/^-/, '') 
        : "Անհայտ լեզու"
    },
    {
      title: "Instruments",
      titleAm: "ՏՎՅԱԼՆԵՐ",
      sideA: Array.isArray(sideA?.instruments) 
        ? sideA.instruments.map(i => splitBilingualField(i).en.replace(/-$/, '')).join(", ") 
        : "Unknown instruments",
      sideAAm: Array.isArray(sideA?.instruments) 
        ? sideA.instruments.map(i => splitBilingualField(i).am.replace(/^-/, '')).join(", ") 
        : "Անհայտ գործիքներ",
      sideB: Array.isArray(sideB?.instruments) 
        ? sideB.instruments.map(i => splitBilingualField(i).en.replace(/-$/, '')).join(", ") 
        : "Unknown instruments",
      sideBAm: Array.isArray(sideB?.instruments) 
        ? sideB.instruments.map(i => splitBilingualField(i).am.replace(/^-/, '')).join(", ") 
        : "Անհայտ գործիքներ"
    },
    {
      title: "Recording Location",
      titleAm: "ՏՎՅԱԼՆԵՐ",
      sideA: Array.isArray(sideA?.regions) 
        ? sideA.regions.map(r => splitBilingualField(r).en.replace(/-$/, '')).join(", ") 
        : "Unknown location",
      sideAAm: Array.isArray(sideA?.regions) 
        ? sideA.regions.map(r => splitBilingualField(r).am.replace(/^-/, '')).join(", ") 
        : "Անհայտ վայր",
      sideB: Array.isArray(sideB?.regions) 
        ? sideB.regions.map(r => splitBilingualField(r).en.replace(/-$/, '')).join(", ") 
        : "Unknown location",
      sideBAm: Array.isArray(sideB?.regions) 
        ? sideB.regions.map(r => splitBilingualField(r).am.replace(/^-/, '')).join(", ") 
        : "Անհայտ վայր"
    },
    {
      title: "Genre",
      titleAm: "ՏՎՅԱԼՆԵՐ",
      sideA: Array.isArray(sideA?.genres) 
        ? sideA.genres.map(g => splitBilingualField(g).en.replace(/-$/, '')).join(", ") 
        : "Unknown genre",
      sideAAm: Array.isArray(sideA?.genres) 
        ? sideA.genres.map(g => splitBilingualField(g).am.replace(/^-/, '')).join(", ") 
        : "Անհայտ ժանր",
      sideB: Array.isArray(sideB?.genres) 
        ? sideB.genres.map(g => splitBilingualField(g).en.replace(/-$/, '')).join(", ") 
        : "Unknown genre",
      sideBAm: Array.isArray(sideB?.genres) 
        ? sideB.genres.map(g => splitBilingualField(g).am.replace(/^-/, '')).join(", ") 
        : "Անհայտ ժանր"
    },
    {
      title: "Recording Date",
      titleAm: "ՏՎՅԱԼՆԵՐ",
      sideA: sideA?.track_year ?? "Unknown date",
      sideAAm: sideA?.track_year ?? "Անհայտ ամսաթիվ",
      sideB: sideB?.track_year ?? "Unknown date",
      sideBAm: sideB?.track_year ?? "Անհայտ ամսաթիվ"
    },
    {
      title: "Composed by",
      titleAm: "ՏՎՅԱԼՆԵՐ",
      sideA: sideA?.composed_by ?? "Unknown composer",
      sideAAm: sideA?.composed_by ?? "Անհայտ հեղինակ",
      sideB: sideB?.composed_by ?? "Unknown composer",
      sideBAm: sideB?.composed_by ?? "Անհայտ հեղինակ"
    },
    {
      title: "Arranged by",
      titleAm: "ՏՎՅԱԼՆԵՐ",
      sideA: sideA?.arranged_by ?? "Unknown arranger",
      sideAAm: sideA?.arranged_by ?? "Անհայտ դասավորող",
      sideB: sideB?.arranged_by ?? "Unknown arranger",
      sideBAm: sideB?.arranged_by ?? "Անհայտ դասավորող"
    },
    {
      title: "Lyrics by",
      titleAm: "ՏՎՅԱԼՆԵՐ",
      sideA: sideA?.lyrics_by ?? "Unknown lyricist",
      sideAAm: sideA?.lyrics_by ?? "Անհայտ բանաստեղծ",
      sideB: sideB?.lyrics_by ?? "Unknown lyricist",
      sideBAm: sideB?.lyrics_by ?? "Անհայտ բանաստեղծ"
    },
    {
      title: "Conducted by",
      titleAm: "ՏՎՅԱԼՆԵՐ",
      sideA: sideA?.conducted_by ?? "Unknown conductor",
      sideAAm: sideA?.conducted_by ?? "Անհայտ դիրիժոր",
      sideB: sideB?.conducted_by ?? "Unknown conductor",
      sideBAm: sideB?.conducted_by ?? "Անհայտ դիրիժոր"
    }
  ].map((entry, idx) => (
    <div className="ara-record-meta-section__metadata-row" key={idx}>
      <div className="ara-record-meta-section__data-title">{entry.title}</div>
      <div className="ara-record-meta-section__side-a-data">{entry.sideA}</div>
      <div className="ara-record-meta-section__side-a-data-armenian">{entry.sideAAm}</div>
      <div className="ara-record-meta-section__side-b-data">{entry.sideB}</div>
      <div className="ara-record-meta-section__side-b-data-armenian">{entry.sideBAm}</div>
    </div>
  ))}
</div>
      </div>

      <SharePopup
        open={isShareOpen}
        onOpenChange={setIsShareOpen}
        recordTitle={currentRecord.title || "Record"}
        recordId={araId}
      />
    </div>
  );
};

export default CollectionDetail;
