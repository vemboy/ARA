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
  audioPlayerRef: RefObject<AudioPlayer>;
} | null>(null);

export function AudioLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [currentSong, setSong] = useState("");
  const [currentName, setName] = useState(""); // Keep this to display the name
  const [currentArtistName, setArtistName] = useState("");
  const [currentSongId, setSongId] = useState(""); // Add songId state

  const audioPlayerRef = useRef<AudioPlayer>(null);

  const audioProps = {
    setSong,
    setName,
    setArtistName,
    setSongId, // Pass down setSongId
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

  return (
    <>
      <html lang="en">
        <AudioContext.Provider value={audioProps}>
          <body className={inter.className}>
            {children}

            {/* Audio Player */}
            {currentSong.length === 0 ? (
              <div className="audio-player-wrapper-hidden">
                <AudioPlayer
                  ref={audioPlayerRef}
                  src={currentSong}
                  className="audio-player-hidden"
                />
              </div>
            ) : (
              <div className="audio-player-wrapper">
                <Link
                  href={`collection-detail/${currentSongId}`}
                  className="current-song-info-wrapper"
                >
                  {/* Album Art */}
                  <img
                    src="https://via.placeholder.com/50"
                    alt="Album Art"
                    className="album-art"
                  />
                  {/* Song Info */}
                  <div className="current-song-info">
                    <p className="song-title">
                      {currentName || "Unknown Song"}
                    </p>
                    <p className="song-artist">
                      {currentArtistName || "Unknown Artist"}
                    </p>
                  </div>
                </Link>
                <div className="audio-player-container">
                  <AudioPlayer
                    ref={audioPlayerRef}
                    src={currentSong}
                    className="audio-player"
                  />
                </div>
              </div>
            )}
          </body>
        </AudioContext.Provider>
      </html>
    </>
  );
}
