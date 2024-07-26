"use client";

import { useState } from "react";

function RecordCollectionRow(props: any) {
  const [isPlaying, setIsPlaying] = useState(false);
  const songId = props.songId;
  const currentSongId = props.currentSongId;

  return (
    <>
      <div>
        {/* <div className="airtable-gallery-container"> */}
        <div
          style={{ backgroundColor: `${props.color}` }}
          className="div-container-container"
        >
          <div className="ARA_TITLE">ARA</div>

          {/* Display play button if not playing and pause button if playing */}
          {isPlaying && songId === currentSongId ? (
            <div className="pause"></div>
          ) : (
            <div className="play-button"></div>
          )}

          <div className="div-container">
            <a>
              <img
                src={`${props.src}`}
                onClick={() => {
                  if (isPlaying && currentSongId === songId) {
                    props.audioPlayerRef.current.audio.current.pause();
                    setIsPlaying(false);
                  } else if (!isPlaying && currentSongId === songId) {
                    props.audioPlayerRef.current.audio.current.play();
                    setIsPlaying(true);
                  } else {
                    props.setCurrentSong(
                      `https://ara.directus.app/assets/${props.songId}`
                    );
                    props.setCurrentSongId(songId);
                    setIsPlaying(true);
                  }
                }}
                className="airtable-gallery"
              ></img>
            </a>
          </div>
          <div className="text-container">
            <div>{props.display_title}</div>
          </div>
        </div>
      </div>
    </>
  );
}

export default RecordCollectionRow;
