"use client";

import Head from "next/head";
import React, { useState, useEffect } from "react";
import axios from "axios";
import RecordCollectionRow from "./record-collection-row";
import RecordCollectionRowDifferent from "./record-collection-row-different";
import RecordListView from "./record-list-view";
import PageNumbers from "./page-numbers";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import { AudioContext } from "../audioLayout";
import Link from "next/link";

export default function Collection() {
  const setSong = React.useContext(AudioContext);

  const nextPage = () => {
    setPage(currentPage + 1);
    axios
      .get(
        `https://ara.directus.app/items/record_archive?limit=12&page=${currentPage}`
      )
      .then((response) => {
        console.log("Hello");
        console.log(response);
        
        const records = response.data.data.map((record: any) => {
          return {
            songId: record.audio,
            author: record.artist_original,
            title: record.title,
            image: record.record_image,
            id: record.id,
            genre: record.genre,
            year: record.year,
            title_armenian: record.title_armenian,
            color: record.hex_color,
            display_title: record.display_title,

          };
        });

        setRecords(records);
        console.log(records);
      });
  };

  const previousPage = () => {
    console.log(currentPage);
    if (currentPage - 2 > 0) {
      setPage(currentPage - 1);
    } else {
      console.log("At start");
    }
    axios
      .get(
        `https://ara.directus.app/items/record_archive?limit=12&page=${currentPage}`
      )
      .then((response) => {
        console.log("Hello");
        console.log(response);

        const records = response.data.data.map((record: any) => {
          return {
            songId: record.audio,
            author: record.artist_original,
            title: record.title,
            image: record.record_image,
            id: record.id,
            genre: record.genre,
            year: record.year,
            title_armenian: record.title_armenian,
            color: record.hex_color,
            display_title: record.display_title,
          };
        });

        setRecords(records);
        console.log(records);
      });
  };

  // const [currentSong, setSong] = useState("")
  const [currentPage, setPage] = useState(2);
  const [records, setRecords] = useState<any[]>([]);

  useEffect(() => {
    axios
      .get("https://ara.directus.app/items/record_archive?limit=12")
      .then((response) => {
        console.log("Hello");
        console.log(response.data.data);
        const amountOfPages = response.data.data.length;

        const records = response.data.data.map((record: any) => {
          return {
            songId: record.audio,
            author: record.artist_original,
            title: record.title,
            image: record.record_image,
            id: record.id,
            genre: record.genre,
            year: record.year,
            title_armenian: record.title_armenian,
            color: record.hex_color,
            display_title: record.display_title,

          };
        });

        setRecords(records);
        console.log(records);
      });
  }, []);

  return (
    <>
      {/* <AudioPlayer src={currentSong} className="audio-player"></AudioPlayer> */}

   <div className="frame-1 screen">
          <div className="overlap-group3">
            <div className="rectangle-137"></div>
            <div className="group-79">
              <div className="overlap-group2">
                <div className="ellipse-1"></div>
              </div>
              <div className="group-81">
                

              </div>
            </div>
            <div className="group-80 adellesansarm-extra-extra-bold-white-16-3px">
              <div className="flex-container-58 flex-container">
                <div className="text-1 valign-text-middle">
                  <span>
                    <span className="adellesansarm-extra-extra-bold-white-16-3px">
                      <Link href="/">HOMEPAGE</Link>
                    </span>{" "}
                  </span>
                </div>
                <div className="text-1 valign-text-middle">
                  <span>
                    <span className="adellesansarm-extra-extra-bold-white-16-3px">
                      <Link href="/">ՏՆԷՋ</Link>
                    </span>{" "}
                  </span>
                </div>
              </div>
              <div className="flex-container-59 flex-container">
                <div className="text-1 valign-text-middle">
                  <span>
                    <span className="adellesansarm-extra-extra-bold-white-16-3px">
                      <Link href="#">CONTRIBUTE</Link>
                    </span>{" "}
                  </span>
                </div>
                <div className="text-1 valign-text-middle">
                  <span>
                    <span className="adellesansarm-extra-extra-bold-white-16-3px">
                      <Link href="#">ԱՋԱԿՑԵԼ</Link>
                    </span>{" "}
                  </span>
                </div>
              </div>
              <div className="flex-container-57 flex-container">
                <div className="text-1 valign-text-middle">
                  <span>
                    <span className="adellesansarm-extra-extra-bold-white-16-3px">
                      <Link href="javascript:scrollTo(AboutUs);">ABOUT US</Link>
                    </span>{" "}
                  </span>
                </div>
                <div className="text-1 valign-text-middle">
                  <span>
                    <span className="adellesansarm-extra-extra-bold-white-16-3px">
                      <Link href="javascript:scrollTo(AboutUs);">
                        ՄԵՐ ՄԱՍԻՆ
                      </Link>
                    </span>{" "}
                  </span>
                </div>
              </div>
              <div className="flex-container-56 flex-container">
                <div className="text-1 valign-text-middle">
                  <span>
                    <span className="adellesansarm-extra-extra-bold-white-16-3px">
                      <Link href="javascript:scrollTo(Footer);">CONTACT</Link>
                    </span>{" "}
                  </span>
                </div>
                <div className="text-1 valign-text-middle">
                  <span>
                    <span className="adellesansarm-extra-extra-bold-white-16-3px">
                      <Link href="javascript:scrollTo(Footer);">ԿԱՊ</Link>
                    </span>{" "}
                  </span>
                </div>
              </div>
            </div>
            <h1 className="full-page-armenian valign-text-middle">
              Armenian Record Archive
            </h1>
          </div>
        </div>

<div className="line"></div>
      
      <div className="container-center-horizontal">
        <div className="collection screen">
          <h1 className="hello valign-text-middle">
            Collection <br></br> ՀԱԲԱԿԱԾՈՒ
          </h1>
          <div>
            <div className="overlap-group11">
              <div className="flex-container-1169 flex-container adellesansarm-extra-extra-bold-midnight-34px">
                <div className="text valign-text-middle text-4">
                  <span>
                    <span className="adellesansarm-extra-extra-bold-midnight-34px">
                      SEARCH
                    </span>{" "}
                  </span>
                </div>
                <div className="text valign-text-middle text-4">
                  <span>
                    <span className="adellesansarm-extra-extra-bold-midnight-34px">
                      ՊՆԴՐԻ
                    </span>{" "}
                  </span>
                </div>
              </div>
              <div className="rectangle-104"></div>
            </div>
            <div className="group-34">
              <div className="flex-container-1171 flex-container adellesansarm-extra-extra-bold-midnight-45px">
                <div className="text-1 valign-text-middle text-4">
                  <span>
                    <span className="adellesansarm-extra-extra-bold-midnight-45px">
                      Filters
                    </span>{" "}
                  </span>
                </div>
                <div className="text-1 valign-text-middle text-4">
                  <span>
                    <span className="adellesansarm-extra-extra-bold-midnight-45px">
                      Ֆիլտերներ
                    </span>{" "}
                  </span>
                </div>
              </div>
            </div>
            <div className="group-35 adellesansarm-extra-extra-bold-midnight-34px">
              <div className="artist valign-text-middle">Artist +</div>
              <div className="genre valign-text-middle">Genre +</div>
              <div className="country valign-text-middle">Country –</div>
              <div className="year valign-text-middle">Year +</div>
              <div className="instruments valign-text-middle">
                Instruments +
              </div>
            </div>
            <div className="rectangle-54"></div>
            <div className="group-container">
              <div className="group-47">
                <div className="ellipse-container">
                  <div className="ellipse-1"></div>
                  <div className="ellipse-1"></div>
                  <div className="ellipse-1"></div>
                  <div className="ellipse-15"></div>
                  <div className="ellipse-1"></div>
                  <div className="ellipse-1"></div>
                </div>
                <div className="flex-container-1 flex-container adellesansarm-light-midnight-45px">
                  <div className="text-2 text-4">
                    <span className="adellesansarm-light-midnight-45px">
                      Argentina
                    </span>
                  </div>
                  <div className="text-2 text-4">
                    <span className="adellesansarm-light-midnight-45px">
                      Armenia
                    </span>
                  </div>
                  <div className="text-2 text-4">
                    <span className="adellesansarm-light-midnight-45px">
                      Brazil
                    </span>
                  </div>
                  <div className="text-2 text-4">
                    <span className="adellesansarm-light-midnight-45px">
                      Canada
                    </span>
                  </div>
                  <div className="text-2 text-4">
                    <span className="adellesansarm-light-midnight-45px">
                      Denmark
                    </span>
                  </div>
                  <div className="text-2 text-4">
                    <span className="adellesansarm-light-midnight-45px">
                      England UK
                    </span>
                  </div>
                </div>
              </div>
              <div className="group-48">
                <div className="ellipse-container">
                  <div className="ellipse-1"></div>
                  <div className="ellipse-1"></div>
                  <div className="ellipse-1"></div>
                  <div className="ellipse-15"></div>
                  <div className="ellipse-1"></div>
                  <div className="ellipse-1"></div>
                </div>
                <div className="flex-container-1 flex-container adellesansarm-light-midnight-45px">
                  <div className="text-2 text-4">
                    <span className="adellesansarm-light-midnight-45px">
                      France
                    </span>
                  </div>
                  <div className="text-2 text-4">
                    <span className="adellesansarm-light-midnight-45px">
                      Germany
                    </span>
                  </div>
                  <div className="text-2 text-4">
                    <span className="adellesansarm-light-midnight-45px">
                      Holland
                    </span>
                  </div>
                  <div className="text-2 text-4">
                    <span className="adellesansarm-light-midnight-45px">
                      Italy
                    </span>
                  </div>
                  <div className="text-2 text-4">
                    <span className="adellesansarm-light-midnight-45px">
                      Jordan
                    </span>
                  </div>
                  <div className="text-2 text-4">
                    <span className="adellesansarm-light-midnight-45px">
                      Lebanon
                    </span>
                  </div>
                </div>
              </div>
              <div className="group-49">
                <div className="ellipse-container">
                  <div className="ellipse-1"></div>
                  <div className="ellipse-1"></div>
                  <div className="ellipse-1"></div>
                  <div className="ellipse-15"></div>
                  <div className="ellipse-1"></div>
                  <div className="ellipse-1"></div>
                </div>
                <div className="flex-container-1 flex-container adellesansarm-light-midnight-45px">
                  <div className="text-2 text-4">
                    <span className="adellesansarm-light-midnight-45px">
                      Qatar
                    </span>
                  </div>
                  <div className="text-2 text-4">
                    <span className="adellesansarm-light-midnight-45px">
                      Russia
                    </span>
                  </div>
                  <div className="text-2 text-4">
                    <span className="adellesansarm-light-midnight-45px">
                      United States
                    </span>
                  </div>
                  <div className="text-2 text-4">
                    <span className="adellesansarm-light-midnight-45px">
                      USSR
                    </span>
                  </div>
                  <div className="text-2 text-4">
                    <span className="adellesansarm-light-midnight-45px">
                      Uraguay
                    </span>
                  </div>
                  <div className="text-2 text-4">
                    <span className="adellesansarm-light-midnight-45px">
                      Venezuela
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <>
            {/* <div className="group-65 group" style={{display: "flex", alignItems: "flex-start", gap: "33px", height: "612px", justifyContent: "flex-start", flexDirection: "row", flexWrap: "wrap", minWidth: "1254px", top: "35px", position: "relative"}}> 
        {records.map(record => <RecordCollectionRow title_armenian={record['title_armenian'] ? record['title_armenian'] : 'No armenian yet'} id={record['id']} genre={record['genre'] ? record['genre'] : 'unknown genre'} year={record['year'] ? record['year'] : 'unknown year'} title={record['title']} author={(record['author'] ?? "Unkown author").substring(0, 20)} src={`https://ara.directus.app/assets/${record['image'] ? record['image'] : 'bfcf94c6-e40d-4fe1-8fbc-df54dc96ec48'}`}></RecordCollectionRow>)}
    </div> */}
          </>

          {/* <div className="group-65 group" style={{display: "flex", alignItems: "flex-start", gap: "33px", height: "612px", justifyContent: "flex-start", flexDirection: "row", flexWrap: "wrap", minWidth: "1254px", top: "35px", position: "relative"}}> 
<RecordCollectionRowDifferent></RecordCollectionRowDifferent>
</div> */}

          <RecordListView setCurrentSong={setSong} records={records}>
            {" "}
          </RecordListView>
        </div>
      </div>
      <button className="previous-button" onClick={previousPage}>
        {" "}
        Previous{" "}
      </button>
      {/* <PageNumbers amountOfPages={12}></PageNumbers> */}
      <button className="next-button" onClick={nextPage}>
        {" "}
        Next{" "}
      </button>


      
    </>

    
  );
}

