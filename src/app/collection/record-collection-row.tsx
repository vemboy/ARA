"use client";

import { useEffect, useState } from "react";
import useResponsiveFontSize from "./useResponsiveFontSize"; // Adjust path as needed
import axios from "axios";
import Link from "next/link";

interface ZoomData {
  id: string;
  Value: number;
}

function RecordCollectionRow(props: any) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [rotationAngle, setRotationAngle] = useState(0); // Store the current rotation angle
  const songId = props.songId;
  const currentSongId = props.currentSongId;
  const { fontSize, containerRef } = useResponsiveFontSize(props.display_title);

  const [zoomAmount, setZoomAmount] = useState<number>(1.0);

  useEffect(() => {
    async function fetchZoomAmount() {
      try {
        const response = await axios.get(
          `https://ara.directus.app/items/website_variables`
        );
        const zoomData: ZoomData | undefined = response?.data?.data?.find(
          (item: ZoomData) => item.id === "RecordZoomAmount"
        );

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
      props.audioPlayerRef.current.audio.current.pause();
      setIsPlaying(false);
    } else if (!isPlaying && currentSongId === songId) {
      props.audioPlayerRef.current.audio.current.play();
      setIsPlaying(true);
    } else {
      props.setCurrentSong(`https://ara.directus.app/assets/${props.songId}`);
      props.setCurrentSongId(songId);
      props.setCurrentName(props.title);
      props.setCurrentArtistName(props.author);
      props.setSongId(props.id); // Pass the songId here
      setIsPlaying(true);

      // Automatically start playing the song
      setTimeout(() => {
        if (props.audioPlayerRef.current) {
          props.audioPlayerRef.current.audio.current.play();
        }
      }, 0);
    }
  };

  // Calculate rotation based on elapsed time
  useEffect(() => {
    let animationFrame: number;
    let start: number | null = null;

    const rotate = (timestamp: number) => {
      if (!start) start = timestamp;
      const elapsed = timestamp - start;

      const newRotation = (rotationAngle + (elapsed / 16.6667) * 3) % 360; // 3 degrees per frame (~60fps)
      setRotationAngle(newRotation);
      start = timestamp;

      if (isPlaying) {
        animationFrame = requestAnimationFrame(rotate);
      }
    };

    if (isPlaying && currentSongId === songId) {
      animationFrame = requestAnimationFrame(rotate);
    }

    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, [isPlaying, rotationAngle, currentSongId, songId]);

  // Stop spinning when the current song is not this record
  useEffect(() => {
    if (currentSongId !== songId) {
      setIsPlaying(false);
    }
  }, [currentSongId]);

  // Listen for the global audioPause and audioPlay events
  useEffect(() => {
    const handleGlobalPause = () => {
      if (currentSongId === songId) {
        setIsPlaying(false);
      }
    };

    const handleGlobalPlay = () => {
      if (currentSongId === songId) {
        setIsPlaying(true);
      }
    };

    window.addEventListener("audioPause", handleGlobalPause);
    window.addEventListener("audioPlay", handleGlobalPlay);

    return () => {
      window.removeEventListener("audioPause", handleGlobalPause);
      window.removeEventListener("audioPlay", handleGlobalPlay);
    };
  }, [currentSongId, songId]);

  return (
    <div>
      <div
        style={{ backgroundColor: `${props.color}` }}
        className="revolutionary-box"
      >
        {isPlaying && songId === currentSongId ? (
          <div className="pioneering-pause-icon"></div>
        ) : (
          <div className="adventurous-play-icon"></div>
        )}

        <div className="rebellious-photo-frame">
          <a>
            <img
              style={{
                transform: `rotate(${rotationAngle}deg) scale(${zoomAmount})`,
              }} // Apply rotation dynamically
              src={`${props.src}`}
              onClick={handleRecordClick}
              className="daring-photo"
            />
          </a>
        </div>
        <div
          className="maverick-caption"
          ref={containerRef}
          style={{ fontSize }}
        >
          <Link className="Armenian" href={`collection-detail/${props.id}`}>
            {props.title_armenian}
            <br />
          </Link>
          <Link className="English" href={`collection-detail/${props.id}`}>
            {props.title}
          </Link>
        </div>
      </div>
    </div>
  );
}

export default RecordCollectionRow;
