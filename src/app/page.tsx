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
import { AudioContext } from "./audioLayout";
import Link from "next/link";
import SingleRecordView from "./record-single";
import _ from "lodash";
import FilterMenu from "./filter-menu";

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
    ? "brutalist-button-clicked"
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
  const audioContext = React.useContext(AudioContext);
  const setSong = audioContext?.setSong;
  const setName = audioContext?.setName;
  const setAristName = audioContext?.setArtistName;
  const setSongId = audioContext?.setSongId;
  const audioPlayerRef = audioContext?.audioPlayerRef;

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
  const [language, setLanguage] = useState("EN"); // New state for language

  const changeLanguage = (lang: string) => {
    setLanguage(lang);
  };

function getUrlWithFilters() {
  const filterObj: { _or?: object[]; _and?: object[] } = {
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
      filterObj._and?.push({ "year(year)": { _eq: searchYear } });
    }

    // Artist search
    if (searchArtist.length > 0) {
      filterObj._and?.push({
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
      if (filterName === "record_label") {
        // For record_label, we need to filter by the label ID
        const labelIds = labels
          .filter((label) => filtersSet.has(label.name))
          .map((label) => label.id);

        if (!filterObj._and) filterObj._and = [];
        filterObj._and.push({ record_label: { _in: labelIds } });
      } else {
        filterArray.forEach((filter) => {
          if (!filterObj._and) filterObj._and = [];
          filterObj._and.push({ [filterName]: { _contains: filter } });
        });
      }
    }
  });

    console.log("filterObj:", filterObj);

    const stringifiedFilterObj = JSON.stringify(filterObj);
    console.log("stringifiedFilter", stringifiedFilterObj);

    return `https://ara.directus.app/items/record_archive?limit=200&filter=${encodeURIComponent(
      stringifiedFilterObj
    )}`;
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
  const [regions, setRegions] = useState<string[]>([]);
  const [artists, setArtists] = useState<string[]>([]);
const [labels, setLabels] = useState<any[]>([]);
const [labelIdToNameMap, setLabelIdToNameMap] = useState<{ [key: string]: string }>({});
  const [isMenuExpanded, setMenuExpanded] = useState(false); // State to track menu expansion
  const [selectedFilters, setSelectedFilters] = useState<
    Record<string, string[]>
  >({});
  const [resultCounts, setResultCounts] = useState<{ [key: string]: number }>({});
  const [availableFilters, setAvailableFilters] = useState<{
  genres: Set<string>;
  instruments: Set<string>;
  regions: Set<string>;
  artists: Set<string>;
  record_label: Set<string>;
}>({
  genres: new Set(),
  instruments: new Set(),
  regions: new Set(),
  artists: new Set(),
  record_label: new Set(),
});


  const toggleMenu = () => {
    setMenuExpanded(!isMenuExpanded);
  };

useEffect(() => {
  console.log("RENDER");
  const url = getUrlWithFilters();

  // Initialize counts and filters
  const newResultCounts: { [key: string]: number } = {};
  const newAvailableFilters = {
    genres: new Set<string>(),
    instruments: new Set<string>(),
    regions: new Set<string>(),
    artists: new Set<string>(),
    record_label: new Set<string>(),
  };

  // Fetch instruments set
  axios
    .get("https://ara.directus.app/items/record_archive?groupBy[]=instruments")
    .then((response) => {
      const uniqueInstruments: Set<string> = new Set();
      _.forEach(response.data.data, (instrumentsArray: any) => {
        if (Array.isArray(instrumentsArray.instruments)) {
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

  // Fetch genres set
  axios
    .get("https://ara.directus.app/fields/record_archive/genres")
    .then((response) => {
      console.log("Response from /fields/record_archive/genres:", response.data);

      const fieldData = response.data.data;
      const interfaceOptions = fieldData.meta.options;
      let allGenres: string[] = [];

      if (Array.isArray(interfaceOptions.presets)) {
        allGenres = interfaceOptions.presets;
        console.log("Extracted genres from 'presets':", allGenres);
      } else {
        console.error("No genres found in 'presets' of interface options");
      }

      setGenres(allGenres);
    })
    .catch((error) => {
      console.error("Error fetching genres field options:", error);
      setGenres([
        "religious",
        "folk",
        "instrumental",
        "vocal",
        "dance",
        "patriotic",
        "national",
        "opera",
        "kef",
        "children",
        "lullaby",
        "choral",
        "symphony",
        "chamber",
        "prayer",
        "taqsim",
      ]);
    });

  // Fetch regions set
  axios
    .get("https://ara.directus.app/fields/record_archive/regions")
    .then((response) => {
      console.log("Response from /fields/record_archive/regions:", response.data);

      const fieldData = response.data.data;
      const interfaceOptions = fieldData.meta.options;
      let allRegions: string[] = [];

      if (Array.isArray(interfaceOptions.presets)) {
        allRegions = interfaceOptions.presets;
        console.log("Extracted regions from 'presets':", allRegions);
      } else {
        console.error("No regions found in 'presets' of interface options");
      }

      setRegions(allRegions);
    })
    .catch((error) => {
      console.error("Error fetching regions field options:", error);
      setRegions([
        "Europe",
        "North America",
        "South America",
        "Soviet Union",
        "Middle East",
      ]);
    });

  // Fetch artists set
  axios
    .get("https://ara.directus.app/items/record_archive?groupBy[]=artist_original")
    .then((response) => {
      const uniqueArtists: Set<string> = new Set();
      _.forEach(response.data.data, (artistObj: any) => {
        if (artistObj.artist_original) {
          uniqueArtists.add(artistObj.artist_original as string);
        }
      });
      setArtists(Array.from(uniqueArtists));
    })
    .catch((error) => {
      console.log("Error fetching artists:", error);
      setArtists([]);
    });

// Fetch labels set
axios
  .get("https://ara.directus.app/items/record_label?fields=id,name")
  .then((response) => {
    const labelsData = response.data.data;
    // Map label IDs to names
    const labelIdToNameMap: { [key: string]: string } = {};
    labelsData.forEach((label: any) => {
      labelIdToNameMap[label.id] = label.name;
    });
    // Store both IDs and names
    setLabels(labelsData); // labelsData contains objects with id and name
    setLabelIdToNameMap(labelIdToNameMap);
  })
  .catch((error) => {
    console.log("Error fetching labels:", error);
    setLabels([]);
    setLabelIdToNameMap({});
  });

  // Fetch records and process them
axios
    .get(`${url}`) // &fields=*,record_label.id,record_label.name
    .then((response) => {
      console.log(response.data.data);
      const data = response.data.data;

      data.forEach((record: any) => {
        // Process regions
        if (Array.isArray(record.regions)) {
          record.regions.forEach((region: string) => {
            newResultCounts[region] = (newResultCounts[region] || 0) + 1;
            newAvailableFilters.regions.add(region);
          });
        }

        // Process genres
        if (Array.isArray(record.genres)) {
          record.genres.forEach((genre: string) => {
            newResultCounts[genre] = (newResultCounts[genre] || 0) + 1;
            newAvailableFilters.genres.add(genre);
          });
        }

        // Process instruments
        if (Array.isArray(record.instruments)) {
          record.instruments.forEach((instrument: string) => {
            newResultCounts[instrument] = (newResultCounts[instrument] || 0) + 1;
            newAvailableFilters.instruments.add(instrument);
          });
        }

        // Process artists
        if (record.artist_original) {
          const artist = record.artist_original;
          newResultCounts[artist] = (newResultCounts[artist] || 0) + 1;
          newAvailableFilters.artists.add(artist);
        }

        // Process record labels
        if (record.record_label && record.record_label.name) {
          const labelName = record.record_label.name;
          newResultCounts[labelName] = (newResultCounts[labelName] || 0) + 1;
          newAvailableFilters.record_label.add(labelName);
        }
      });

      // Update counts and available filters
      setResultCounts(newResultCounts);
      setAvailableFilters(newAvailableFilters);

      // Map over the records as before, include record_label.name
      const records = data.map((record: any) => {
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
          record_label: record.record_label?.name || null, // Include label name
        };
      });

      setRecords(records);
      console.log(records);
    })
    .catch((error) => {
      console.log(error);
    });
}, [searchString, searchYear, filters, searchArtist]);


  return (
    <>
      <div className="page-container">
        <div className="side-bar">
          <div className="logo-section">
            <h1 className="logo-text">ARA</h1>
          </div>
          <div className="brutalist-container">
            <nav className="navigation-menu">
              <ul>
                <li>
                  <Link href="/">
                    {language === "EN" ? "Home" : "Գլխավոր"}
                  </Link>
                </li>
                <li>
                  <Link href="/about">
                    {language === "EN" ? "About Us" : "Մեր Մասին"}
                  </Link>
                </li>
                <li>
                  <Link href="/etc">
                    {language === "EN" ? "ETC" : "Այլ"}
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
          <div className="mini-footer">
            <div className="language-selector">
              <label className="footer-label">
                {language === "EN" ? "Language" : "Լեզու"}:
              </label>
              <div className="footer-language-toggle">
                <button
                  className={`brutalist-toggle-button ${
                    language === "EN" ? "selected" : ""
                  }`}
                  onClick={() => changeLanguage("EN")}
                >
                  EN
                </button>
                <button
                  className={`brutalist-toggle-button ${
                    language === "HY" ? "selected" : ""
                  }`}
                  onClick={() => changeLanguage("HY")}
                >
                  HY
                </button>
              </div>
            </div>
            <div className="subscribe-section">
              <label className="footer-label">
                {language === "EN"
                  ? "Subscribe for updates:"
                  : "Բաժանորդագրվել:"}
              </label>
              <input
                type="email"
                name="email"
                className="footer-input"
                placeholder={
                  language === "EN"
                    ? "Enter your email"
                    : "Մուտքագրեք ձեր էլ․ հասցեն"
                }
              />
              <button className="subscribe-button">
                {language === "EN" ? "Subscribe" : "Բաժանորդագրվել"}
              </button>
            </div>
            <div className="footer-copyright">
              <p>© 2024 ARA. All rights reserved. Fueled by Costco 🍗</p>
            </div>
          </div>
        </div>

<FilterMenu
  genres={genres}
  instruments={instruments}
  regions={regions}
  artists={artists}
  labels={labels}
  filters={filters}
  setFilter={setFilter}
  availableFilters={availableFilters}
  resultCounts={resultCounts}
  labelIdToNameMap={labelIdToNameMap}
/>

        <RecordListView
          setCurrentSong={setSong}
          setCurrentName={setName}
          setCurrentArtistName={setAristName}
          setSongId={setSongId}
          audioPlayerRef={audioPlayerRef}
          records={records}
        />
      </div>
    </>
  );
}