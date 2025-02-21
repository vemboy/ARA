"use client";
export const dynamic = "force-dynamic";

import {
  Dispatch,
  RefObject,
  SetStateAction,
  createContext,
  useRef,
  useState,
  useEffect,
  MouseEvent,
} from "react";
import { Inter } from "next/font/google";
import AudioPlayer from "react-h5-audio-player";

const inter = Inter({ subsets: ["latin"] });

export const AudioContext = createContext<{
  setSong: Dispatch<SetStateAction<string>>;
  setName: Dispatch<SetStateAction<string>>;
  setArtistName: Dispatch<SetStateAction<string>>;
  setSongId: Dispatch<SetStateAction<string>>;
  setAlbumArt: Dispatch<SetStateAction<string>>;
  audioPlayerRef: RefObject<AudioPlayer>;
} | null>(null);

export function AudioLayout({ children }: { children: React.ReactNode }) {
  // Basic track info
  const [currentSong, setSong] = useState("");
  const [currentName, setName] = useState("");
  const [currentArtistName, setArtistName] = useState("");
  const [currentSongId, setSongId] = useState("");
  const [currentAlbumArt, setAlbumArt] = useState("");

  // Playback states
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Underlying react-h5-audio-player ref
  const audioPlayerRef = useRef<AudioPlayer>(null);

  // Provide in context
  const audioProps = {
    setSong,
    setName,
    setArtistName,
    setSongId,
    setAlbumArt,
    audioPlayerRef,
  };

  // Whether we have a valid track loaded
  const hasSong =
    Boolean(currentSong && currentSong.length > 0 && currentName && currentName.length > 0);

  // Listen for the <audio> "play"/"pause" events
  useEffect(() => {
    const player = audioPlayerRef.current?.audio?.current;
    if (!player) return;

    const handlePause = () => {
      setIsPlaying(false);
      window.dispatchEvent(new CustomEvent("audioPause"));
    };
    const handlePlay = () => {
      setIsPlaying(true);
      window.dispatchEvent(new CustomEvent("audioPlay"));
    };

    player.addEventListener("pause", handlePause);
    player.addEventListener("play", handlePlay);

    return () => {
      player.removeEventListener("pause", handlePause);
      player.removeEventListener("play", handlePlay);
    };
  }, [currentSong]);

  // Update currentTime/duration as the audio plays
  useEffect(() => {
    const player = audioPlayerRef.current?.audio?.current;
    if (!player) return;

    const timeUpdateHandler = () => {
      setCurrentTime(player.currentTime);
      setDuration(player.duration || 0);
    };

    player.addEventListener("timeupdate", timeUpdateHandler);
    player.addEventListener("loadedmetadata", timeUpdateHandler);

    return () => {
      player.removeEventListener("timeupdate", timeUpdateHandler);
      player.removeEventListener("loadedmetadata", timeUpdateHandler);
    };
  }, [currentSong]);

  // -------------------------------------------------
  // NEW: Handle pressing "Space" to toggle play/pause
  // -------------------------------------------------
  useEffect(() => {
    const handleSpacebar = (e: KeyboardEvent) => {
      // Only toggle if a track is loaded
      if (e.code === "Space" && hasSong) {
        e.preventDefault(); // Prevent page from scrolling
        handleTogglePlay();
      }
    };

    window.addEventListener("keydown", handleSpacebar);
    return () => {
      window.removeEventListener("keydown", handleSpacebar);
    };
  }, [hasSong]);
  // -------------------------------------------------

  // Format mm:ss
  function formatTime(time: number): string {
    if (!time || isNaN(time)) return "00:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    const mm = minutes < 10 ? `0${minutes}` : `${minutes}`;
    const ss = seconds < 10 ? `0${seconds}` : `${seconds}`;
    return `${mm}:${ss}`;
  }

  // Click on progress bar => seek in track (if a song is loaded)
  function handleProgressClick(e: MouseEvent<HTMLDivElement>) {
    if (!hasSong) return; // no track => do nothing
    const player = audioPlayerRef.current?.audio?.current;
    if (!player || duration === 0) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = clickX / rect.width;
    player.currentTime = ratio * duration;
  }

  // Toggle play/pause
  function handleTogglePlay() {
    if (!hasSong) return; // no track => do nothing
    const player = audioPlayerRef.current?.audio?.current;
    if (!player) return;

    if (player.paused) player.play();
    else player.pause();
  }

  // Decide times
  let displayCurrentTime = formatTime(currentTime);
  let displayDuration = formatTime(duration);

  // If we have no actual track => "00:00 | --:--"
  if (!hasSong) {
    displayCurrentTime = "00:00";
    displayDuration = "--:--";
  } else if (duration === 0) {
    // loaded, but no metadata => second is --:--
    displayDuration = "--:--";
  }

  // Fill portion of progress
  const progressRatio = hasSong && duration > 0 ? currentTime / duration : 0;
  const progressPercent = `${progressRatio * 100}%`;

  // Single play/pause icon
  const playPauseIcon = isPlaying ? "❚❚" : "►";

  return (
    <html lang="en">
      <AudioContext.Provider value={audioProps}>
        <body className={inter.className}>
          {children}

          {hasSong && (
            <div className="ara-record-player-wrapper">
              <div
                className="ara-record-player-info"
                style={{ display: "flex", alignItems: "center" }}
              >
                <div className="ara-record-player-image">
                  <img
                    src={
                      hasSong
                        ? currentAlbumArt || "https://via.placeholder.com/50"
                        : "/ARA_armenaphone_05.jpg"
                    }
                    alt="Image"
                    className="ara-record-player-thumbnail-img"
                  />
                </div>
                <div
                  className="ara-record-player-song-info"
                  style={{ display: "flex", alignItems: "center", marginLeft: "1rem" }}
                >
                  <div style={{ display: "flex", flexDirection: "column", marginRight: "1rem" }}>
                    <div className="ara-record-player-song-title">
                      {currentName || "Unknown Song"}
                    </div>
                    <div className="ara-record-player-artist-name">
                      {currentArtistName || "Unknown Artist"}
                    </div>
                  </div>

                  <div
                    onClick={handleTogglePlay}
                    style={{
                      fontSize: "1.5rem",
                      cursor: "pointer",
                      userSelect: "none",
                    }}
                  >
                    {playPauseIcon}
                  </div>
                </div>
              </div>

              <div className="ara-record-player-audio-section">
                <div
                  className="ara-record-player-progress-bar"
                  onClick={handleProgressClick}
                  style={{
                    position: "relative",
                    cursor: hasSong ? "pointer" : "default",
                    height: "7px",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      bottom: 0,
                      width: progressPercent,
                      backgroundColor: "hsl(225, 15%, 60%)",
                      transition: "width 0.1s linear",
                    }}
                  />
                </div>
                <div className="ara-record-player-time">
                  {displayCurrentTime} | {displayDuration}
                </div>
              </div>
            </div>
          )}

          {/* Hidden react-h5-audio-player */}
          <div style={{ display: "none" }}>
            <AudioPlayer ref={audioPlayerRef} src={currentSong} autoPlay={false} />
          </div>
        </body>
      </AudioContext.Provider>
    </html>
  );
}
