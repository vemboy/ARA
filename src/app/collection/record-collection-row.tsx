"use client";

import { useEffect, useState, useRef  } from "react";
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
  const [isToggled, setIsToggled] = useState(false);

  const { fontSize, containerRef } = useResponsiveFontSize(props.display_title);

  const [zoomAmount, setZoomAmount] = useState<number>(1.0);

  useEffect(() => {
    // Fetch the font size from Directus API
    async function fetchZoomAmount() {
      try {
        console.log("%c--- Fetching RecordZoomAmount ---", "border: 2px solid green; padding: 2px; color: green;");
        const response = await axios.get(`https://ara.directus.app/items/website_variables`);

        // Find the object with the id "RecordZoomAmount" and extract its value
        const zoomData: ZoomData | undefined = response?.data?.data?.find((item: ZoomData) => item.id === "RecordZoomAmount");

        console.log("%c--- Directus Response ---", "border: 2px solid blue; padding: 2px; color: blue;");
        console.log(response);

        if (zoomData && zoomData.Value) {
          console.log("%c--- Fetched RecordZoomAmount ---", "border: 2px solid red; padding: 2px; color: red;");
          console.log(zoomData.Value);

          setZoomAmount(zoomData.Value); // Update the zoom amount from Directus
        } else {
          console.warn("RecordZoomAmount not found in Directus response.");
        }
      } catch (error) {
        console.error("Error fetching RecordZoomAmount:", error);
      }
    }

    fetchZoomAmount();
  }, []); // Fetch the font size when component mounts or `props.id` changes

  

  return (
    <>
      <div>
        <div
          style={{ backgroundColor: `${props.color}` }}
          className="revolutionary-box"
        >
          {/* <div className="daring-header">ARA</div> */}

          {/* Display play button if not playing and pause button if playing */}
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
                onClick={() => {
                  if (isPlaying && currentSongId === songId) {
                    props.audioPlayerRef.current.audio.current.pause();
                    setIsToggled(false);
                    setIsPlaying(false);
                  } else if (!isPlaying && currentSongId === songId) {
                    props.audioPlayerRef.current.audio.current.play();
                    setIsToggled(true);
                    setIsPlaying(true);
                  } else {
                    props.setCurrentSong(
                      `https://ara.directus.app/assets/${props.songId}`
                    );
                    props.setCurrentSongId(songId);
                    setIsToggled(true);
                    setIsPlaying(true);
                  }
                }}
                className={isToggled ? 'daring-photo-rotating' : 'daring-photo'}
              />
            </a>
          </div>
          <div
            className="maverick-caption"
            ref={containerRef}
            style={{ fontSize }}
          >
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
    </>
  );
}

export default RecordCollectionRow;
