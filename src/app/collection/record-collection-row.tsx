"use client";

import { useEffect, useState, useRef } from "react";
import useResponsiveFontSize from "./useResponsiveFontSize"; // Adjust path as needed
import axios from "axios";

interface ZoomData {
  id: string;
  Value: number;
}

function RecordCollectionRow(props: any) {
  const [isPlaying, setIsPlaying] = useState(false);
  const songId = props.songId;
  const currentSongId = props.currentSongId;
  const { fontSize, containerRef } = useResponsiveFontSize(props.display_title);

  const [zoomAmount, setZoomAmount] = useState<number>(1.0);

  useEffect(() => {
    async function fetchZoomAmount() {
      try {
        const response = await axios.get(`https://ara.directus.app/items/website_variables`);
        const zoomData: ZoomData | undefined = response?.data?.data?.find((item: ZoomData) => item.id === "RecordZoomAmount");

        if (zoomData && zoomData.Value) {
          setZoomAmount(zoomData.Value); // Update the zoom amount from Directus
        }
      } catch (error) {
        console.error("Error fetching RecordZoomAmount:", error);
      }
    }

    fetchZoomAmount();
  }, []);

  const handleRecordClick = () => {
    if (isPlaying && currentSongId === songId) {
      // Pause the current song
      props.audioPlayerRef.current.audio.current.pause();
      setIsPlaying(false);
    } else if (!isPlaying && currentSongId === songId) {
      // Resume the current song
      props.audioPlayerRef.current.audio.current.play();
      setIsPlaying(true);
    } else {
      // Play a new song and reset the spinning of other records
      props.setCurrentSong(`https://ara.directus.app/assets/${props.songId}`);
      props.setCurrentSongId(songId);
      setIsPlaying(true);

      // Automatically start playing the new song
      setTimeout(() => {
        if (props.audioPlayerRef.current) {
          props.audioPlayerRef.current.audio.current.play();
        }
      }, 0);
    }
  };

  // Reset spinning when the current song is not the same as this record
  useEffect(() => {
    if (currentSongId !== songId) {
      setIsPlaying(false); // Stop spinning when this record is no longer playing
    }
  }, [currentSongId]);

  return (
    <div>
      <div style={{ backgroundColor: `${props.color}` }} className="revolutionary-box">
        {isPlaying && songId === currentSongId ? (
          <div className="pioneering-pause-icon"></div>
        ) : (
          <div className="adventurous-play-icon"></div>
        )}

        <div className="rebellious-photo-frame">
          <a>
            <img
              style={{ transform: `scale(${zoomAmount})` }}
              src={`${props.src}`}
              onClick={handleRecordClick}
              className={isPlaying && currentSongId === songId ? "daring-photo-rotating" : "daring-photo"}
            />
          </a>
        </div>
        <div className="maverick-caption" ref={containerRef} style={{ fontSize }}>
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
  );
}

export default RecordCollectionRow;