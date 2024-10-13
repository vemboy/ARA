import React, { useState } from "react";

interface FilterMenuProps {
  genres: string[];
  instruments: string[];
  regions: string[];
  artists: string[];
  labels: any[]; // labels array containing objects with id and name
  labelIdToNameMap: { [key: string]: string };
  filters: { [key: string]: Set<string> };
  setFilter: React.Dispatch<React.SetStateAction<{ [key: string]: Set<string> }>>;
  availableFilters: {
    genres: Set<string>;
    instruments: Set<string>;
    regions: Set<string>;
    artists: Set<string>;
    record_label: Set<string>;
  };
  resultCounts: { [key: string]: number };
  
}

const FilterMenu: React.FC<FilterMenuProps> = ({
  genres,
  instruments,
  regions,
  artists,
  labels,
  labelIdToNameMap,
  filters,
  setFilter,
  availableFilters,
  resultCounts,
}) => {
  const [activeFilter, setActiveFilter] = useState<string>("genres");
  const [language, setLanguage] = useState("EN");

  // Remove local state for availableFilters and resultCounts
  // const [availableFilters, setAvailableFilters] = useState<...>(...);
  // const [resultCounts, setResultCounts] = useState<...>(...);

  // Remove fetchAvailableOptions and useEffect from FilterMenu

  // Handle when a user clicks on a filter item
  const handleSubItemClick = (filterType: string, itemName: string) => {
    const newFilters = structuredClone(filters);
    newFilters[filterType] ??= new Set();

    if (newFilters[filterType].has(itemName)) {
      newFilters[filterType].delete(itemName);
    } else {
      newFilters[filterType].add(itemName);
    }

    setFilter(newFilters);
  };

  // Clear all selected filters
  const handleClearAll = () => {
    setFilter({});
  };

const translations: Record<string, Record<string, string>> = {
  EN: {
    artist_original: "Artist",
    genres: "Genre",
    instruments: "Instrument",
    record_label: "Label",
    regions: "Region",
  },
  HY: {
    artist_original: "Արտիստ",
    genres: "Ժանր",
    instruments: "Նվագարան",
    record_label: "Պիտակ",
    regions: "Մարզ",
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

      {/* Render the active filter's options */}
      {activeFilter === "genres" && (
        <ul className="sub-list-hm active" id="list-genres-hm">
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

      {activeFilter === "instruments" && (
        <ul className="sub-list-hm active" id="list-instruments-hm">
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

      {activeFilter === "regions" && (
        <ul className="sub-list-hm active" id="list-regions-hm">
          {regions.map((region) => (
            <li
              key={region}
              className={`${
                availableFilters.regions.has(region) ? "" : "disabled"
              } ${filters.regions?.has(region) ? "active" : ""}`}
              data-item={region}
              onClick={() =>
                availableFilters.regions.has(region) && handleSubItemClick("regions", region)
              }
            >
              <span className="icon-circle-hm"></span>
              {`${region} (${resultCounts[region] || 0})`}
            </li>
          ))}
        </ul>
      )}

      {activeFilter === "artist_original" && (
        <ul className="sub-list-hm active" id="list-artist_original-hm">
          {artists.map((artist) => (
            <li
              key={artist}
              className={`${
                availableFilters.artists.has(artist) ? "" : "disabled"
              } ${filters.artist_original?.has(artist) ? "active" : ""}`}
              data-item={artist}
              onClick={() =>
                availableFilters.artists.has(artist) &&
                handleSubItemClick("artist_original", artist)
              }
            >
              <span className="icon-circle-hm"></span>
              {`${artist} (${resultCounts[artist] || 0})`}
            </li>
          ))}
        </ul>
      )}

{activeFilter === "record_label" && (
    <ul className="sub-list-hm active" id="list-record_label-hm">
      {labels.map((label) => (
        <li
          key={label.id}
          className={`${
            availableFilters.record_label.has(label.name) ? "" : "disabled"
          } ${filters.record_label?.has(label.name) ? "active" : ""}`}
          data-item={label.name}
          onClick={() =>
            availableFilters.record_label.has(label.name) &&
            handleSubItemClick("record_label", label.name)
          }
        >
          <span className="icon-circle-hm"></span>
          {`${label.name} (${resultCounts[label.name] || 0})`}
        </li>
      ))}
    </ul>
  )}
    </div>
  );
};

export default FilterMenu;
