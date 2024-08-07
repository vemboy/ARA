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
import SingleRecordView from "./record-single";
import _ from "lodash";

interface FilterProp {
  buttonName: string;
  filterName: string;
  filters: { [key: string]: Set<string> };
  setFilter: React.Dispatch<
    React.SetStateAction<{
      [key: string]: Set<string>;
    }>
  >;
}

function FilterButton(filterProp: FilterProp) {
  const [selected, setSelected] = useState(false);

  const selectFilter = () => {
    const newFilters = structuredClone(filterProp.filters);
    newFilters[filterProp.filterName] ??= new Set();
    if (!selected) {
      newFilters[filterProp.filterName].add(filterProp.buttonName);
    } else {
      newFilters[filterProp.filterName].delete(filterProp.buttonName);
    }
    console.log("New Filters:", newFilters);

    setSelected(!selected);
    filterProp.setFilter(newFilters);
  };

  const buttonClass = selected
    ? "brutalist-button clicked"
    : "brutalist-button";

  return (
    <button
      type="button"
      className={buttonClass}
      key={filterProp.buttonName}
      onClick={selectFilter}
    >
      {filterProp.buttonName}
    </button>
  );
}

export default function Collection() {
  const setSong = React.useContext(AudioContext)?.setSong;
  const audioPlayerRef = React.useContext(AudioContext)?.audioPlayerRef;
  console.log("PAGE:", audioPlayerRef);
  
  const updateSearchString = (e: any) => {
    console.log("Searching...:", e.target.value);
    setSearchString(e.target.value);
  };

  const updateSearchYear = (e: any) => {
    console.log("Searching year...:", e.target.value);
    setSearchYear(e.target.value);
  };

  const updateSearchArtist = (e: any) => {
    console.log("Searching artist...:", e.target.value);
    setSearchArtist(e.target.value);
  };

  const [filters, setFilter] = useState<{ [key: string]: Set<string> }>({});

  function getUrlWithFilters() {
    const filterObj: { _or: object[]; _and: object[] } = {
      _or: [],
      _and: [],
    };

    // Text search
    if (searchString.length > 0) {
      filterObj._or = [
        { title: { _icontains: searchString } },
        { title_armenian: { _icontains: searchString } },
        { artist_armenian: { _icontains: searchString } },
        { artist_original: { _icontains: searchString } },
      ];
    }

    // Year search
    if (searchYear.length > 0) {
      filterObj._and.push({ "year(year)": { _eq: searchYear } });
    }

    // Artist search
    if (searchArtist.length > 0) {
      filterObj._and.push({
        _or: [
          { artist_english: { _icontains: searchArtist } },
          { artist_armenian: { _icontains: searchArtist } },
          { artist_original: { _icontains: searchArtist } },
        ],
      });
    }

    // Filters
    Object.entries(filters).forEach(([filterName, filtersSet]) => {
      const filterArray = Array.from(filtersSet);
      if (filterArray.length > 0) {
        filterArray.forEach((filter) => {
          filterObj._and.push({ [filterName]: { _contains: filter } });
        });
      }
    });

    console.log("filterObj:", filterObj);

    const stringifiedFilterObj = JSON.stringify(filterObj);
    console.log("stringifiedFilter", stringifiedFilterObj);

    return `https://ara.directus.app/items/record_archive?limit=12&filter=${stringifiedFilterObj}`;
  }

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
  const [searchYear, setSearchYear] = useState<string>("");
  const [searchArtist, setSearchArtist] = useState<string>("");
  const [selectedRecord, setSelectedRecord] = useState<any | null>(null);
  const [instruments, setInstruments] = useState<string[]>([]);
  const [genres, setGenres] = useState<string[]>([]);

  useEffect(() => {
    console.log("RENDER");
    const url = getUrlWithFilters();

    // Get instruments set
    axios
      .get(
        "https://ara.directus.app/items/record_archive?groupBy[]=instruments"
      )
      .then((response) => {
        const uniqueInstruments: Set<string> = new Set();
        _.forEach(response.data.data, (instrumentsArray: any) => {
          if (instrumentsArray.instruments) {
            _.forEach(instrumentsArray.instruments, (instrument: string) =>
              uniqueInstruments.add(instrument as string)
            );
          }
        });
        setInstruments(Array.from(uniqueInstruments));
      })
      .catch((error) => {
        console.log("Error fetching instruments:", error);
        setInstruments(
          Array.from([
            "guitar",
            "piano",
            "drums",
            "violin",
            "bass",
            "saxophone",
            "oud",
            "darabuka",
          ])
        );
      });

    // Get genres set
    axios
      .get("https://ara.directus.app/items/record_archive?groupBy[]=genres")
      .then((response) => {
        const uniqueGenres: Set<string> = new Set();
        _.forEach(response.data.data, (genresArray: any) => {
          if (genresArray.genres) {
            _.forEach(genresArray.genres, (genre: string) =>
              uniqueGenres.add(genre as string)
            );
          }
        });
        setGenres(Array.from(uniqueGenres));
      })
      .catch((error) => {
        console.log("Error fetching genres:", error);
        setGenres(
          Array.from([
            "pop",
            "rock",
            "jazz",
            "classical",
            "hip-hop",
            "electronic",
            "religious",
            "vocal",
          ])
        );
      });

    axios.get(url).then((response) => {
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
  }, [searchString, searchYear, filters, searchArtist]);

  return (
    <>


      {/* <div className="line"></div> */}

      <div className="container-center-horizontal">
        <div className="collection screen">
          {/* <div className="divider">
            <div className="divider_1">
          <h1 className="hello valign-text-middle">
            Collection <br></br> ՀԱԲԱԿԱԾՈՒ
          </h1>
          </div>
          <div  className="divider_2">

            </div>
            </div> */}
          <div>
            <form className="search-form">
              <input
                className="search_bar"
                name="query"
                placeholder="Search..."
                onChange={updateSearchString}
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
                  <input
                    type="text"
                    name="artist"
                    className="brutalist-input"
                    onChange={updateSearchArtist}
                  />
                </div>
                <div className="brutalist-filter-group">
                  <label className="brutalist-label">Country –</label>
                  <input
                    type="text"
                    name="country"
                    className="brutalist-input"
                  />
                </div>
                <div className="brutalist-filter-group">
                  <label className="brutalist-label">Year +</label>
                  <input
                    type="text"
                    name="year"
                    className="brutalist-input"
                    onChange={updateSearchYear}
                  />
                </div>
                <div className="brutalist-filter-group">
                  <label className="brutalist-label">Genre +</label>
                  <div className="brutalist-button-group">
                    {genres.map((genres) => (
                      <FilterButton
                        filterName={"genres"}
                        buttonName={genres}
                        filters={filters}
                        setFilter={setFilter}
                      ></FilterButton>
                    ))}
                  </div>
                </div>
                <div className="brutalist-filter-group">
                  <label className="brutalist-label">Instruments +</label>
                  <div className="brutalist-button-group">
                    {instruments.map((instruments) => (
                      <FilterButton
                        filterName={"instruments"}
                        buttonName={instruments}
                        filters={filters}
                        setFilter={setFilter}
                      ></FilterButton>
                    ))}
                  </div>
                </div>
                {/* <div className="brutalist-footer">
                  <button type="submit" className="brutalist-submit-btn">
                    Apply Filters
                  </button>
                </div> */}
              </form>
            </div>
            <div className="brutalist-nav-buttons">
              <button
                type="button"
                className="brutalist-nav-btn"
                onClick={previousPage}
              >
                Previous
              </button>
              <button
                type="button"
                className="brutalist-nav-btn"
                onClick={nextPage}
              >
                Next
              </button>
            </div>
          </div>
        </div>

      </div>

    <div className="two-sections">
      <div className="section section-left">
        <div className="inner-container">
          <div className="vinyl-info-container">
            <h1 className="vinyl-title">Vinyl Information</h1>
            <div className="vinyl-info">
              <div className="vinyl-info-item">
                <span className="vinyl-label">Artist:</span>
                <span className="vinyl-text">{selectedRecord?.author || "N/A"}</span>
              </div>
              <div className="vinyl-info-item">
                <span className="vinyl-label">Album:</span>
                <span className="vinyl-text">{selectedRecord?.title || "N/A"}</span>
              </div>
              <div className="vinyl-info-item">
                <span className="vinyl-label">Release Date:</span>
                <span className="vinyl-text">{selectedRecord?.year || "N/A"}</span>
              </div>
              <div className="vinyl-info-item">
                <span className="vinyl-label">Genre:</span>
                <span className="vinyl-text">{selectedRecord?.genre || "N/A"}</span>
              </div>
              <div className="vinyl-info-item">
                <span className="vinyl-label">Description:</span>
                <span className="vinyl-text">
                  Description of the album goes here. This can be a brief overview of the album, its significance, and any interesting facts.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="section section-right">
        <SingleRecordView
          setCurrentSong={setSong}
          audioPlayerRef={audioPlayerRef}
          records={records}
          setSelectedRecord={setSelectedRecord}
        ></SingleRecordView>
      </div>
    </div>

    </>
  );
}
