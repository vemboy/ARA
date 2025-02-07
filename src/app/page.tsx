// page.tsx
"use client";

import { useSearchParams } from "next/navigation";
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Link from "next/link";
import _ from "lodash";
import Fuse from "fuse.js";
import { AudioContext } from "./audioLayout";

// Import your new filter menu
import FilterMenu from "./filter-menu";

// Import your RecordListView
import RecordListView from "./record-list-view";

// Interface for artists
interface ArtistType {
  id: string;
  artist_name: string;
  artist_name_armenian?: string | null;
}

/**
 * Optional helper to do a smooth scroll to the #ara-main section.
 * Feel free to customize or remove.
 */
const smoothScrollToMain = () => {
  const main = document.getElementById("ara-main");
  if (main) {
    const start = window.scrollY;
    const end = main.offsetTop;
    const duration = 1000; // 1 second
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function for smoother animation
      const easeInOutCubic =
        progress < 0.5
          ? 4 * progress * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 3) / 2;

      window.scrollTo(0, start + (end - start) * easeInOutCubic);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }
};

/**
 * Main collection component
 */
export default function Collection() {
  const searchParams = useSearchParams();
  

  // Access audio context (if you have a global player)
  const audioContext = React.useContext(AudioContext);
  const setSong = audioContext?.setSong;
  const setName = audioContext?.setName;
  const setArtistName = audioContext?.setArtistName;
  const setSongId = audioContext?.setSongId;
  const setAlbumArt = audioContext?.setAlbumArt;
  const audioPlayerRef = audioContext?.audioPlayerRef;

  // Instead of a single "filters", we use two sets: included and excluded
  const [includedFilters, setIncludedFilters] = useState<{ [key: string]: Set<string> }>({});
  const [excludedFilters, setExcludedFilters] = useState<{ [key: string]: Set<string> }>({});

  const [language, setLanguage] = useState("EN");

  // We'll store the entire (unfiltered) record archive
  const [allRecords, setAllRecords] = useState<any[]>([]);
  // We'll store the final (filtered) records
  const [records, setRecords] = useState<any[]>([]);

  // Additional search controls
  const [searchString, setSearchString] = useState<string>("");
  const [searchYear, setSearchYear] = useState<string>("");
  const [searchArtist, setSearchArtist] = useState<string>("");

  // Active filter tab
  const [activeFilter, setActiveFilter] = useState<string | null>("genres");

  // Master lists for each filter type
  const [instruments, setInstruments] = useState<string[]>([]);
  const [genres, setGenres] = useState<string[]>([]);
  const [regions, setRegions] = useState<string[]>([]);
  const [artists, setArtists] = useState<ArtistType[]>([]);
  const [labels, setLabels] = useState<any[]>([]);
  const [labelIdToNameMap, setLabelIdToNameMap] = useState<{ [key: string]: string }>({});

  // For dynamic counts & availability
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

  // Various refs for the landing page & menu
  const landingRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuLinksWrapperRef = useRef<HTMLDivElement>(null);
  const menuIconRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLImageElement>(null);

  // Menu show/hide states
  const [isMenuVisible, setIsMenuVisible] = useState(true);
  const [userToggledMenu, setUserToggledMenu] = useState(false);

  // Whether the filter menu is open
  const [isFilterOpen, setIsFilterOpen] = useState(true);

  // Language toggle
  const changeLanguage = (lang: string) => {
    setLanguage(lang);
  };

  /**
   * On mount, fetch all initial data: labels, genres, instruments, artists, plus all records.
   */
  useEffect(() => {
    // 1) Fetch labels from Directus
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

    // 2) Fetch genres field options
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
        // fallback
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

    // 3) Fetch regions field options
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
        // fallback
        setRegions([
          "Europe",
          "North America",
          "South America",
          "Soviet Union",
          "Middle East",
        ]);
      });

    // 4) Fetch instruments from the record_archive (collect unique)
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

    // 5) Fetch artists from Directus
    axios
      .get("https://ara.directus.app/items/artists?limit=-1&fields=id,artist_name,artist_name_armenian")
      .then((response) => {
        const data = response.data.data || [];
        setArtists(data);
      })
      .catch((error) => {
        console.error("Error fetching artists:", error);
        setArtists([]);
      });

    // 6) Fetch ALL records from record_archive
    axios
      .get("https://ara.directus.app/items/record_archive?limit=-1&fields=*,record_label.*")
      .then((response) => {
        const allData = response.data.data;
        setAllRecords(allData);
      })
      .catch((error) => {
        console.error("Error fetching all records from Directus:", error);
      });
  }, []);

  /**
   * Optionally auto-scroll after mount
   */
  useEffect(() => {
    const initialDelay = setTimeout(() => {
      if (window.scrollY === 0) {
        const timer = setTimeout(() => {
          if (window.scrollY === 0) {
            smoothScrollToMain();
          }
        }, 1500);
        return () => clearTimeout(timer);
      }
    }, 100);
    return () => clearTimeout(initialDelay);
  }, []);

  /**
   * The main effect that filters allRecords to produce "records" 
   * based on searchString, searchYear, searchArtist, plus included/excluded sets.
   */
  useEffect(() => {
    if (!allRecords.length) {
      setRecords([]);
      return;
    }

    // 1) Fuzzy search on many fields (if searchString is not empty)
    let fuseFiltered: any[];
    if (!searchString) {
      fuseFiltered = [...allRecords];
    } else {
      const fuseOptions = {
        isCaseSensitive: false,
        includeScore: true,
        threshold: 0.2,
        distance: 100,
        ignoreLocation: true,
        minMatchCharLength: 2,
        keys: [
          "id",
          "ARAID",
          "record_catalog_number",
          "title",
          "title_armenian",
          "title_english",
          "title_translation",
          "display_title",
          "artist_original",
          "artist_english",
          "artist_armenian",
          "arranged_by",
          "composed_by",
          "conducted_by",
          "lyrics_by",
          "record_label.label_en",
          "language",
          "genres",
          "instruments",
          "regions",
          "comment",
          "song_lyrics",
        ],
      };
      const fuse = new Fuse(allRecords, fuseOptions);
      const searchResults = fuse.search(searchString);
      fuseFiltered = searchResults.map((r) => r.item);
    }

    // 2) Filter by year
    let postYear: any[];
    if (!searchYear) {
      postYear = fuseFiltered;
    } else {
      postYear = fuseFiltered.filter((rec) => {
        if (!rec.year) return false;
        return String(rec.year) === searchYear;
      });
    }

    // 3) Filter by "searchArtist" substring
    let postArtist: any[];
    if (!searchArtist) {
      postArtist = postYear;
    } else {
      postArtist = postYear.filter((rec) => {
        const fieldsToCheck = [
          rec.artist_english,
          rec.artist_armenian,
          rec.artist_original,
        ];
        return fieldsToCheck.some((field) =>
          field?.toLowerCase().includes(searchArtist.toLowerCase())
        );
      });
    }

    // 4) Apply included filters (i.e. must contain all in includedFilters)
    let postFilters = [...postArtist];

    // For each filter type in includedFilters
    Object.keys(includedFilters).forEach((filterName) => {
      const setOfIncluded = includedFilters[filterName];
      if (!setOfIncluded || setOfIncluded.size === 0) return;

      if (filterName === "record_label") {
        // We have label objects. We find the matching label IDs by label_en
        const labelIds = labels
          .filter((lab) => setOfIncluded.has(lab.label_en))
          .map((lab) => lab.id);

        postFilters = postFilters.filter((rec) => {
          if (!rec.record_label) return false;
          return labelIds.includes(rec.record_label.id);
        });
      } else if (filterName === "artist_original" || filterName === "artists") {
        // We'll do a substring check in rec.artist_original
        const filterArray = Array.from(setOfIncluded);
        postFilters = postFilters.filter((rec) => {
          const recArtist = (rec.artist_original || "").toLowerCase();
          return filterArray.every((artistName) =>
            recArtist.includes(artistName.toLowerCase())
          );
        });
      } else {
        // "genres", "instruments", "regions"
        postFilters = postFilters.filter((rec) => {
          const recField = Array.isArray(rec[filterName]) ? rec[filterName] : [];
          return Array.from(setOfIncluded).every((val) =>
            recField.some((fieldVal: string) =>
              fieldVal.toLowerCase().includes(val.toLowerCase())
            )
          );
        });
      }
    });

    // 5) Apply excluded filters (i.e. must NOT contain any in excludedFilters)
    Object.keys(excludedFilters).forEach((filterName) => {
      const setOfExcluded = excludedFilters[filterName];
      if (!setOfExcluded || setOfExcluded.size === 0) return;

      if (filterName === "record_label") {
        const labelIds = labels
          .filter((lab) => setOfExcluded.has(lab.label_en))
          .map((lab) => lab.id);

        postFilters = postFilters.filter((rec) => {
          if (!rec.record_label) return true; // if it has no label, not excluded
          return !labelIds.includes(rec.record_label.id);
        });
      } else if (filterName === "artist_original" || filterName === "artists") {
        // exclude if rec.artist_original includes that name
        postFilters = postFilters.filter((rec) => {
          const recArtist = (rec.artist_original || "").toLowerCase();
          return !Array.from(setOfExcluded).some((excludedName) =>
            recArtist.includes(excludedName.toLowerCase())
          );
        });
      } else {
        // "genres", "instruments", "regions"
        postFilters = postFilters.filter((rec) => {
          const recField = Array.isArray(rec[filterName]) ? rec[filterName] : [];
          // remove the record if it contains ANY excluded item
          return !Array.from(setOfExcluded).some((excludedVal) =>
            recField.some((fieldVal: string) =>
              fieldVal.toLowerCase().includes(excludedVal.toLowerCase())
            )
          );
        });
      }
    });

    // 6) Filter out anything without audio
    const finalRecords = postFilters
      .filter((rec) => rec.audio)
      .map((rec: any) => ({
        songId: rec.audio,
        author: rec.artist_original,
        title: rec.title,
        image: rec.record_image,
        id: rec.id,
        year: rec.year,
        title_armenian: rec.title_armenian,
        color: rec.hex_color,
        display_title: rec.display_title,
        record_label: rec.record_label?.label_en || null,
        genres: rec.genres ?? [],
        instruments: rec.instruments ?? [],
        regions: rec.regions ?? [],
        artist_original: rec.artist_original,
        araId: rec.ARAID,
      }));

    setRecords(finalRecords);

    /**
     * Now compute dynamic counts & availability from these finalRecords
     */
    const newResultCounts: { [key: string]: number } = {};
    const newAvailableFilters = {
      genres: new Set<string>(),
      instruments: new Set<string>(),
      regions: new Set<string>(),
      artists: new Set<string>(),
      record_label: new Set<string>(),
    };

    finalRecords.forEach((rec) => {
      // genres
      if (Array.isArray(rec.genres)) {
        rec.genres.forEach((g: string) => {
          newResultCounts[g] = (newResultCounts[g] || 0) + 1;
          newAvailableFilters.genres.add(g);
        });
      }
      // instruments
      if (Array.isArray(rec.instruments)) {
        rec.instruments.forEach((instr: string) => {
          newResultCounts[instr] = (newResultCounts[instr] || 0) + 1;
          newAvailableFilters.instruments.add(instr);
        });
      }
      // regions
      if (Array.isArray(rec.regions)) {
        rec.regions.forEach((r: string) => {
          newResultCounts[r] = (newResultCounts[r] || 0) + 1;
          newAvailableFilters.regions.add(r);
        });
      }
      // record_label
      if (rec.record_label) {
        const labelName = rec.record_label;
        newResultCounts[labelName] = (newResultCounts[labelName] || 0) + 1;
        newAvailableFilters.record_label.add(labelName);
      }
    });

    // For artists
    finalRecords.forEach((rec) => {
      const recArtist = (rec.artist_original || "").toLowerCase();
      for (const artistObj of artists) {
        const aName = artistObj.artist_name?.trim() || "";
        if (!aName) continue;
        if (recArtist.includes(aName.toLowerCase())) {
          newResultCounts[aName] = (newResultCounts[aName] || 0) + 1;
          newAvailableFilters.artists.add(aName);
        }
      }
    });

    setResultCounts(newResultCounts);
    setAvailableFilters(newAvailableFilters);
  }, [
    searchString,
    searchYear,
    searchArtist,
    includedFilters,
    excludedFilters,
    allRecords,
    artists,
    labels,
  ]);

  /**
   * Rotate the big landing page logo on scroll
   */
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

  /**
   * Hide/show the top menu on scroll (if user hasn't toggled it).
   */
  useEffect(() => {
    const handleScroll = () => {
      if (userToggledMenu) return;
      if (
        !introRef.current ||
        !menuRef.current ||
        !menuLinksWrapperRef.current ||
        !menuIconRef.current
      )
        return;

      const introWrapper = introRef.current;
      const menu = menuRef.current;
      const menuLinks = menuLinksWrapperRef.current;
      const menuIcon = menuIconRef.current;

      const introRect = introWrapper.getBoundingClientRect();
      const menuRect = menu.getBoundingClientRect();
      const introMiddle = (introRect.top + introRect.bottom) / 2;
      const menuBottom = menuRect.bottom;

      if (introMiddle <= menuBottom - 50) {
        // Hide menu links
        if (isMenuVisible) {
          menuLinks.classList.remove("expanded");
          menuIcon.classList.remove("clicked");
          setIsMenuVisible(false);
        }
      } else {
        // Show menu links
        if (!isMenuVisible) {
          menuLinks.classList.add("expanded");
          menuIcon.classList.add("clicked");
          setIsMenuVisible(true);
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [userToggledMenu, isMenuVisible]);

  /**
   * Manual toggle for the top menu
   */
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
          src="/ara_logo_1.svg"
          alt="ARA logo"
          id="logo"
          ref={logoRef}
          onClick={smoothScrollToMain}
        />
      </div>

      {/* Main Container */}
      <div className="ara-main" id="ara-main">
        {/* MENU */}
        <div className="ara-menu" id="ara-menu" ref={menuRef}>
          <div className="ara-menu-title" id="ara-menu-title">
            ARMENIAN RECORD ARCHIVE
          </div>
          <div
            className="ara-menu-links-wrapper expanded"
            id="ara-menu-links-wrapper"
            ref={menuLinksWrapperRef}
          >
            <Link href="#collection">
              COLLECTION <br /> ՀԱՎԱՔԱՑՈՒ
            </Link>{" "}
            ●
            <Link href="#about">
              ABOUT US <br /> ՄԵՐ ՄԱՍԻՆ
            </Link>
          </div>
          <div
            className="ara-menu-toggle"
            id="ara-menu-toggle"
            onClick={toggleMenu}
          >
            <div className="ara-menu-icon" id="menu-icon" ref={menuIconRef}>
              <div className="ara-menu-icon-sleeve"></div>
              <div className="ara-menu-icon-record"></div>
            </div>
          </div>
        </div>

        {/* INTRO */}
        <div className="ara-intro" ref={introRef}>
          <div className="ara-intro-text-english">
            <div>
              ֎ Welcome to the Armenian Record Archive, where we preserve and
              celebrate the rich history of Armenian music and culture.
            </div>
          </div>
          <div className="ara-intro-text-armenian">
            <div>
              Բարի գալուստ Հայկական ձայնագրությունների արխիվ, որտեղ մենք
              պահպանում և տոնում ենք Հայկական երաժշտության և մշակույթի հարուստ
              պատմությունը: ֍
            </div>
          </div>
        </div>

        {/* COLLECTION */}
        <div className="ara-collection-wrapper" id="collection">
          {/* SEARCH BAR */}
          <div className="ara-search-bar">
            <span className="search-icon">⌕</span>
            <input
              type="text"
              className="search-input"
              placeholder="Search • Փնտռէ"
              value={searchString}
              onChange={(e) => setSearchString(e.target.value)}
            />
            {/* Clear button */}
            {searchString && (
              <button
                className="clear-search-button"
                onClick={() => setSearchString("")}
              >
                ✕
              </button>
            )}
          </div>

          {/* FILTERS SECTION */}
          <div className="ara-filters-section">
            <div className="ara-filters-header">
              <div
                className="ara-filters-title"
                id="filters"
                onClick={() => setIsFilterOpen((prev) => !prev)}
                style={{ cursor: "pointer", userSelect: "none" }}
              >
                Filters{" "}
                <span className={`filter-arrow ${isFilterOpen ? "open" : ""}`}>
                  ▲
                </span>
              </div>
              <div className="ara-filters-language-switcher">
                <span
                  onClick={() => changeLanguage("EN")}
                  className={language === "EN" ? "language-selected" : ""}
                  style={{ cursor: "pointer" }}
                >
                  ENG
                </span>
                |
                <span
                  onClick={() => changeLanguage("HY")}
                  className={language === "HY" ? "language-selected" : ""}
                  style={{ cursor: "pointer" }}
                >
                  ՀԱՅ
                </span>
              </div>
            </div>

            <div
              className={`ara-filter-menu-wrapper ${
                isFilterOpen ? "expanded" : ""
              }`}
            >
              <FilterMenu
                activeFilter={activeFilter}
                setActiveFilter={setActiveFilter}
                genres={genres}
                instruments={instruments}
                regions={regions}
                artists={artists}
                labels={labels}
                labelIdToNameMap={labelIdToNameMap}
                // Pass our two sets of filters:
                includedFilters={includedFilters}
                setIncludedFilters={setIncludedFilters}
                excludedFilters={excludedFilters}
                setExcludedFilters={setExcludedFilters}
                availableFilters={availableFilters}
                resultCounts={resultCounts}
                language={language}
              />
            </div>
          </div>

          {/* Records Grid */}
          <RecordListView
            setCurrentSong={setSong}
            setCurrentName={setName}
            setCurrentArtistName={setArtistName}
            setSongId={setSongId}
            setAlbumArt={setAlbumArt}
            audioPlayerRef={audioPlayerRef}
            records={records}
          />
        </div>
      </div>
    </>
  );
}
