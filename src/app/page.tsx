"use client";

import { useSearchParams } from "next/navigation";
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Link from "next/link";
import _ from "lodash";
import Fuse from "fuse.js";
import { AudioContext } from "./audioLayout";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import Footer from "./footer";


// Import your new filter menu
import FilterMenu from "./filter-menu";

// Import your RecordListView
import RecordListView from "./record-list-view";

// Interface for artists
interface ArtistType {
  id: string;
  artist_name: string;
  artist_name_armenian?: string | null;
  artist_name_alternate_spelling?: string[];
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
  const router = useRouter();

  const searchParams = useSearchParams();
  const pathname = usePathname(); // e.g. "/"

  const [missingArtistsText, setMissingArtistsText] = useState("");

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

const sortedArtists = React.useMemo(() => {
  return [...artists].sort((a, b) => {
    const getLastName = (fullName: string) => {
      const nameParts = fullName.split(" ");
      if (nameParts[0].toLowerCase() === "the") {
        nameParts.shift();
      }
      return nameParts[nameParts.length - 1].toLowerCase();
    };
    return getLastName(a.artist_name).localeCompare(getLastName(b.artist_name));
  });
}, [artists]);


  useEffect(() => {
    if (typeof window === "undefined") return;

    // 1) Force manual scroll restoration so the browser doesn't do it automatically
    window.history.scrollRestoration = "manual";

    // 2) Attempt to restore scroll position right away (e.g. if user is returning via Back)
    restoreScrollPosition();

    // 3) Save scroll whenever the page is being hidden/unloaded (including route changes).
    function handlePageHide() {
      saveScrollPosition();
    }

    // 4) If user revisits the page from the BFCache (back-forward cache),
    //    pageshow can also be fired. So we restore again.
    function handlePageShow(event: Event & { persisted: boolean }) {
      if (event.persisted) {
        restoreScrollPosition();
      }
    }

    window.addEventListener("pagehide", handlePageHide);
    window.addEventListener("pageshow", handlePageShow);

    return () => {
      // Always save the scroll one last time on unmount
      saveScrollPosition();
      window.removeEventListener("pagehide", handlePageHide);
      window.removeEventListener("pageshow", handlePageShow);
    };
  }, [pathname]);

  function saveScrollPosition() {
    sessionStorage.setItem(`scrollPos:${pathname}`, String(window.scrollY));
  }

  function restoreScrollPosition() {
    const savedY = sessionStorage.getItem(`scrollPos:${pathname}`);
    if (savedY !== null) {
      requestAnimationFrame(() => {
        window.scrollTo(0, parseInt(savedY, 10));
      });
    }
  }

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
      .get("https://ara.directus.app/items/record_archive?limit=-1&fields=genres")
      .then((response) => {
        const uniqueGenres: Set<string> = new Set();
        response.data.data.forEach((item: any) => {
          if (Array.isArray(item.genres)) {
            item.genres.forEach((genre: string) => {
              uniqueGenres.add(genre);
            });
          }
        });
        setGenres(Array.from(uniqueGenres));
      })
      .catch((error) => {
        console.error("Error fetching genres from DB:", error);
        setGenres([]);
      });

    // 3) Fetch regions field options
    axios
      .get("https://ara.directus.app/items/record_archive?limit=-1&fields=regions")
      .then((response) => {
        const uniqueRegions: Set<string> = new Set();
        response.data.data.forEach((item: any) => {
          if (Array.isArray(item.regions)) {
            item.regions.forEach((region: string) => {
              uniqueRegions.add(region);
            });
          }
        });
        setRegions(Array.from(uniqueRegions));
      })
      .catch((error) => {
        console.error("Error fetching regions from DB:", error);
        setRegions([]);
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
      .get("https://ara.directus.app/items/artists?limit=-1&fields=id,artist_name,artist_name_armenian,artist_name_alternate_spelling")
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
    // Check if this is a "fresh" load or a "back_forward" load
    const navEntries = performance.getEntriesByType("navigation") as PerformanceNavigationTiming[];
    if (navEntries.length > 0) {
      const navType = navEntries[0].type;
      // Only scroll to #ara-main if it's a new navigation or reload
      if (navType === "navigate" || navType === "reload") {
        const timer = setTimeout(() => {
          if (window.scrollY === 0) {
            smoothScrollToMain();
          }
        }, 1500);
        return () => clearTimeout(timer);
      }
    }
  }, []);

useEffect(() => {
  if (!artists.length || !allRecords.length) return;
  // Guard: if already merged, skip merging to avoid infinite loop
  if (allRecords.some((rec) => rec.artist_normalized !== undefined)) return;
  
  const normalize = (str: string) =>
    str.trim().toLowerCase().replace(/^the\s+/, "");
  
  const mergedRecords = allRecords.map((rec) => {
    const recName = rec.artist_original ? normalize(rec.artist_original) : "";
    const foundArtist = artists.find((artist) => {
      const primary = artist.artist_name ? normalize(artist.artist_name) : "";
      const alternate = (artist.artist_name_alternate_spelling || []).map((s: string) =>
        normalize(s)
      );
      return recName === primary || alternate.includes(recName);
    });
    return {
      ...rec,
      artist_alternate_spellings: foundArtist?.artist_name_alternate_spelling ?? [],
      artist_normalized: foundArtist ? normalize(foundArtist.artist_name) : recName,
    };
  });
  
  setAllRecords(mergedRecords);
}, [artists, allRecords]);




  /**
   * The main effect that filters allRecords to produce "records"
   * based on searchString, searchYear, searchArtist, plus included/excluded sets.
   */
  useEffect(() => {
    if (!allRecords.length) {
      setRecords([]);
      return;
    }

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
          "artist_alternate_spellings"
        ],
      };
      const fuse = new Fuse(allRecords, fuseOptions);
      const searchResults = fuse.search(searchString);
      fuseFiltered = searchResults.map((r) => r.item);
    }

    let postYear: any[];
    if (!searchYear) {
      postYear = fuseFiltered;
    } else {
      postYear = fuseFiltered.filter((rec) => {
        if (!rec.year) return false;
        return String(rec.year) === searchYear;
      });
    }

    let postArtist: any[];
    if (!searchArtist) {
      postArtist = postYear;
    } else {
      postArtist = postYear.filter((rec) => {
        const altSpellings = Array.isArray(rec.artist_alternate_spellings)
          ? rec.artist_alternate_spellings
          : [];
        const fieldsToCheck = [
          rec.artist_english,
          rec.artist_armenian,
          rec.artist_original,
          ...altSpellings,
        ];
        return fieldsToCheck.some((field) =>
          field?.toLowerCase().includes(searchArtist.toLowerCase())
        );
      });
    }

    let postFilters = [...postArtist];

    Object.keys(includedFilters).forEach((filterName) => {
      const setOfIncluded = includedFilters[filterName];
      if (!setOfIncluded || setOfIncluded.size === 0) return;

      if (filterName === "record_label") {
        const labelIds = labels
          .filter((lab) => setOfIncluded.has(lab.label_en))
          .map((lab) => lab.id);

        postFilters = postFilters.filter((rec) => {
          if (!rec.record_label) return false;
          return labelIds.includes(rec.record_label.id);
        });
      } else if (filterName === "artist_original" || filterName === "artists") {
  const filterArray = Array.from(setOfIncluded);
  const normalize = (s: string) => s.trim().toLowerCase().replace(/^the\s+/, "");
  postFilters = postFilters.filter((rec) => {
    const recArtistNormalized = rec.artist_normalized || "";
    return filterArray.every((artistName) => {
      const lowerArtistNameNormalized = normalize(artistName);
      return recArtistNormalized.includes(lowerArtistNameNormalized);
    });
  });
}
else {
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

    Object.keys(excludedFilters).forEach((filterName) => {
      const setOfExcluded = excludedFilters[filterName];
      if (!setOfExcluded || setOfExcluded.size === 0) return;

      if (filterName === "record_label") {
        const labelIds = labels
          .filter((lab) => setOfExcluded.has(lab.label_en))
          .map((lab) => lab.id);

        postFilters = postFilters.filter((rec) => {
          if (!rec.record_label) return true;
          return !labelIds.includes(rec.record_label.id);
        });
      } else if (filterName === "artist_original" || filterName === "artists") {
        postFilters = postFilters.filter((rec) => {
          const recArtist = (rec.artist_original || "").toLowerCase();
          return !Array.from(setOfExcluded).some((excludedName) =>
            recArtist.includes(excludedName.toLowerCase())
          );
        });
      } else {
        postFilters = postFilters.filter((rec) => {
          const recField = Array.isArray(rec[filterName]) ? rec[filterName] : [];
          return !Array.from(setOfExcluded).some((excludedVal) =>
            recField.some((fieldVal: string) =>
              fieldVal.toLowerCase().includes(excludedVal.toLowerCase())
            )
          );
        });
      }
    });

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

    const newResultCounts: { [key: string]: number } = {};
    const newAvailableFilters = {
      genres: new Set<string>(),
      instruments: new Set<string>(),
      regions: new Set<string>(),
      artists: new Set<string>(),
      record_label: new Set<string>(),
    };

    finalRecords.forEach((rec) => {
      if (Array.isArray(rec.genres)) {
        rec.genres.forEach((g: string) => {
          newResultCounts[g] = (newResultCounts[g] || 0) + 1;
          newAvailableFilters.genres.add(g);
        });
      }
      if (Array.isArray(rec.instruments)) {
        rec.instruments.forEach((instr: string) => {
          newResultCounts[instr] = (newResultCounts[instr] || 0) + 1;
          newAvailableFilters.instruments.add(instr);
        });
      }
      if (Array.isArray(rec.regions)) {
        rec.regions.forEach((r: string) => {
          newResultCounts[r] = (newResultCounts[r] || 0) + 1;
          newAvailableFilters.regions.add(r);
        });
      }
      if (rec.record_label) {
        const labelName = rec.record_label;
        newResultCounts[labelName] = (newResultCounts[labelName] || 0) + 1;
        newAvailableFilters.record_label.add(labelName);
      }
    });

finalRecords.forEach((rec) => {
  const recArtist = (rec.artist_original || "").toLowerCase();
  for (const artistObj of artists) {
    const primaryName = artistObj.artist_name?.trim().toLowerCase() || "";
    const alternateSpellings = (artistObj.artist_name_alternate_spelling || []).map(sp => sp.trim().toLowerCase());

    // Check if the record's artist matches the primary name or any alternate spelling
    if (
      recArtist.includes(primaryName) ||
      alternateSpellings.some(alt => recArtist.includes(alt))
    ) {
      newResultCounts[artistObj.artist_name] = (newResultCounts[artistObj.artist_name] || 0) + 1;
      newAvailableFilters.artists.add(artistObj.artist_name);
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
   * This version uses the intro element's position and also forces the menu open when near the top of the page.
   */
  useEffect(() => {
    const handleScroll = () => {
      if (userToggledMenu) return;
      if (!introRef.current) return;
      const menuLinks = menuLinksWrapperRef.current;
      const menuIcon = menuIconRef.current;
      if (!menuLinks || !menuIcon) return;
      // Always show menu if the page is near the top (scrollY < 50)
      if (window.scrollY < 50) {
        if (!isMenuVisible) {
          menuLinks.classList.add("expanded");
          menuIcon.classList.add("clicked");
          setIsMenuVisible(true);
        }
        return;
      }
      const introRect = introRef.current.getBoundingClientRect();
      // Hide the menu if the bottom of the intro is very near the top (<= 50px)
      if (introRect.bottom <= 50) {
        if (isMenuVisible) {
          menuLinks.classList.remove("expanded");
          menuIcon.classList.remove("clicked");
          setIsMenuVisible(false);
        }
      } else {
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
      setIsMenuVisible(false);
    } else {
      menuLinks.classList.add("expanded");
      menuIcon.classList.add("clicked");
      setIsMenuVisible(true);
    }
    setTimeout(() => {
      setUserToggledMenu(false);
    }, 300);
  };

  useEffect(() => {
    if (!allRecords.length || !artists.length) return;

    const knownLower = new Set<string>();
    artists.forEach((artist) => {
      if (artist.artist_name) {
        knownLower.add(artist.artist_name.trim().toLowerCase());
      }
      if (artist.artist_name_armenian) {
        knownLower.add(artist.artist_name_armenian.trim().toLowerCase());
      }
      if (artist.artist_name_alternate_spelling && artist.artist_name_alternate_spelling.length) {
        artist.artist_name_alternate_spelling.forEach((alt) => {
          knownLower.add(alt.trim().toLowerCase());
        });
      }
    });

    const missingArtistsMap: { [artistName: string]: Set<string> } = {};

    allRecords.forEach((rec) => {
      const orig = rec.artist_original?.trim();
      if (!orig) return;
      const origLower = orig.toLowerCase();

      if (!knownLower.has(origLower)) {
        if (!missingArtistsMap[orig]) {
          missingArtistsMap[orig] = new Set();
        }
        if (rec.ARAID) {
          missingArtistsMap[orig].add(rec.ARAID);
        }
      }
    });

    if (Object.keys(missingArtistsMap).length === 0) {
      setMissingArtistsText("No missing artists!\n");
      return;
    }

    let lines = ["Missing Artists:\n"];
    for (const [artistName, araIds] of Object.entries(missingArtistsMap)) {
      lines.push(`${artistName} => ${Array.from(araIds).join(", ")}`);
    }
    setMissingArtistsText(lines.join("\n"));
  }, [allRecords, artists]);

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
          <div className="ara-menu-links-wrapper expanded" id="ara-menu-links-wrapper" ref={menuLinksWrapperRef}>
            <Link href="/">
              COLLECTION <br /> ՀԱՎԱՔԱՑՈՒ
            </Link>{" "}
            ●
            <Link href="/about">
              ABOUT US <br /> ՄԵՐ ՄԱՍԻՆ
            </Link>
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
            <div>
              ֎ Welcome to the Armenian Record Archive, where we preserve and celebrate the rich history of Armenian music and culture.
            </div>
          </div>
          <div className="ara-intro-text-armenian">
            <div>
              Բարի գալուստ Հայկական ձայնագրությունների արխիվ, որտեղ մենք պահպանում և տոնում ենք Հայկական երաժշտության և մշակույթի հարուստ պատմությունը: ֍
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
            {searchString && (
              <button className="clear-search-button" onClick={() => setSearchString("")}>
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

            <div className={`ara-filter-menu-wrapper ${isFilterOpen ? "expanded" : ""}`}>
            <FilterMenu
              activeFilter={activeFilter}
              setActiveFilter={setActiveFilter}
              genres={genres}
              instruments={instruments}
              regions={regions}
              artists={sortedArtists}
              labels={labels}
              labelIdToNameMap={labelIdToNameMap}
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
      <Footer />
    </>
  );
}

function DownloadMissingArtists({ text }: { text: string }) {
  const blob = new Blob([text], { type: "text/plain" });
  const url = URL.createObjectURL(blob);

  return (
    <div style={{ margin: "20px 0" }}>
      <a
        href={url}
        download="missing-artists.txt"
        style={{ padding: "8px 12px", backgroundColor: "red", color: "white", textDecoration: "none" }}
      >
        Download Missing Artists
      </a>
    </div>
  );
}
