"use client";

import {
  getDefaultImageThumbnailUrl,
  getImageThumbnailUrl,
} from "@/utils/assetUtils";
import RecordCollectionRow from "./record-collection-row";
import RecordCollectionRowDifferent from "./record-collection-row-different";
import React, { useState, useEffect } from "react";

function RecordListView(props: any) {
  const [currentView, setView] = useState("gridview");
  const [currentSongId, setCurrentSongId] = useState<string | null>(null);

  return (
    <>
      {currentView == "gridview" ? (
        <>
          {" "}
          {/* <div className="overlap-group-container">
            <div onClick={() => setView("gridview")} className="flex-row flex">
              <div className="flex-col flex">
                <div className="rectangle-3"></div>
                <div className="rectangle-3-1"></div>
              </div>
              <div className="flex-col flex">
                <div className="rectangle-3"></div>
                <div className="rectangle-3-1"></div>
              </div>
            </div>
            <div
              onClick={() => setView("listview")}
              className="flex-row-1 flex-row-3"
            >
              <div className="flex-col-1 flex-col-7">
                <div className="rectangle-4"></div>
                <div className="rectangle-4"></div>
                <div className="rectangle-4"></div>
              </div>
              <div className="flex-col-2 flex-col-7">
                <div className="rectangle-4-1"></div>
                <div className="rectangle-4-1"></div>
                <div className="rectangle-4-1"></div>
              </div>
            </div>
          </div>{" "} */}
          <div
            className="group-65 group"
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "15px",
              height: "612px",
              justifyContent: "flex-start",
              flexDirection: "row",
              flexWrap: "wrap",
              minWidth: "1254px",
              top: "10vh",
              position: "absolute",
              marginLeft: "2.5vw",
              width: "50vw",
            }}
          >
            {props.records.map((record: { [x: string]: any }) => (
              <RecordCollectionRow
                setCurrentSong={props.setCurrentSong}
                audioPlayerRef={props.audioPlayerRef}
                currentSongId={currentSongId}
                setCurrentSongId={setCurrentSongId}
                songId={record["songId"]}
                title_armenian={
                  record["title_armenian"]
                    ? record["title_armenian"]
                    : "No armenian yet"
                }
                id={record["id"]}
                genre={record["genre"] ? record["genre"] : "unknown genre"}
                year={record["year"] ? record["year"] : "unknown year"}
                title={record["title"]}
                color={record["color"]}
                display_title={
                  record["display_title"]
                    ? record["display_title"]
                    : "No title yet"
                }
                author={(record["author"] ?? "Unkown author").substring(0, 20)}
                src={
                  record["image"]
                    ? getImageThumbnailUrl(record.image)
                    : getDefaultImageThumbnailUrl()
                }
              ></RecordCollectionRow>
            ))}
          </div>{" "}
        </>
      ) : (
        <>
          {" "}
          {/* <div className="overlap-group-container">
            <div onClick={() => setView("gridview")} className="flex-row flex">
              <div className="flex-col flex">
                <div
                  style={{ backgroundColor: "#091133", border: "1px #091133" }}
                  className="rectangle-3"
                ></div>
                <div
                  style={{ backgroundColor: "#091133", border: "1px #091133" }}
                  className="rectangle-3-1"
                ></div>
              </div>
              <br></br>
              <div className="flex-col flex">
                <div
                  style={{ backgroundColor: "#091133", border: "1px #091133" }}
                  className="rectangle-3"
                ></div>
                <div
                  style={{ backgroundColor: "#091133", border: "1px #091133" }}
                  className="rectangle-3-1"
                ></div>
              </div>
            </div>
            <div
              onClick={() => setView("listview")}
              className="flex-row-1 flex-row-3"
            >
              <div className="flex-col-1 flex-col-7">
                <div
                  style={{ backgroundColor: "#cd2032", border: "1px #cd2032" }}
                  className="rectangle-4"
                ></div>
                <div
                  style={{ backgroundColor: "#cd2032", border: "1px #cd2032" }}
                  className="rectangle-4"
                ></div>
                <div
                  style={{ backgroundColor: "#cd2032", border: "1px #cd2032" }}
                  className="rectangle-4"
                ></div>
              </div>
              <div className="flex-col-2 flex-col-7">
                <div
                  style={{ backgroundColor: "#cd2032", border: "1px #cd2032" }}
                  className="rectangle-4-1"
                ></div>
                <div
                  style={{ backgroundColor: "#cd2032", border: "1px #cd2032" }}
                  className="rectangle-4-1"
                ></div>
                <div
                  style={{ backgroundColor: "#cd2032", border: "1px #cd2032" }}
                  className="rectangle-4-1"
                ></div>
              </div>
            </div>
          </div> */}
          <div
            className="group-65 group"
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "33px",
              height: "612px",
              justifyContent: "flex-start",
              flexDirection: "row",
              flexWrap: "wrap",
              minWidth: "1254px",
              top: "35px",
              position: "relative",
            }}
          >
            {props.records.map((record: { [x: string]: any }) => (
              <RecordCollectionRowDifferent
                title_armenian={
                  record["title_armenian"]
                    ? record["title_armenian"]
                    : "No armenian yet"
                }
                id={record["id"]}
                genre={record["genre"] ? record["genre"] : "unknown genre"}
                year={record["year"] ? record["year"] : "unknown year"}
                title={record["title"]}
                color={record["color"]}
                display_title={record["display_title"]}
                author={(record["author"] ?? "Unkown author").substring(0, 20)}
                src={
                  record["image"]
                    ? getImageThumbnailUrl(record.image)
                    : getDefaultImageThumbnailUrl()
                }
              ></RecordCollectionRowDifferent>
            ))}
          </div>{" "}
        </>
      )}
    </>
  );
}

export default RecordListView;
