// record-list-view.tsx

import React, { useState } from "react";
import RecordCollectionRow from "./record-collection-row";
import { getDefaultImageThumbnailUrl, getImageThumbnailUrl } from "@/utils/assetUtils";

function RecordListView(props: any) {
  const [currentSongId, setCurrentSongId] = useState<string | null>(null);

  return (
    <div id="ara-grid-wrapper" className="ara-grid-wrapper">
      {props.records.map((record: any) => (
        <RecordCollectionRow
          key={record.id}
          setCurrentSong={props.setCurrentSong}
          setCurrentName={props.setCurrentName}
          setCurrentArtistName={props.setCurrentArtistName}
          setSongId={props.setSongId}
          setAlbumArt={props.setAlbumArt} // Ensure we still pass this
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
    // ? `https://ara.directus.app/assets/${record.image}`
    // : getDefaultImageThumbnailUrl()
        ? getImageThumbnailUrl(record.image)
    : getDefaultImageThumbnailUrl()
          }
        />
      ))}
    </div>
  );
}

export default RecordListView;