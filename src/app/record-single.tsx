"use client";

import React, { useState, useEffect } from "react";
import {
  getDefaultImageThumbnailUrl,
  getImageThumbnailUrl,
} from "@/utils/assetUtils"; // Adjust the import path as needed
import useResponsiveFontSize from "./useResponsiveFontSize"; // Adjust the import path as needed
import styles from "./SingleRecordView.module.css"; // Import the CSS module
import Link from "next/link";

type Record = {
  songId: string;
  author: string;
  title: string;
  image: string;
  id: string;
  genre: string;
  year: string;
  title_armenian: string;
  color: string;
  display_title: string;
};

function SingleRecordView(props: {
  records: Record[];
  setCurrentSong: any;
  audioPlayerRef: any;
  setSelectedRecord: (record: Record) => void;
}) {
  const [currentSongId, setCurrentSongId] = useState<string | null>(null);
  const [record, setRecord] = useState<Record | null>(null);

  const { fontSize, containerRef } = useResponsiveFontSize(
    record ? record.display_title : ""
  );

  useEffect(() => {
    if (props.records.length > 0 && !record) {
      const randomIndex = Math.floor(Math.random() * props.records.length);
      const selectedRecord = props.records[randomIndex];
      setRecord(selectedRecord);
      props.setSelectedRecord(selectedRecord); // Set the selected record in the parent component
    }
  }, [props.records, record, props]);

  if (!record) {
    return <div>Loading...</div>; // Add loading state if needed
  }

  const imageSrc = record.image
    ? getImageThumbnailUrl(record.image)
    : getDefaultImageThumbnailUrl();

  return (
    <div className="single-record-view">
      <div
        className={styles["revolutionary-box"]}
        style={{ backgroundColor: record.color }}
      >
        <div className={styles["daring-header"]}>ARA</div>

        {/* Display play button if not playing and pause button if playing */}
        {currentSongId === record.songId ? (
          <div className={styles["pioneering-pause-icon"]}></div>
        ) : (
          <div className={styles["adventurous-play-icon"]}></div>
        )}

        <div className={styles["rebellious-photo-frame"]}>
          <a>
            <img
              style={{ mixBlendMode: "multiply" }}
              src={imageSrc}
              onClick={() => {
                if (currentSongId === record.songId) {
                  props.audioPlayerRef.current.audio.current.pause();
                  setCurrentSongId(null);
                } else {
                  props.setCurrentSong(
                    `https://ara.directus.app/assets/${record.songId}`
                  );
                  setCurrentSongId(record.songId);
                }
              }}
              className={
                currentSongId === record.songId
                  ? styles["daring-photo-rotating"]
                  : styles["daring-photo"]
              }
            />
          </a>
        </div>
        <div
          className={styles["maverick-caption"]}
          ref={containerRef}
          style={{ fontSize }}
        >
<Link href={`record-details/${record.id}`}>
  {record.display_title}
</Link>
        </div>
      </div>
    </div>
  );
}

export default SingleRecordView;
