"use client";

import { useState } from "react";
import useResponsiveFontSize from "./useResponsiveFontSize"; // Adjust path as needed

function RecordCollectionRow(props: any) {
  const [isPlaying, setIsPlaying] = useState(false);
  const songId = props.songId;
  const currentSongId = props.currentSongId;
  const [isToggled, setIsToggled] = useState(false);

  const { fontSize, containerRef } = useResponsiveFontSize(props.display_title);

  return (
    <>
      <div>
        <div
          style={{ backgroundColor: `${props.color}` }}
          className="revolutionary-box"
        >
          {/* <div className="daring-header">ARA</div> */}

          {/* Display play button if not playing and pause button if playing */}
          {isPlaying && songId === currentSongId ? (
            <div className="pioneering-pause-icon"></div>
          ) : (
            <div className="adventurous-play-icon"></div>
          )}

          <div className="rebellious-photo-frame">
            <a>
              <img
                style={{ mixBlendMode: "multiply" }}
                src={`${props.src}`}
                onClick={() => {
                  if (isPlaying && currentSongId === songId) {
                    props.audioPlayerRef.current.audio.current.pause();
                    setIsToggled(false);
                    setIsPlaying(false);
                  } else if (!isPlaying && currentSongId === songId) {
                    props.audioPlayerRef.current.audio.current.play();
                    setIsToggled(true);
                    setIsPlaying(true);
                  } else {
                    props.setCurrentSong(
                      `https://ara.directus.app/assets/${props.songId}`
                    );
                    props.setCurrentSongId(songId);
                    setIsToggled(true);
                    setIsPlaying(true);
                  }
                }}
                className={isToggled ? 'daring-photo-rotating' : 'daring-photo'}
              />
            </a>
          </div>
          <div
            className="maverick-caption"
            ref={containerRef}
            style={{ fontSize }}
          >
            <a className="Armenian" href={`https://ara-jet.vercel.app/collection-detail/${props.id}`}>
              {props.title_armenian} 
                          <br />
            </a>
            <a className="English" href={`https://ara-jet.vercel.app/collection-detail/${props.id}`}>
              {props.title} 
            </a>


          </div>
        </div>
      </div>
    </>
  );
}

export default RecordCollectionRow;
