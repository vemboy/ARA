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
import { useRouter } from "next/navigation";

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
  const [currentSong, setSong] = useState("");
  const [currentName, setName] = useState("");
  const [currentArtistName, setArtistName] = useState("");
  const [currentSongId, setSongId] = useState("");
  const [currentAlbumArt, setAlbumArt] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioPlayerRef = useRef<AudioPlayer>(null);
  const router = useRouter();
  const audioProps = {
    setSong,
    setName,
    setArtistName,
    setSongId,
    setAlbumArt,
    audioPlayerRef,
  };
  const hasSong = Boolean(
    currentSong && currentSong.length > 0 && currentName && currentName.length > 0
  );
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

useEffect(() => {
  const handleSpacebar = (e: KeyboardEvent) => {
    if (e.code === "Space" && hasSong) {
      if (document.activeElement instanceof HTMLElement) {
        const tag = document.activeElement.tagName.toLowerCase();
        if (tag === "input" || tag === "textarea" || document.activeElement.isContentEditable) {
          return;
        }
      }
      e.preventDefault();
      handleTogglePlay();
    }
  };
  window.addEventListener("keydown", handleSpacebar);
  return () => {
    window.removeEventListener("keydown", handleSpacebar);
  };
}, [hasSong]);

  function formatTime(time: number): string {
    if (!time || isNaN(time)) return "00:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    const mm = minutes < 10 ? `0${minutes}` : `${minutes}`;
    const ss = seconds < 10 ? `0${seconds}` : `${seconds}`;
    return `${mm}:${ss}`;
  }
  function handleProgressClick(e: MouseEvent<HTMLDivElement>) {
    if (!hasSong) return;
    const player = audioPlayerRef.current?.audio?.current;
    if (!player || duration === 0) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = clickX / rect.width;
    player.currentTime = ratio * duration;
  }
  function handleTogglePlay() {
    if (!hasSong) return;
    const player = audioPlayerRef.current?.audio?.current;
    if (!player) return;
    if (player.paused) player.play();
    else player.pause();
  }
  let displayCurrentTime = formatTime(currentTime);
  let displayDuration = formatTime(duration);
  if (!hasSong) {
    displayCurrentTime = "00:00";
    displayDuration = "--:--";
  } else if (duration === 0) {
    displayDuration = "--:--";
  }
  const progressRatio = hasSong && duration > 0 ? currentTime / duration : 0;
  const progressPercent = `${progressRatio * 100}%`;
  const playPauseIcon = isPlaying ? "❚❚" : "►";
  return (
    <html lang="en">
      <AudioContext.Provider value={audioProps}>
        <body className={inter.className}>
          {children}
          {hasSong && (
            <div className="ara-record-player-wrapper">
              <div className="ara-record-player-info" style={{ display: "flex", alignItems: "center" }}>
                <div
                  className="ara-record-player-image"
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    if (!currentSongId) return;
                    router.push(`/record-details/${currentSongId}`);
                  }}
                >
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
                  <div
                    style={{ display: "flex", flexDirection: "column", marginRight: "1rem", cursor: "pointer" }}
                    onClick={() => {
                      if (!currentSongId) return;
                      router.push(`/record-details/${currentSongId}`);
                    }}
                  >
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
          <div style={{ display: "none" }}>
            <AudioPlayer ref={audioPlayerRef} src={currentSong} autoPlay={false} />
          </div>
        </body>
      </AudioContext.Provider>
    </html>
  );
}
