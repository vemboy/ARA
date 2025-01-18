"use client";

// filter-menu.js
import React, { useState } from "react";

interface FilterMenuProps {
  genres: string[];
  instruments: string[];
  regions: string[];
  artists: string[];
  labels: any[];
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
  language: string; // now receive language from parent
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
  language
}) => {
  const [activeFilter, setActiveFilter] = useState<string>("genres");

  // Translations object (English/Armenian)
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

  /** Toggle one item in the filter set */
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

  /** Clears all selected filters */
  const handleClearAll = () => {
    setFilter({});
  };

  /** The menu items in top row (genres, instruments, label, regions, artist) */
  const filterOrder = ["genres", "instruments", "record_label", "regions", "artist_original"];

  return (
    <>
      <div className="ara-filter-options-wrapper">
        {filterOrder.map((fKey) => (
          <div
            key={fKey}
            className={`ara-filter-option ${activeFilter === fKey ? "selected" : ""}`}
            data-filter={fKey}
            onClick={() => setActiveFilter(fKey)}
          >
            {translations[language][fKey]}
          </div>
        ))}
      </div>

      <div className="ara-filter-items-wrapper">
        {/* GENRES */}
        {activeFilter === "genres" && (
          <div className="ara-filter-items ara-filter-items-selected" data-filter="genre">
            {genres.map((genre) => {
              const isAvailable = availableFilters.genres.has(genre);
              const isActive = filters.genres?.has(genre);
              return (
                <div
                  key={genre}
                  className={`filter-item ${isAvailable ? "" : "disabled"} ${isActive ? "active" : ""}`}
                  onClick={() => isAvailable && handleSubItemClick("genres", genre)}
                >
                  <span className="ara-filter-icon-circle"></span> 
                  {genre} ({resultCounts[genre] || 0})
                </div>
              );
            })}
          </div>
        )}

        {/* INSTRUMENTS */}
        {activeFilter === "instruments" && (
          <div className="ara-filter-items" data-filter="instrument">
            {instruments.map((instrument) => {
              const isAvailable = availableFilters.instruments.has(instrument);
              const isActive = filters.instruments?.has(instrument);
              return (
                <div
                  key={instrument}
                  className={`filter-item ${isAvailable ? "" : "disabled"} ${isActive ? "active" : ""}`}
                  onClick={() => isAvailable && handleSubItemClick("instruments", instrument)}
                >
                  <span className="ara-filter-icon-circle"></span> 
                  {instrument} ({resultCounts[instrument] || 0})
                </div>
              );
            })}
          </div>
        )}

        {/* RECORD LABEL */}
        {activeFilter === "record_label" && (
          <div className="ara-filter-items" data-filter="label">
            {labels.map((label) => {
              const isAvailable = availableFilters.record_label.has(label.label_en);
              const isActive = filters.record_label?.has(label.label_en);
              return (
                <div
                  key={label.id}
                  className={`filter-item ${isAvailable ? "" : "disabled"} ${isActive ? "active" : ""}`}
                  onClick={() => isAvailable && handleSubItemClick("record_label", label.label_en)}
                >
                  <span className="ara-filter-icon-circle"></span> 
                  {label.label_en} ({resultCounts[label.label_en] || 0})
                </div>
              );
            })}
          </div>
        )}

        {/* REGIONS */}
        {activeFilter === "regions" && (
          <div className="ara-filter-items" data-filter="region">
            {regions.map((region) => {
              const isAvailable = availableFilters.regions.has(region);
              const isActive = filters.regions?.has(region);
              return (
                <div
                  key={region}
                  className={`filter-item ${isAvailable ? "" : "disabled"} ${isActive ? "active" : ""}`}
                  onClick={() => isAvailable && handleSubItemClick("regions", region)}
                >
                  <span className="ara-filter-icon-circle"></span> 
                  {region} ({resultCounts[region] || 0})
                </div>
              );
            })}
          </div>
        )}

        {/* ARTIST ORIGINAL */}
        {activeFilter === "artist_original" && (
          <div className="ara-filter-items" data-filter="artist">
            {artists.map((artist) => {
              const isAvailable = availableFilters.artists.has(artist);
              const isActive = filters.artist_original?.has(artist);
              return (
                <div
                  key={artist}
                  className={`filter-item ${isAvailable ? "" : "disabled"} ${isActive ? "active" : ""}`}
                  onClick={() => isAvailable && handleSubItemClick("artist_original", artist)}
                >
                  <span className="ara-filter-icon-circle"></span> 
                  {artist} ({resultCounts[artist] || 0})
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Currently selected items + 'Clear All' link */}
      <div style={{ marginTop: "10px" }}>
        {Object.entries(filters).flatMap(([filterType, selectedItems]) =>
          Array.from(selectedItems).map((item) => (
            <span 
              className="filter-item" 
              key={item} 
              style={{ fontWeight: "bold", marginRight: "5px" }}
            >
              {item}
              <button
                style={{ marginLeft: "5px" }}
                onClick={() => handleSubItemClick(filterType, item)}
              >
                ×
              </button>
            </span>
          ))
        )}

        {/* Show Clear All only if we have some filters selected */}
        {Object.keys(filters).length > 0 && (
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handleClearAll();
            }}
            style={{ marginLeft: "10px", textDecoration: "underline", cursor: "pointer" }}
          >
            Clear All
          </a>
        )}
      </div>
    </>
  );
};

export default FilterMenu;
