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
  const setSong = React.useContext(AudioContext)?.setSong;
  const audioPlayerRef = React.useContext(AudioContext)?.audioPlayerRef;
  console.log("PAGE:", audioPlayerRef);

<<<<<<< HEAD

const countries = [
  'Argentina', 'Armenia', 'Brazil', 'Canada', 'Denmark', 'England UK',
  'France', 'Germany', 'Holland', 'Italy', 'Jordan', 'Lebanon', 'Qatar',
  'Russia', 'United States', 'USSR', 'Uruguay', 'Venezuela'
];

const FilterComponent = () => {
  const [artist, setArtist] = useState('');
  const [genre, setGenre] = useState('');
  const [country, setCountry] = useState('');
  const [year, setYear] = useState('');
  const [instrument, setInstrument] = useState('');
}


=======
  const updateSearchString = (e: any) => {
    console.log("Searching...:", e.target.value);
    setSearchString(e.target.value);
  };

  function getUrlWithFilters() {
    const filterObj = {
      _or: [
        { title: { _icontains: searchString } },
        { title_armenian: { _icontains: searchString } },
        { artist_armenian: { _icontains: searchString } },
        { artist_original: { _icontains: searchString } },
      ],
    };
    const stringifiedFilterObj = JSON.stringify(filterObj);
    console.log("stringifiedFilter", stringifiedFilterObj);
    return searchString.length === 0
      ? "https://ara.directus.app/items/record_archive?limit=12"
      : `https://ara.directus.app/items/record_archive?limit=12&filter=${stringifiedFilterObj}`;
  }
>>>>>>> 63e8281127b213e4fc49faf2d08dd17c766f390b

  const nextPage = () => {
    setPage(currentPage + 1);
    const url = getUrlWithFilters();
    axios.get(`${url}&page=${currentPage}`).then((response) => {
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
    const url = getUrlWithFilters();
    axios.get(`${url}&page=${currentPage}`).then((response) => {
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

  const [currentPage, setPage] = useState(2);
  const [records, setRecords] = useState<any[]>([]);
  const [searchString, setSearchString] = useState<string>("");

  useEffect(() => {
    const url = getUrlWithFilters();
    axios.get(url).then((response) => {
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
  }, [searchString]);

  return (
    <>
      <div className="frame-1 screen">
        <div className="overlap-group3">
          <div className="rectangle-137"></div>
          <div className="group-79">
            <div className="overlap-group2">
              <div className="ellipse-1"></div>
            </div>
            <div className="group-81"></div>
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
                    <Link href="">CONTRIBUTE</Link>
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
                    <Link href="javascript:scrollTo(AboutUs);">ՄԵՐ ՄԱՍԻՆ</Link>
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

      {/* <div className="line"></div> */}

      <div className="container-center-horizontal">
        <div className="collection screen">
          
          {/* <div className="divider">
            <div className="divider_1">
          <h1 className="hello valign-text-middle">
            Collection <br></br> ՀԱԲԱԿԱԾՈՒ
          </h1>
<<<<<<< HEAD
          </div>
          <div  className="divider_2">
=======
          <div>
            <form>
              <input
                onChange={updateSearchString}
                className="search_bar"
                name="query"
              />
            </form>
>>>>>>> 63e8281127b213e4fc49faf2d08dd17c766f390b

            </div>
            </div> */}
    <div className="divider3">
                <form className="search-form">
      <input
        className="search_bar"
        name="query"
        placeholder="Search..."
      />
      <span className="search-icon">🔍</span>
    </form>
    </div>



            {/* <div className="group-34">
              <div className="flex-container-1171 flex-container adellesansarm-extra-extra-bold-midnight-45px">
                <div className="text-1 valign-text-middle text-4">
                  <span>
                    <span className="adellesansarm-extra-extra-bold-midnight-45px">
                      Filters / Ֆիլտերներ
                    </span>{" "}
                  </span>
                </div>
              </div>
            </div> */}
            {/* <div className="group-35 adellesansarm-extra-extra-bold-midnight-34px">
              <div className="artist valign-text-middle">Artist +</div>
              <div className="genre valign-text-middle">Genre +</div>
              <div className="country valign-text-middle">Country –</div>
              <div className="year valign-text-middle">Year +</div>
              <div className="instruments valign-text-middle">
                Instruments +
              </div>
            </div> */}
            {/* <div className="rectangle-54"></div> */}
            {/* <div className="group-container">
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
            </div> */}
        <div className="record_divider">
          <div className="record_divider_1">
          <RecordListView
            setCurrentSong={setSong}
            audioPlayerRef={audioPlayerRef}
            records={records}
          ></RecordListView>
        </div>
        </div>
      </div>
      <div className="record_divider_2">
        <div>
      <div className="brutalist-container">
        <form className="brutalist-form">
          <div className="brutalist-filter-group">
            <label className="brutalist-label">Artist / Ֆիլտերներ</label>
            <input type="text" name="artist" className="brutalist-input" />
          </div>
          <div className="brutalist-filter-group">
            <label className="brutalist-label">Country –</label>
            <input type="text" name="country" className="brutalist-input" />
          </div>
          <div className="brutalist-filter-group">
            <label className="brutalist-label">Year +</label>
            <input type="text" name="year" className="brutalist-input" />
          </div>
          <div className="brutalist-filter-group">
            <label className="brutalist-label">Genre +</label>
            <div className="brutalist-button-group">
              {['Pop', 'Rock', 'Jazz', 'Classical', 'Hip-Hop', 'Electronic'].map(genre => (
                <button type="button" className="brutalist-button" key={genre}>
                  {genre}
                </button>
              ))}
            </div>
          </div>
          <div className="brutalist-filter-group">
            <label className="brutalist-label">Instruments +</label>
            <div className="brutalist-button-group">
              {['Guitar', 'Piano', 'Drums', 'Violin', 'Bass', 'Saxophone'].map(instrument => (
                <button type="button" className="brutalist-button" key={instrument}>
                  {instrument}
                </button>
              ))}
            </div>
          </div>
          <div className="brutalist-footer">
            <button type="submit" className="brutalist-submit-btn">Apply Filters</button>
          </div>
        </form>
      </div>
      <div className="brutalist-nav-buttons">
        <button type="button" className="brutalist-nav-btn" onClick={previousPage}>Previous</button>
        <button type="button" className="brutalist-nav-btn" onClick={nextPage}>Next</button>
      </div>
    </div>



      </div>
      </div>
    </>
  );
}
