"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import Image from "next/image";
import {
  getDefaultImageThumbnailUrl,
  getImageThumbnailUrl,
  getImageDetailUrl,
} from "@/utils/assetUtils";

interface ZoomData {
  id: string;
  Value: number;
}

function RecordCollectionRow(props: any) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [zoomAmount, setZoomAmount] = useState<number>(1.0);

  const songId = props.songId;
  const currentSongId = props.currentSongId;
  const imageUrl = props.imageUrl;

  // Fetch zoom value from the server
  useEffect(() => {
    async function fetchZoomAmount() {
      try {
        const response = await axios.get(
          "https://ara.directus.app/items/website_variables"
        );
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

  // Handle record click => play/pause audio
  const handleRecordClick = () => {
    if (isPlaying && currentSongId === songId) {
      // currently spinning/playing => pause
      props.audioPlayerRef.current?.audio.current.pause();
      setIsPlaying(false);
    } else if (!isPlaying && currentSongId === songId) {
      // currently paused => play
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
          : getDefaultImageThumbnailUrl()
      );
      props.setSongId(props.id);

      setIsPlaying(true);
      setTimeout(() => {
        props.audioPlayerRef.current?.audio.current.play();
      }, 0);
    }
  };

  // If the user switches to a different record, stop spinning this one
  useEffect(() => {
    if (currentSongId !== songId) {
      setIsPlaying(false);
    }
  }, [currentSongId, songId]);

  // Listen for global audioPause / audioPlay events
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

  // The parent .record-image-container will do the translate + scale
  const containerStyle = {
    position: "absolute" as const,
    top: "50%",
    left: "50%",
    transform: `translate(-50%, -50%) scale(${2 * zoomAmount})`,
    transformOrigin: "50% 50%",
    width: "100%",
    height: "100%",
  };

  return (
    <div className="ara-grid-item">
      <div className="ara-grid-icons">{/* No icons for now */}</div>

      <div className="ara-grid-item-circle" onClick={handleRecordClick}>
        {/* This DIV handles the scaling and positioning */}
        <div className="record-image-container" style={containerStyle}>
          <Image
            loading="lazy"
            src={
              imageUrl
                ? getImageDetailUrl(imageUrl)
                : getDefaultImageThumbnailUrl()
            }
            alt="Record Image"
            width={500}
            height={500}
            quality={100}
            blurDataURL={
              imageUrl
                ? getImageThumbnailUrl(imageUrl)
                : getDefaultImageThumbnailUrl()
            }
            className={`record-image ${
              isPlaying && currentSongId === songId ? "playing" : ""
            }`}
          />
        </div>
        <div className="ara-grid-item-circle-overlay">►</div>
      </div>

      <div className="ara-grid-item-title">
        <div className="ara-grid_item_title_armenian">
          <Link href={`/collection-detail/${props.id}`}>
            {props.title_armenian}
          </Link>
        </div>
        <div className="ara-grid_item_title_transliteration">
          <Link href={`/collection-detail/${props.id}`}>{props.title}</Link>
        </div>
      </div>
    </div>
  );
}

export default RecordCollectionRow;
