import { Dispatch, SetStateAction, createContext, useState } from "react";
import { Inter } from "next/font/google";
import AudioPlayer from "react-h5-audio-player";

const inter = Inter({ subsets: ["latin"] });

export const AudioContext = createContext<Dispatch<
  SetStateAction<string>
> | null>(null);

export function AudioLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [currentSong, setSong] = useState("");

  return (
    <html lang="en">
      <AudioContext.Provider value={setSong}>
        <body className={inter.className}>
          {children}
          {currentSong.length == 0 ? (
            <AudioPlayer
              src={currentSong}
              className="audio-player-hidden"
            ></AudioPlayer>
          ) : (
            <AudioPlayer
              src={currentSong}
              className="audio-player"
            ></AudioPlayer>
          )}
        </body>
      </AudioContext.Provider>
    </html>
  );
}
