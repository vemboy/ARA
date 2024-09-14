import React, { useState, useEffect } from "react";
import axios from "axios";
import _ from "lodash";

interface FilterMenuProps {
  genres: string[];
  instruments: string[];
  filters: { [key: string]: Set<string> };
  setFilter: React.Dispatch<React.SetStateAction<{ [key: string]: Set<string> }>>;
}

function buildFilterObject(filters: { [key: string]: Set<string> }) {
  const filterObj: { _and: any[] } = { _and: [] };

  Object.entries(filters).forEach(([filterName, filtersSet]) => {
    const filterArray = Array.from(filtersSet);
    if (filterArray.length > 0) {
      filterArray.forEach((filter) => {
        filterObj._and.push({ [filterName]: { _contains: filter } });
      });
    }
  });

  return filterObj;
}

const FilterMenu: React.FC<FilterMenuProps> = ({
  genres,
  instruments,
  filters,
  setFilter,
}) => {
  const [activeFilter, setActiveFilter] = useState<string>("genre");
  const [language, setLanguage] = useState("EN");
  const [availableFilters, setAvailableFilters] = useState({
    genres: new Set(genres),
    instruments: new Set(instruments),
  });
  const [resultCounts, setResultCounts] = useState<{ [key: string]: number }>({});

  // Fetch and update the available options and counts based on current filters
  const fetchAvailableOptions = (currentFilters: { [key: string]: Set<string> }) => {
    const filterObj = buildFilterObject(currentFilters);
    const stringifiedFilterObj = JSON.stringify(filterObj);
    const url = `https://ara.directus.app/items/record_archive?limit=200&filter=${stringifiedFilterObj}`;

    axios
      .get(url)
      .then((response) => {
        const records = response.data.data;
        const newAvailableGenres = new Set<string>();
        const newAvailableInstruments = new Set<string>();
        const counts: { [key: string]: number } = {};

        // DEBUGGING: Log the entire response to ensure genres are included
        console.log("API Response:", records);

        // Flatten all genres and instruments
        records.forEach((record: any) => {
          // Ensure genres array is processed properly
          if (Array.isArray(record.genres)) {
            record.genres.forEach((genre: string) => {
              newAvailableGenres.add(genre);
              counts[genre] = (counts[genre] || 0) + 1;
            });
          }

          // Process instruments array
          if (Array.isArray(record.instruments)) {
            record.instruments.forEach((instrument: string) => {
              newAvailableInstruments.add(instrument);
              counts[instrument] = (counts[instrument] || 0) + 1;
            });
          }
        });

        // Update available options and result counts
        setAvailableFilters({
          genres: newAvailableGenres,
          instruments: newAvailableInstruments,
        });
        setResultCounts(counts);
      })
      .catch((error) => {
        console.error("Error fetching available options:", error);
      });
  };

  // Handle when a user clicks on a filter item
  const handleSubItemClick = (filterType: string, itemName: string) => {
    const newFilters = structuredClone(filters);
    newFilters[filterType] ??= new Set();

    if (newFilters[filterType].has(itemName)) {
      newFilters[filterType].delete(itemName);
    } else {
      newFilters[filterType].add(itemName);
    }

    // Fetch the updated list of available options based on selected filters
    fetchAvailableOptions(newFilters);
    setFilter(newFilters);
  };

  // Clear all selected filters
  const handleClearAll = () => {
    setFilter({});
    fetchAvailableOptions({}); // Reset available filters to default
  };

  useEffect(() => {
    // Initially fetch all available options without filters
    fetchAvailableOptions(filters);
  }, []);

  const translations: Record<string, Record<string, string>> = {
    EN: {
      artist: "Artist",
      genre: "Genre",
      instrument: "Instrument",
      recordlabels: "Label",
    },
    HY: {
      artist: "Հեղինակ",
      genre: "Ժանր",
      instrument: "Նվագարան",
      recordlabels: "Պիտակ",
    },
  };

  return (
    <div className="filter-menu-hm">
      <div className="filters-header-hm">
        <h2>Filters</h2>
        <div className="language-toggle-hm">
          <span
            id="lang-en-hm"
            className={`lang-option-hm ${language === "EN" ? "active" : ""}`}
            onClick={() => setLanguage("EN")}
          >
            English
          </span>{" "}
          |{" "}
          <span
            id="lang-arm-hm"
            className={`lang-option-hm ${language === "HY" ? "active" : ""}`}
            onClick={() => setLanguage("HY")}
          >
            Հայերեն
          </span>
        </div>
      </div>

      <div className="filter-grid-hm">
        {Object.entries(translations[language]).map(([filterKey, filterName]) => (
          <div
            key={filterKey}
            id={`filter-${filterKey}`}
            className={`filter-item-hm ${activeFilter === filterKey ? "active" : ""}`}
            data-filter={filterKey}
            onClick={() => setActiveFilter(filterKey)}
          >
            {filterName}
          </div>
        ))}
      </div>

      {/* Selected Filters Pills */}
      <div className="selected-filters-pills-hm">
        {Object.entries(filters).map(([filterType, selectedItems]) =>
          Array.from(selectedItems).map((item) => (
            <span className="pill-hm" key={item}>
              {item}
              <button
                className="x-button-hm"
                onClick={() => handleSubItemClick(filterType, item)}
              >
                ×
              </button>
            </span>
          ))
        )}
        {Object.keys(filters).length > 0 && (
          <a href="#" className="clear-all-hm" onClick={handleClearAll}>
            Clear All
          </a>
        )}
      </div>

      {activeFilter === "genre" && (
        <ul className="sub-list-hm active" id="list-genre-hm">
          {genres.map((genre) => (
            <li
              key={genre}
              className={`${
                availableFilters.genres.has(genre) ? "" : "disabled"
              } ${filters.genres?.has(genre) ? "active" : ""}`}
              data-item={genre}
              onClick={() =>
                availableFilters.genres.has(genre) && handleSubItemClick("genres", genre)
              }
            >
              <span className="icon-circle-hm"></span>
              {`${genre} (${resultCounts[genre] || 0})`}
            </li>
          ))}
        </ul>
      )}

      {activeFilter === "instrument" && (
        <ul className="sub-list-hm active" id="list-instrument-hm">
          {instruments.map((instrument) => (
            <li
              key={instrument}
              className={`${
                availableFilters.instruments.has(instrument) ? "" : "disabled"
              } ${filters.instruments?.has(instrument) ? "active" : ""}`}
              data-item={instrument}
              onClick={() =>
                availableFilters.instruments.has(instrument) &&
                handleSubItemClick("instruments", instrument)
              }
            >
              <span className="icon-circle-hm"></span>
              {`${instrument} (${resultCounts[instrument] || 0})`}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FilterMenu;
