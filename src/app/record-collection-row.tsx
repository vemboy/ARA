// record-collection-row.tsx (full example)
"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

import {
  getDefaultImageThumbnailUrl,
  getImageThumbnailUrl,
  getImageDetailUrl,
  getPlaceholderRecordImageUrl
} from "@/utils/assetUtils";

// Import your new component
import SampleRecordImage from "./SampleRecordImage";

function RecordCollectionRow(props: any) {
  const [isPlaying, setIsPlaying] = useState(false);

  const songId = props.songId;
  const currentSongId = props.currentSongId;
  const imageUrl = props.imageUrl;

  // Play/pause logic
  const handleRecordClick = () => {
    if (isPlaying && currentSongId === songId) {
      props.audioPlayerRef.current?.audio.current.pause();
      setIsPlaying(false);
    } else if (!isPlaying && currentSongId === songId) {
      props.audioPlayerRef.current?.audio.current.play();
      setIsPlaying(true);
    } else {
      // new record => set the new song and play
      props.setCurrentSong(`https://ara.directus.app/assets/${songId}`);
      props.setCurrentSongId(songId);
      props.setCurrentName(props.title);
      props.setCurrentArtistName(props.author);
props.setAlbumArt(
  imageUrl
    ? getImageThumbnailUrl(imageUrl)
    : getPlaceholderRecordImageUrl() // New function specific for record placeholders
);
      props.setSongId(props.id);

      setIsPlaying(true);
      setTimeout(() => {
        props.audioPlayerRef.current?.audio.current.play();
      }, 0);
    }
  };

  // Stop spinning if user switches to a different record
  useEffect(() => {
    if (currentSongId !== songId) {
      setIsPlaying(false);
    }
  }, [currentSongId, songId]);

  // Listen for global audioPause / audioPlay
  useEffect(() => {
    const handleGlobalPause = () => {
      if (currentSongId === songId) setIsPlaying(false);
    };
    const handleGlobalPlay = () => {
      if (currentSongId === songId) setIsPlaying(true);
    };
    window.addEventListener("audioPause", handleGlobalPause);
    window.addEventListener("audioPlay", handleGlobalPlay);

    return () => {
      window.removeEventListener("audioPause", handleGlobalPause);
      window.removeEventListener("audioPlay", handleGlobalPlay);
    };
  }, [currentSongId, songId]);

  // The container that applies scaling (if needed)
  const containerStyle = {
    position: "absolute" as const,
    top: "50%",
    left: "50%",
    transform: `translate(-50%, -50%) scale(${2 * props.zoomAmount})`,
    transformOrigin: "50% 50%",
    width: "100%",
    height: "100%",
    overflow: "visible", // Make sure it's not clipping
    
  };

  return (
    <div className="ara-grid-item">
      <div className="ara-grid-icons">{/* optional icons */}</div>

      <div className="ara-grid-item-circle" onClick={handleRecordClick}>
        <div className="record-image-container" style={containerStyle}>
{imageUrl ? (
  <Image
    loading="lazy"
    src={getImageDetailUrl(imageUrl)}
    alt="Record Image"
    width={500}
    height={500}
    quality={100}
    blurDataURL={getImageThumbnailUrl(imageUrl)}
    className={`record-image ${
      isPlaying && currentSongId === songId ? "playing" : ""
    }`}
  />
) : (
  // <SampleRecordImage> has the nested circles but doesn't spin
  <SampleRecordImage isPlaying={false} />
)}
        </div>
        <div className="ara-grid-item-circle-overlay">
          {isPlaying && currentSongId === songId ? '❚❚' : '►'}
        </div>
      </div>

      <div className="ara-grid-item-title">
        <div className="ara-grid_item_title_armenian">
          <Link href={`/record-details/${props.araId}`}>
            {props.title_armenian}
          </Link>
        </div>
        <div className="ara-grid_item_title_transliteration">
          <Link href={`/record-details/${props.araId}`}>{props.title}</Link>
        </div>
      </div>
    </div>
  );
}

export default RecordCollectionRow;
