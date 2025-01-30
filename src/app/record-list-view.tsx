// record-list-view.tsx

import React, { useEffect, useState } from "react";
import RecordCollectionRow from "./record-collection-row";
import {
  getDefaultImageThumbnailUrl,
  getImageDetailUrl,
} from "@/utils/assetUtils";
import axios from "axios";

interface ZoomData {
  id: string;
  Value: number;
}

function RecordListView(props: any) {
  const [currentSongId, setCurrentSongId] = useState<string | null>(null);
  const [zoomAmount, setZoomAmount] = useState<number>(1.0);

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

  console.log("RECORDS:", props.records);
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
              ? // ? `https://ara.directus.app/assets/${record.image}`
                // : getDefaultImageThumbnailUrl()
                getImageDetailUrl(record.image)
              : getDefaultImageThumbnailUrl()
          }
          imageUrl={record.image}
          zoomAmount={zoomAmount}
          araId={record.araId}
        />
      ))}
    </div>
  );
}

export default RecordListView;
