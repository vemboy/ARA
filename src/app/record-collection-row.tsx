// record-collection-row.tsx

"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";

interface ZoomData {
  id: string;
  Value: number;
}

function RecordCollectionRow(props: any) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [rotationAngle, setRotationAngle] = useState(0);
  const songId = props.songId;
  const currentSongId = props.currentSongId;

  const [zoomAmount, setZoomAmount] = useState<number>(1.0);

  useEffect(() => {
    async function fetchZoomAmount() {
      try {
        const response = await axios.get("https://ara.directus.app/items/website_variables");
        const zoomData: ZoomData | undefined = response?.data?.data?.find(
          (item: ZoomData) => item.id === "RecordZoomAmount"
        );
        if (zoomData && zoomData.Value) {
          setZoomAmount(zoomData.Value);
        }
      } catch (error) {
        console.error("Error fetching RecordZoomAmount:", error);
      }
    }

    fetchZoomAmount();
  }, []);

  const handleRecordClick = () => {
    if (isPlaying && currentSongId === songId) {
      if (props.audioPlayerRef.current) {
        props.audioPlayerRef.current.audio.current.pause();
      }
      setIsPlaying(false);
    } else if (!isPlaying && currentSongId === songId) {
      if (props.audioPlayerRef.current) {
        props.audioPlayerRef.current.audio.current.play();
      }
      setIsPlaying(true);
    } else {
      // When starting a new song, also set the album art:
      props.setCurrentSong(`https://ara.directus.app/assets/${props.songId}`);
      props.setCurrentSongId(songId);
      props.setCurrentName(props.title);
      props.setCurrentArtistName(props.author);
      props.setAlbumArt(props.src); // Set the album art here.
      props.setSongId(props.id);
      setIsPlaying(true);
      setTimeout(() => {
        if (props.audioPlayerRef.current) {
          props.audioPlayerRef.current.audio.current.play();
        }
      }, 0);
    }
  };

  useEffect(() => {
    let animationFrame: number;
    let start: number | null = null;

    const rotate = (timestamp: number) => {
      if (!start) start = timestamp;
      const elapsed = timestamp - start;

      const newRotation = (rotationAngle + (elapsed / 16.6667) * 3) % 360;
      setRotationAngle(newRotation);
      start = timestamp;

      if (isPlaying && currentSongId === songId) {
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

  useEffect(() => {
    if (currentSongId !== songId) {
      setIsPlaying(false);
    }
  }, [currentSongId, songId]);

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

  const finalTransform = `translate(-50%, -50%) scale(${2.5 * zoomAmount}) rotate(${rotationAngle}deg)`;

  return (
    <div className="ara-grid-item">
      <div className="ara-grid-icons">
        {/* No icons for now */}
      </div>
      <div className="ara-grid-item-circle" onClick={handleRecordClick}>
        <img
          src={props.src}
          alt="Record Image"
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: finalTransform
          }}
        />
        <div className="ara-grid-item-circle-overlay">►</div>
      </div>
      <div className="ara-grid-item-title">
        <div className="ara-grid_item_title_armenian">
          <Link href={`/collection-detail/${props.id}`}>
            {props.title_armenian}
          </Link>
        </div>
        <div className="ara-grid_item_title_transliteration">
          <Link href={`/collection-detail/${props.id}`}>
            {props.title}
          </Link>
        </div>
      </div>
    </div>
  );
}

export default RecordCollectionRow;
