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
  audioPlayerRef: RefObject<AudioPlayer>;
} | null>(null);

export function AudioLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [currentSong, setSong] = useState("");
  const audioPlayerRef = useRef<AudioPlayer>(null);

  const audioProps = {
    setSong,
    audioPlayerRef,
  };

  return (
    <>
      <html lang="en">
        <AudioContext.Provider value={audioProps}>
          <body className={inter.className}>
            {children}
            {currentSong.length == 0 ? (
              <div className="audio-player-wrapper">
              <AudioPlayer
                ref={audioPlayerRef}
                src={currentSong}
                //className="audio-player"
                className="audio-player-hidden"
              ></AudioPlayer>
              </div>

            ) : (
              <div className="audio-player-wrapper">
              <AudioPlayer
                ref={audioPlayerRef}
                src={currentSong}
                className="audio-player"
              ></AudioPlayer>
</div>
            )}
          </body>
        </AudioContext.Provider>
      </html>
    </>
  );
}
