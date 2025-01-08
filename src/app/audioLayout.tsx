// audioLayout.tsx

import {
  Dispatch,
  RefObject,
  SetStateAction,
  createContext,
  useRef,
  useState,
  useEffect,
} from "react";
import { Inter } from "next/font/google";
import AudioPlayer from "react-h5-audio-player";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const AudioContext = createContext<{
  setSong: Dispatch<SetStateAction<string>>;
  setName: Dispatch<SetStateAction<string>>;
  setArtistName: Dispatch<SetStateAction<string>>;
  setSongId: Dispatch<SetStateAction<string>>;
  setAlbumArt: Dispatch<SetStateAction<string>>;
  audioPlayerRef: RefObject<AudioPlayer>;
} | null>(null);

export function AudioLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [currentSong, setSong] = useState("");
  const [currentName, setName] = useState("");
  const [currentArtistName, setArtistName] = useState("");
  const [currentSongId, setSongId] = useState("");
  const [currentAlbumArt, setAlbumArt] = useState("");

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const audioPlayerRef = useRef<AudioPlayer>(null);

  const audioProps = {
    setSong,
    setName,
    setArtistName,
    setSongId,
    setAlbumArt,
    audioPlayerRef,
  };

  useEffect(() => {
    const player = audioPlayerRef.current?.audio?.current;
    if (player) {
      const handlePause = () => {
        const event = new CustomEvent("audioPause");
        window.dispatchEvent(event);
      };

      const handlePlay = () => {
        const event = new CustomEvent("audioPlay");
        window.dispatchEvent(event);
      };

      player.addEventListener("pause", handlePause);
      player.addEventListener("play", handlePlay);

      return () => {
        player.removeEventListener("pause", handlePause);
        player.removeEventListener("play", handlePlay);
      };
    }
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

  const formatTime = (time: number) => {
    if (!time || isNaN(time)) return "00:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    const mm = minutes < 10 ? `0${minutes}` : minutes;
    const ss = seconds < 10 ? `0${seconds}` : seconds;
    return `${mm}:${ss}`;
  };

  const displayCurrentTime = formatTime(currentTime);
  const displayDuration = formatTime(duration);

  return (
    <html lang="en">
      <AudioContext.Provider value={audioProps}>
        <body className={inter.className}>
          {children}

          {currentSong && currentSong.length > 0 && (
            <div className="ara-record-player-wrapper">
              <div className="ara-record-player-info">
                <div className="ara-record-player-image">
                  <img
                    src={currentAlbumArt || "https://via.placeholder.com/50"}
                    alt="Image"
                    className="ara-record-player-thumbnail-img"
                  />
                </div>

                <div className="ara-record-player-song-info">
                  <div className="ara-record-player-song-title">
                    {currentName || "Unknown Song"}
                  </div>
                  <div className="ara-record-player-artist-name">
                    {currentArtistName || "Unknown Artist"}
                  </div>
                </div>
              </div>

              <div className="ara-record-player-audio-section">
                <div className="ara-record-player-progress-bar"></div>
                <div className="ara-record-player-time">
                  {displayCurrentTime} | {displayDuration}
                </div>
              </div>
            </div>
          )}

          <div style={{ display: "none" }}>
            <AudioPlayer
              ref={audioPlayerRef}
              src={currentSong}
              autoPlay={false}
            />
          </div>
        </body>
      </AudioContext.Provider>
    </html>
  );
}
