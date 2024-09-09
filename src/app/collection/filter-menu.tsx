import React, { useState } from "react";

interface FilterMenuProps {
  genres: string[];
  instruments: string[];
  filters: { [key: string]: Set<string> }; // Pass down the filters state
  setFilter: React.Dispatch<React.SetStateAction<{ [key: string]: Set<string> }>>; // Use setFilter from the main component
}

const FilterMenu: React.FC<FilterMenuProps> = ({
  genres,
  instruments,
  filters,
  setFilter,
}) => {
  const [activeFilter, setActiveFilter] = useState<string>("genre"); // Default to "genre"
  const [language, setLanguage] = useState("EN");

  const handleFilterClick = (filterType: string) => {
    setActiveFilter(filterType);
  };

  const handleSubItemClick = (filterType: string, itemName: string) => {
    const newFilters = structuredClone(filters);
    newFilters[filterType] ??= new Set();

    if (newFilters[filterType].has(itemName)) {
      newFilters[filterType].delete(itemName);
    } else {
      newFilters[filterType].add(itemName);
    }

    setFilter(newFilters); // Use the setFilter from props
  };

  const handleClearAll = () => {
    setFilter({}); // Clear all selected filters
  };

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
            className={`filter-item-hm ${
              activeFilter === filterKey ? "active" : ""
            }`}
            data-filter={filterKey}
            onClick={() => handleFilterClick(filterKey)}
          >
            {filterName}
          </div>
        ))}
      </div>

      {/* Pills for selected filters */}
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

      {/* Sub Grids */}
      {activeFilter === "genre" && (
        <ul className="sub-list-hm active" id="list-genre-hm">
          {genres.map((genre) => (
            <li
              key={genre}
              className={`${filters.genres?.has(genre) ? "active" : ""}`}
              data-item={genre}
              onClick={() => handleSubItemClick("genres", genre)}
            >
              <span className="icon-circle-hm"></span>
              {genre}
            </li>
          ))}
        </ul>
      )}

      {activeFilter === "instrument" && (
        <ul className="sub-list-hm active" id="list-instrument-hm">
          {instruments.map((instrument) => (
            <li
              key={instrument}
              className={`${filters.instruments?.has(instrument) ? "active" : ""}`}
              data-item={instrument}
              onClick={() => handleSubItemClick("instruments", instrument)}
            >
              <span className="icon-circle-hm"></span>
              {instrument}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FilterMenu;
