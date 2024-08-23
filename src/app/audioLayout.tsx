import {
  Dispatch,
  RefObject,
  SetStateAction,
  createContext,
  useRef,
  useState,
} from "react";
import { Inter } from "next/font/google";
import AudioPlayer from "react-h5-audio-player";

const inter = Inter({ subsets: ["latin"] });

export const AudioContext = createContext<{
  setSong: Dispatch<SetStateAction<string>>;
  setName: Dispatch<SetStateAction<string>>;
  audioPlayerRef: RefObject<AudioPlayer>;
} | null>(null);

export function AudioLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [currentSong, setSong] = useState("");
  const [currentName, setName] = useState(""); // Keep this to display the name
  const audioPlayerRef = useRef<AudioPlayer>(null);

  const audioProps = {
    setSong,
    setName,
    audioPlayerRef,
  };

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
        <div className="current-song-info-wrapper">
          {/* Album Art */}
          <img 
            src="https://via.placeholder.com/50" 
            alt="Album Art" 
            className="album-art"
          />
          {/* Song Info */}
          <div className="current-song-info">
            <p className="song-title">{currentName || "Unknown Song"}</p>
            <p className="song-artist">Maha Al-Jabri</p> {/* Dummy Artist Name */}
          </div>
        </div>
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