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

  const handleClearAll = () => {
    setFilter({});
  };

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
        {activeFilter === "genres" && (
          <div className="ara-filter-items ara-filter-items-selected" data-filter="genre">
            {genres.map((genre) => (
              <div
                key={genre}
                className={`filter-item ${availableFilters.genres.has(genre) ? "" : "disabled"} ${
                  filters.genres?.has(genre) ? "active" : ""
                }`}
                onClick={() => availableFilters.genres.has(genre) && handleSubItemClick("genres", genre)}
              >
                <span className="ara-filter-icon-circle"></span> {genre} ({resultCounts[genre] || 0})
              </div>
            ))}
          </div>
        )}

        {activeFilter === "instruments" && (
          <div className="ara-filter-items" data-filter="instrument">
            {instruments.map((instrument) => (
              <div
                key={instrument}
                className={`filter-item ${availableFilters.instruments.has(instrument) ? "" : "disabled"} ${
                  filters.instruments?.has(instrument) ? "active" : ""
                }`}
                onClick={() =>
                  availableFilters.instruments.has(instrument) && handleSubItemClick("instruments", instrument)
                }
              >
                <span className="ara-filter-icon-circle"></span> {instrument} ({resultCounts[instrument] || 0})
              </div>
            ))}
          </div>
        )}

        {activeFilter === "record_label" && (
          <div className="ara-filter-items" data-filter="label">
            {labels.map((label) => (
              <div
                key={label.id}
                className={`filter-item ${
                  availableFilters.record_label.has(label.label_en) ? "" : "disabled"
                } ${filters.record_label?.has(label.label_en) ? "active" : ""}`}
                onClick={() =>
                  availableFilters.record_label.has(label.label_en) &&
                  handleSubItemClick("record_label", label.label_en)
                }
              >
                <span className="ara-filter-icon-circle"></span> {label.label_en} ({resultCounts[label.label_en] || 0})
              </div>
            ))}
          </div>
        )}

        {activeFilter === "regions" && (
          <div className="ara-filter-items" data-filter="region">
            {regions.map((region) => (
              <div
                key={region}
                className={`filter-item ${availableFilters.regions.has(region) ? "" : "disabled"} ${
                  filters.regions?.has(region) ? "active" : ""
                }`}
                onClick={() => availableFilters.regions.has(region) && handleSubItemClick("regions", region)}
              >
                <span className="ara-filter-icon-circle"></span> {region} ({resultCounts[region] || 0})
              </div>
            ))}
          </div>
        )}

        {activeFilter === "artist_original" && (
          <div className="ara-filter-items" data-filter="artist">
            {artists.map((artist) => (
              <div
                key={artist}
                className={`filter-item ${availableFilters.artists.has(artist) ? "" : "disabled"} ${
                  filters.artist_original?.has(artist) ? "active" : ""
                }`}
                onClick={() => availableFilters.artists.has(artist) && handleSubItemClick("artist_original", artist)}
              >
                <span className="ara-filter-icon-circle"></span> {artist} ({resultCounts[artist] || 0})
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Selected Filters and Clear All */}
      <div style={{ marginTop: "10px" }}>
        {Object.entries(filters).flatMap(([filterType, selectedItems]) =>
          Array.from(selectedItems).map((item) => (
            <span className="filter-item" key={item} style={{ fontWeight: "bold" }}>
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
