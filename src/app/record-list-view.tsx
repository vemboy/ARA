import React, { useState } from "react";
import RecordCollectionRow from "./record-collection-row";
import "react-grid-layout/css/styles.css";
import {
  getDefaultImageThumbnailUrl,
  getImageThumbnailUrl,
} from "@/utils/assetUtils";

function RecordListView(props: any) {
  const [currentSongId, setCurrentSongId] = useState<string | null>(null);

  return (
    <div
      style={{
        marginLeft: "280px",
        padding: "20px",
        height: "100vh",
        // overflow: "hidden",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
        columnGap: "25px", // Increase gap between items in the same row
        rowGap: "5px",    // Decrease gap between rows
      }}
    >
      {props.records.map((record: any) => (
        <div key={record.id}>
          <RecordCollectionRow
            setCurrentSong={props.setCurrentSong}
            setCurrentName={props.setCurrentName}
            setCurrentArtistName={props.setCurrentArtistName}
            setSongId={props.setSongId} // Add setSongId here
            audioPlayerRef={props.audioPlayerRef}
            currentSongId={currentSongId}
            setCurrentSongId={setCurrentSongId}
            songId={record.songId}
            title_armenian={record.title_armenian || "No armenian yet"}
            id={record.id}
            genre={record.genre || "unknown genre"}
            year={record.year || "unknown year"}
            title={record.title}
            color={record.color}
            display_title={record.display_title || "No title yet"}
            author={(record.author || "Unknown author").substring(0, 20)}
            src={
              record.image
                ? getImageThumbnailUrl(record.image)
                : getDefaultImageThumbnailUrl()
            }
          />
        </div>
      ))}
    </div>
  );
}

export default RecordListView;