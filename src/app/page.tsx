// main page - page.tsx

"use client";

import { useSearchParams } from "next/navigation";
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Link from "next/link";
import _ from "lodash";
import { AudioContext } from "./audioLayout";

// UPDATED: Import your new "filter-menu.js" here
import FilterMenu from "./filter-menu";

import RecordListView from "./record-list-view";

interface ArtistType {
  id: string;
  artist_name: string;
  artist_name_armenian?: string | null;
}

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

export default function Collection() {
  const searchParams = useSearchParams();
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

  const [activeFilter, setActiveFilter] = useState<string | null>("genres");

  const [instruments, setInstruments] = useState<string[]>([]);
  const [genres, setGenres] = useState<string[]>([]);
  const [regions, setRegions] = useState<string[]>([]);
  const [artists, setArtists] = useState<ArtistType[]>([]);

  const [labels, setLabels] = useState<any[]>([]);
  const [labelIdToNameMap, setLabelIdToNameMap] = useState<{
    [key: string]: string;
  }>({});

  const [resultCounts, setResultCounts] = useState<{ [key: string]: number }>(
    {}
  );
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

  // NEW: State to toggle open/close of the filter menu
  const [isFilterOpen, setIsFilterOpen] = useState(true); // Default to true

  const changeLanguage = (lang: string) => {
    setLanguage(lang);
  };

  /** Builds the query URL with the current filters & search inputs */
  const getUrlWithFilters = (additionalFilter?: object) => {
    const filterObj: { _or?: object[]; _and?: object[] } = {
      _or: [],
      _and: [],
    };

    if (searchString.length > 0) {
      // First, check if we have any operators
      if (searchString.includes("+") || searchString.includes(",")) {
        const hasAndOperator = searchString.includes("+");
        const hasOrOperator = searchString.includes(",");

        // Split by either operator and trim whitespace
        const searchTerms = hasAndOperator
          ? searchString.split("+").map((term) => term.trim())
          : searchString.split(",").map((term) => term.trim());

        // Create a search condition for each term
        const searchConditions = searchTerms.map((term) => ({
          _or: [
            { title: { _icontains: term } },
            { title_armenian: { _icontains: term } },
            { artist_armenian: { _icontains: term } },
            { artist_original: { _icontains: term } },
            { genres: { _icontains: term } },
            { instruments: { _icontains: term } },
            { regions: { _icontains: term } },
            { record_label: { label_en: { _icontains: term } } },
          ],
        }));

        // For AND operations (plus sign), add each condition to _and array
        // For OR operations (comma), combine all conditions in _or array
        if (hasAndOperator) {
          filterObj._and = filterObj._and || [];
          filterObj._and.push(...searchConditions);
        } else {
          // Flatten all OR conditions into a single array
          filterObj._or = searchConditions.flatMap(
            (condition) => condition._or
          );
        }
      } else {
        // Handle single search term (no operators) - existing behavior
        filterObj._or = [
          { title: { _icontains: searchString } },
          { title_armenian: { _icontains: searchString } },
          { artist_armenian: { _icontains: searchString } },
          { artist_original: { _icontains: searchString } },
          { genres: { _icontains: searchString } },
          { instruments: { _icontains: searchString } },
          { regions: { _icontains: searchString } },
          { record_label: { label_en: { _icontains: searchString } } },
        ];
      }
    }

    if (searchYear.length > 0) {
      filterObj._and = filterObj._and || [];
      filterObj._and.push({ "year(year)": { _eq: searchYear } });
    }

    if (searchArtist.length > 0) {
      filterObj._and = filterObj._and || [];
      filterObj._and.push({
        _or: [
          { artist_english: { _icontains: searchArtist } },
          { artist_armenian: { _icontains: searchArtist } },
          { artist_original: { _icontains: searchArtist } },
        ],
      });
    }

    // Apply each selected filter
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
          filterArray.forEach((filterVal) => {
            if (!filterObj._and) filterObj._and = [];
            filterObj._and.push({ [filterName]: { _icontains: filterVal } });
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

useEffect(() => {
  const filterParam = searchParams.get("filter");
  if (filterParam) {
    try {
      const filterObj = JSON.parse(decodeURIComponent(filterParam));

      const processedFilters: { [key: string]: Set<string> } = {};
      Object.entries(filterObj).forEach(([key, values]) => {
        const valuesArray = Array.isArray(values)
          ? values
          : values !== null && typeof values === "object" && Object.keys(values).length > 0
          ? Object.keys(values)
          : [values].filter(Boolean);

        processedFilters[key] = new Set(valuesArray);
      });

      setFilter(processedFilters);

      const filterType = Object.keys(processedFilters)[0] || "genres";
      setActiveFilter(filterType);
      
      setIsFilterOpen(true);

      setTimeout(() => {
        const filtersElement = document.getElementById("filters");
        if (filtersElement) {
          const rect = filtersElement.getBoundingClientRect();
          const absoluteTop = window.pageYOffset + rect.top;
          window.scrollTo({
            top: absoluteTop - 16,
            behavior: 'instant'
          });
        }
      }, 100);

    } catch (error) {
      console.error("Error parsing filter parameter:", error);
    }
  }
}, [searchParams]);

  // Fetch initial data (labels, genres, regions, instruments, artists)
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
        // fallback
        setRegions([
          "Europe",
          "North America",
          "South America",
          "Soviet Union",
          "Middle East",
        ]);
      });

    // Fetch instruments
    axios
      .get(
        "https://ara.directus.app/items/record_archive?limit=-1&fields=instruments"
      )
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
  .get("https://ara.directus.app/items/artists?limit=-1&fields=id,artist_name,artist_name_armenian")
  .then((response) => {
    const data = response.data.data || [];
    setArtists(data); // Store as an array of objects
  })
  .catch((error) => {
    console.error("Error fetching artists:", error);
    setArtists([]);
  });
  }, []);

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

  // Fetch records + update available filters
  useEffect(() => {
  // Wait until we have fetched the artists array, otherwise substring matching won't work
  if (artists.length === 0) {
    // If the "artists" data isn't loaded yet, skip or do partial logic
    return;
  }

  

  const url = getUrlWithFilters();
  axios.get(url).then((response) => {
    const data = response.data.data;
    // Filter out records without audio, etc.
    const mappedRecords = data
      .filter((record: any) => record.audio)
      .map((record: any) => ({
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
        genres: record.genres ?? [],
        instruments: record.instruments ?? [],
        regions: record.regions ?? [],
        artist_original: record.artist_original,
        araId: record.ARAID,
      }));

    setRecords(mappedRecords);

    // Calculate counts & available filters
    const newResultCounts: { [key: string]: number } = {};
    const newAvailableFilters = {
      genres: new Set<string>(),
      instruments: new Set<string>(),
      regions: new Set<string>(),
      artists: new Set<string>(),
      record_label: new Set<string>(),
    };

    // For each record, update the sets for genres, instruments, etc. 
    data.forEach((rec: any) => {
      // genres
      if (Array.isArray(rec.genres)) {
        rec.genres.forEach((genre: string) => {
          newResultCounts[genre] = (newResultCounts[genre] || 0) + 1;
          newAvailableFilters.genres.add(genre);
        });
      }

      // instruments
      if (Array.isArray(rec.instruments)) {
        rec.instruments.forEach((instrument: string) => {
          newResultCounts[instrument] = (newResultCounts[instrument] || 0) + 1;
          newAvailableFilters.instruments.add(instrument);
        });
      }

      // regions
      if (Array.isArray(rec.regions)) {
        rec.regions.forEach((region: string) => {
          newResultCounts[region] = (newResultCounts[region] || 0) + 1;
          newAvailableFilters.regions.add(region);
        });
      }

      // record_label
      if (rec.record_label) {
        const labelName = rec.record_label;
        newResultCounts[labelName] = (newResultCounts[labelName] || 0) + 1;
        newAvailableFilters.record_label.add(labelName);
      }
    });

    // --- THE KEY CHANGE: ARTIST FILTER BUILDING ---
    // Instead of storing rec.artist_original directly,
    // we do a substring check against your "artists" array (artist_name).
    // For each record, see if it "contains" each known artist name.

    // We'll do a second pass so that we can read from `mappedRecords` 
    // (or from `data`) and also have the "artists" array in scope.
    data.forEach((rec: any) => {
      const recordArtistText = (rec.artist_original || "").toLowerCase();

      // Loop over your full artists array
      for (const artistObj of artists) {
        // If artist_name can be null, do a fallback
        const aName = artistObj.artist_name?.trim() || "";
        if (!aName) continue;

        // Convert both sides to lower case for an `_icontains` style match
        const lower = aName.toLowerCase();
        if (recordArtistText.includes(lower)) {
          // This record "belongs" to that artist
          // So bump the count and mark the artist as available
          newResultCounts[aName] = (newResultCounts[aName] || 0) + 1;
          newAvailableFilters.artists.add(aName);
        }
      }
    });
    // --- END KEY CHANGE ---

    setResultCounts(newResultCounts);
    setAvailableFilters(newAvailableFilters);
  });
}, [searchString, searchYear, filters, searchArtist, artists]); 


  // Rotate logo on scroll
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

  // Hide/show menu links on scroll
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

      if (introMiddle <= menuBottom) {
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

useEffect(() => {
  // Once we fetch both:
  //    records (the entire archive, or the subset?)
  //    and artists (the entire artists table)
  // we can do a quick check
  const artistSet = new Set(artists.map((a) => a.artist_name));

  records.forEach((rec) => {
    const artistOriginal = rec.artist_original;
    if (artistOriginal && !artistSet.has(artistOriginal.trim())) {
      console.warn(
        `Record ID=${rec.id} uses artist_original="${artistOriginal}" 
         which doesn't match any "artist_name" in the artists table!`
      );
    }
  });
}, [records, artists]);


useEffect(() => {
  records.forEach((rec) => {
    // If `artist_original` has commas, we assume multiple artists:
    if (rec.artist_original?.includes(",")) {
      console.log(
        "%c MULTI-ARTIST RECORD DETECTED! " + 
          `Record ID=${rec.id} => ${rec.artist_original}`,
        "color: #FFFFFF; font-size: 14px; background-color: #FF33CC; padding: 2px 4px;"
      );
    }
  });
}, [records]);

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
            {/* CLEAR SEARCH BUTTON IF WE HAVE TEXT */}
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
              {/* Toggle open/closed on click */}
<div 
  className="ara-filters-title" 
  id="filters"  // Add this id
  onClick={() => setIsFilterOpen((prev) => !prev)}
  style={{ cursor: "pointer", userSelect: "none" }}
>
  Filters{" "}
  <span className={`filter-arrow ${isFilterOpen ? "open" : ""}`}>▲</span>
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

            {/* Conditionally render the filter menu */}
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
                filters={filters}
                setFilter={setFilter}
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
