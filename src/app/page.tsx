// Collection.tsx

"use client";

import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Link from "next/link";
import _ from "lodash";
import { AudioContext } from "./audioLayout";
import FilterMenu from "./filter-menu";
import RecordListView from "./record-list-view";

export default function Collection() {
const audioContext = React.useContext(AudioContext);
const setSong = audioContext?.setSong;
const setName = audioContext?.setName;
const setArtistName = audioContext?.setArtistName;
const setSongId = audioContext?.setSongId;
const setAlbumArt = audioContext?.setAlbumArt;
const audioPlayerRef = audioContext?.audioPlayerRef;

  const [filters, setFilter] = useState<{ [key: string]: Set<string> }>({});
  const [language, setLanguage] = useState("EN");
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

  // Landing page and menu refs
  const landingRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuLinksWrapperRef = useRef<HTMLDivElement>(null);
  const menuIconRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLImageElement>(null);

  const [isMenuVisible, setIsMenuVisible] = useState(true);
  const [userToggledMenu, setUserToggledMenu] = useState(false);

  const changeLanguage = (lang: string) => {
    setLanguage(lang);
  };

  const getUrlWithFilters = (additionalFilter?: object) => {
    const filterObj: { _or?: object[]; _and?: object[] } = {
      _or: [],
      _and: [],
    };

    if (searchString.length > 0) {
      filterObj._or = [
        { title: { _icontains: searchString } },
        { title_armenian: { _icontains: searchString } },
        { artist_armenian: { _icontains: searchString } },
        { artist_original: { _icontains: searchString } },
      ];
    }

    if (searchYear.length > 0) {
      filterObj._and?.push({ "year(year)": { _eq: searchYear } });
    }

    if (searchArtist.length > 0) {
      filterObj._and?.push({
        _or: [
          { artist_english: { _icontains: searchArtist } },
          { artist_armenian: { _icontains: searchArtist } },
          { artist_original: { _icontains: searchArtist } },
        ],
      });
    }

    Object.entries(filters).forEach(([filterName, filtersSet]) => {
      const filterArray = Array.from(filtersSet);
      if (filterArray.length > 0) {
        if (filterName === "record_label") {
          const labelIds = labels
            .filter((label) => filtersSet.has(label.label_en))
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

    if (additionalFilter) {
      if (!filterObj._and) filterObj._and = [];
      filterObj._and.push(additionalFilter);
    }

    const stringifiedFilterObj = JSON.stringify(filterObj);
    return `https://ara.directus.app/items/record_archive?limit=-1&fields=*,record_label.*&filter=${encodeURIComponent(
      stringifiedFilterObj
    )}`;
  };

  // Fetch initial data
  useEffect(() => {
    // Fetch labels
    axios
      .get("https://ara.directus.app/items/record_labels?fields=id,label_en")
      .then((response) => {
        const labelsData = response.data.data;
        const labelIdMap: { [key: string]: string } = {};
        labelsData.forEach((label: any) => {
          labelIdMap[label.id] = label.label_en;
        });
        setLabels(labelsData);
        setLabelIdToNameMap(labelIdMap);
      })
      .catch((error) => {
        console.log("Error fetching labels:", error);
        setLabels([]);
        setLabelIdToNameMap({});
      });

    // Fetch genres
    axios
      .get("https://ara.directus.app/fields/record_archive/genres")
      .then((response) => {
        const fieldData = response.data.data;
        const interfaceOptions = fieldData.meta.options;
        let allGenres: string[] = [];

        if (Array.isArray(interfaceOptions.presets)) {
          allGenres = interfaceOptions.presets;
        }
        setGenres(allGenres);
      })
      .catch((error) => {
        console.error("Error fetching genres field options:", error);
        // fallback genres
        setGenres(["religious", "folk", "instrumental", "vocal", "dance", "patriotic", "national", "opera", "kef", "children", "lullaby", "choral", "symphony", "chamber", "prayer", "taqsim"]);
      });

    // Fetch regions
    axios
      .get("https://ara.directus.app/fields/record_archive/regions")
      .then((response) => {
        const fieldData = response.data.data;
        const interfaceOptions = fieldData.meta.options;
        let allRegions: string[] = [];

        if (Array.isArray(interfaceOptions.presets)) {
          allRegions = interfaceOptions.presets;
        }
        setRegions(allRegions);
      })
      .catch((error) => {
        console.error("Error fetching regions field options:", error);
        // fallback regions
        setRegions(["Europe", "North America", "South America", "Soviet Union", "Middle East"]);
      });

    // Fetch instruments
    axios
      .get("https://ara.directus.app/items/record_archive?limit=-1&fields=instruments")
      .then((response) => {
        const uniqueInstruments: Set<string> = new Set();
        response.data.data.forEach((item: any) => {
          if (Array.isArray(item.instruments)) {
            item.instruments.forEach((instrument: string) => {
              uniqueInstruments.add(instrument);
            });
          }
        });
        setInstruments(Array.from(uniqueInstruments));
      })
      .catch((error) => {
        console.log("Error fetching instruments:", error);
        setInstruments([]);
      });

    // Fetch artists
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
  }, []);

  // Fetch records and update available filters
  useEffect(() => {
    const url = getUrlWithFilters();
    axios.get(url).then((response) => {
      const data = response.data.data;
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
          record_label: record.record_label?.label_en || null,
        };
      });
      setRecords(records);

      // Calculate counts and available filters
      const newResultCounts: { [key: string]: number } = {};
      const newAvailableFilters = {
        genres: new Set<string>(),
        instruments: new Set<string>(),
        regions: new Set<string>(),
        artists: new Set<string>(),
        record_label: new Set<string>(),
      };

      data.forEach((record: any) => {
        // genres
        if (Array.isArray(record.genres)) {
          record.genres.forEach((genre: string) => {
            newResultCounts[genre] = (newResultCounts[genre] || 0) + 1;
            newAvailableFilters.genres.add(genre);
          });
        }

        // instruments
        if (Array.isArray(record.instruments)) {
          record.instruments.forEach((instrument: string) => {
            newResultCounts[instrument] = (newResultCounts[instrument] || 0) + 1;
            newAvailableFilters.instruments.add(instrument);
          });
        }

        // regions
        if (Array.isArray(record.regions)) {
          record.regions.forEach((region: string) => {
            newResultCounts[region] = (newResultCounts[region] || 0) + 1;
            newAvailableFilters.regions.add(region);
          });
        }

        // artists
        if (record.artist_original) {
          const artist = record.artist_original;
          newResultCounts[artist] = (newResultCounts[artist] || 0) + 1;
          newAvailableFilters.artists.add(artist);
        }

        // labels
        if (record.record_label) {
          const labelName = record.record_label;
          newResultCounts[labelName] = (newResultCounts[labelName] || 0) + 1;
          newAvailableFilters.record_label.add(labelName);
        }
      });

      setResultCounts(newResultCounts);
      setAvailableFilters(newAvailableFilters);
    });
  }, [searchString, searchYear, filters, searchArtist]);

  // Rotate logo on scroll (for landing page)
  useEffect(() => {
    const rotateLogoOnScroll = () => {
      if (!logoRef.current || !landingRef.current) return;
      const splashHeight = landingRef.current.offsetHeight;
      const scrollY = window.scrollY;
      const rotationAngle = (scrollY / splashHeight) * 360;
      logoRef.current.style.transform = `rotate(${rotationAngle}deg)`;
    };
    window.addEventListener("scroll", rotateLogoOnScroll);
    return () => {
      window.removeEventListener("scroll", rotateLogoOnScroll);
    };
  }, []);

  // Handle scrolling and menu animation
  useEffect(() => {
    const handleScroll = () => {
      if (userToggledMenu) return;

      if (!introRef.current || !menuRef.current || !menuLinksWrapperRef.current || !menuIconRef.current) return;

      const introWrapper = introRef.current;
      const menu = menuRef.current;
      const menuLinks = menuLinksWrapperRef.current;
      const menuIcon = menuIconRef.current;

      const introRect = introWrapper.getBoundingClientRect();
      const menuRect = menu.getBoundingClientRect();
      const introMiddle = (introRect.top + introRect.bottom) / 2;
      const menuBottom = menuRect.bottom;

      if (introMiddle <= menuBottom) {
        // Hide menu links
        if (isMenuVisible) {
          menuLinks.classList.remove('expanded');
          menuIcon.classList.remove('clicked');
          setIsMenuVisible(false);
        }
      } else {
        // Show menu links
        if (!isMenuVisible) {
          menuLinks.classList.add('expanded');
          menuIcon.classList.add('clicked');
          setIsMenuVisible(true);
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [userToggledMenu, isMenuVisible]);

  const toggleMenu = () => {
    setUserToggledMenu(true);
    if (!menuLinksWrapperRef.current || !menuIconRef.current) return;
    const menuLinks = menuLinksWrapperRef.current;
    const menuIcon = menuIconRef.current;
    if (isMenuVisible) {
      menuLinks.classList.remove("expanded");
      menuIcon.classList.remove("clicked");
    } else {
      menuLinks.classList.add("expanded");
      menuIcon.classList.add("clicked");
    }
    setIsMenuVisible(!isMenuVisible);
    setTimeout(() => {
      setUserToggledMenu(false);
    }, 300);
  };

  return (
    <>
      {/* Landing Page */}
      <div className="ara-landing-page" id="ara-landing-page" ref={landingRef}>
        <img
          src="/ara_logo_test_2.png"
          alt="ARA logo"
          id="logo"
          ref={logoRef}
          onClick={() => {
            const main = document.getElementById('ara-main');
            if (main) {
              window.scrollTo({ top: main.offsetTop - 20, behavior: 'smooth' });
            }
          }}
        />
      </div>

      {/* Main Container */}
      <div className="ara-main" id="ara-main">
        {/* MENU */}
        <div className="ara-menu" id="ara-menu" ref={menuRef}>
          <div className="ara-menu-title" id="ara-menu-title">ARMENIAN RECORD ARCHIVE</div>
          <div className="ara-menu-links-wrapper expanded" id="ara-menu-links-wrapper" ref={menuLinksWrapperRef}>
            <Link href="#collection">COLLECTION <br/> ՀԱՎԱՔԱՑՈՒ</Link> ●
            <Link href="#about">ABOUT US <br/> ՄԵՐ ՄԱՍԻՆ</Link>
          </div>
          <div className="ara-menu-toggle" id="ara-menu-toggle" onClick={toggleMenu}>
            <div className="ara-menu-icon" id="menu-icon" ref={menuIconRef}>
              <div className="ara-menu-icon-sleeve"></div>
              <div className="ara-menu-icon-record"></div>
            </div>
          </div>
        </div>

        {/* INTRO */}
        <div className="ara-intro" ref={introRef}>
          <div className="ara-intro-text-english">
            <div>֎ Welcome to the Armenian Record Archive, where we preserve and celebrate the rich history of Armenian music and culture.</div>
          </div>
          <div className="ara-intro-text-armenian">
            <div>Բարի գալուստ Հայկական ձայնագրությունների արխիվ, որտեղ մենք պահպանում և տոնում ենք Հայկական երաժշտության և մշակույթի հարուստ պատմությունը: ֍</div>
          </div>
        </div>

        {/* COLLECTION */}
        <div className="ara-collection-wrapper" id="collection">
          {/* Search Bar */}
          <div className="ara-search-bar">
            <span className="search-icon">⌕</span>
            <input
              type="text"
              className="search-input"
              placeholder="Search • Փնտռէ"
              value={searchString}
              onChange={(e) => setSearchString(e.target.value)}
            />
          </div>

          {/* Filters Section */}
          <div className="ara-filters-section">
            <div className="ara-filters-header">
              <div className="ara-filters-title">Filters ▼</div>
              <div className="ara-filters-language-switcher">
                <span 
                  onClick={() => changeLanguage("EN")} 
                  className={language === "EN" ? "language-selected" : ""}
                  style={{cursor:'pointer'}}
                >
                  ENG
                </span> 
                | 
                <span 
                  onClick={() => changeLanguage("HY")} 
                  className={language === "HY" ? "language-selected" : ""}
                  style={{cursor:'pointer'}}
                >
                  ՀԱՅ
                </span>
              </div>
            </div>

            <div className="ara-filter-menu-wrapper">
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
                language={language}  // pass language down
              />
            </div>
          </div>

          {/* Records Grid */}
          <RecordListView
            setCurrentSong={setSong}
            setCurrentName={setName}
            setCurrentArtistName={setArtistName}
            setSongId={setSongId}
            setAlbumArt={setAlbumArt} // pass this down
            audioPlayerRef={audioPlayerRef}
            records={records}
          />
        </div>
      </div>

      {/* Static Player at the bottom */}
      <div className="ara-record-player-wrapper">
        <div className="ara-record-player-info">
          <div className="ara-record-player-image">
            <img src="/ARA_armenaphone_05.jpg" alt="Image" className="ara-record-player-thumbnail-img" />
          </div>
          <div className="ara-record-player-song-info">
            <div className="ara-record-player-song-title">Kroung</div>
            <div className="ara-record-player-artist-name">Shara Talian</div>
          </div>
        </div>
        <div className="ara-record-player-audio-section">
          <div className="ara-record-player-progress-bar"></div>
          <div className="ara-record-player-time">00:00 | 03:47</div>
        </div>
      </div>

      <footer>
        {/* Footer content as needed */}
      </footer>
    </>
  );
}
