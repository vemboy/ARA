"use client";
export const dynamic = "force-dynamic";

import React from "react";
import { Dispatch, SetStateAction } from "react";

/** Adjust the artists type so we expect an array of objects
 *  coming from the "artists" Directus collection.
 */
interface ArtistType {
  id: string;
  artist_name: string;
  artist_name_armenian?: string | null;
}

interface FilterMenuProps {
  genres: string[];
  instruments: string[];
  regions: string[];
  /** artists is now an array of objects from your "artists" collection. */
  artists: ArtistType[];
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
  language: string;

  activeFilter: string | null;
  setActiveFilter: Dispatch<SetStateAction<string | null>>;
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
  language,
  activeFilter,
  setActiveFilter,
}) => {
  // Translations for menu titles
  const translations: Record<string, Record<string, string>> = {
    EN: {
      artist_original: "Artist",
      genres: "Genre",
      instruments: "Instrument",
      record_label: "Label",
      regions: "Region",
      clear_all: "Clear All",
    },
    HY: {
      artist_original: "Արտիստ",
      genres: "Ժանր",
      instruments: "Նվագարան",
      record_label: "Պիտակ",
      regions: "Մարզ",
      clear_all: "Մաքրել բոլորը",
    },
  };

  /** Helper for other filters that store translations in a single string,
   *  e.g. "Folk-|-Ժողովրդական"
   *  But we'll keep it here since genres/instruments/regions might rely on it.
   */
  const getLocalizedName = (item: string | null | undefined) => {
    if (item == null) return "Unknown";

    const itemStr = String(item);
    if (!itemStr.includes("-|-")) return itemStr;

    const [english, armenian] = itemStr.split("-|-");
    return language === "EN" ? english : armenian;
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

  /** Controls the order the filter tabs appear in the UI */
  const filterOrder = [
    "genres",
    "instruments",
    "record_label",
    "regions",
    "artist_original",
  ];

  /** Renders an array of string items (for genres, instruments, etc.).
   *  We keep this for all filter types EXCEPT "artist_original" below.
   */
  const renderFilterItems = (items: string[], filterType: string) => {
    return items.map((item) => {
      // If "filterType" is "artist_original", we won't even call this.
      // Otherwise, we do the usual logic:
      const filterTypeValidated =
        filterType === "artist_original" ? "artists" : filterType;
      const isAvailable =
        availableFilters[
          filterTypeValidated as keyof typeof availableFilters
        ].has(item);

      const isActive =
        filters[filterType] &&
        typeof filters[filterType].has === "function" &&
        filters[filterType].has(item);

      return (
        <div
          key={item}
          className={`filter-item ${isAvailable ? "" : "disabled"} ${
            isActive ? "active" : ""
          }`}
          onClick={() => isAvailable && handleSubItemClick(filterType, item)}
        >
          <span className="ara-filter-icon-circle"></span>
          {getLocalizedName(item)} ({resultCounts[item] || 0})
        </div>
      );
    });
  };

  return (
    <>
      {/* Filter Tabs */}
      <div className="ara-filter-options-wrapper">
        {filterOrder.map((fKey) => (
          <div
            key={fKey}
            className={`ara-filter-option ${
              activeFilter === fKey ? "selected" : ""
            }`}
            data-filter={fKey}
            onClick={() => setActiveFilter(fKey)}
          >
            {translations[language][fKey]}
          </div>
        ))}
      </div>

      {/* Filter Items */}
      <div className="ara-filter-items-wrapper">
        {activeFilter === "genres" && (
          <div className="ara-filter-items ara-filter-items-selected" data-filter="genre">
            {renderFilterItems(genres, "genres")}
          </div>
        )}

        {activeFilter === "instruments" && (
          <div className="ara-filter-items" data-filter="instrument">
            {renderFilterItems(instruments, "instruments")}
          </div>
        )}

        {activeFilter === "record_label" && (
          <div className="ara-filter-items" data-filter="label">
            {labels.map((label) => {
              const isAvailable = availableFilters.record_label.has(label.label_en);
              const isActive =
                filters.record_label &&
                typeof filters.record_label.has === "function" &&
                filters.record_label.has(label.label_en);

              return (
                <div
                  key={label.id}
                  className={`filter-item ${isAvailable ? "" : "disabled"} ${
                    isActive ? "active" : ""
                  }`}
                  onClick={() =>
                    isAvailable &&
                    handleSubItemClick("record_label", label.label_en)
                  }
                >
                  <span className="ara-filter-icon-circle"></span>
                  {label.label_en} ({resultCounts[label.label_en] || 0})
                </div>
              );
            })}
          </div>
        )}

        {activeFilter === "regions" && (
          <div className="ara-filter-items" data-filter="region">
            {renderFilterItems(regions, "regions")}
          </div>
        )}

        {/* NEW: Updated artist filter block using the "artists" array of objects */}
        {activeFilter === "artist_original" && (
          <div className="ara-filter-items" data-filter="artist">
            {artists.map((artist) => {
              // We'll filter on the English name (artist_name),
              // because that's what we expect to match ._icontains on record_archive.artist_original
              const englishName = (artist.artist_name ?? "").trim();


              // If the record data is "Haig Ohanian", then "englishName" should match that text.
              // Check if available in the filtered results:
              const isAvailable = availableFilters.artists.has(englishName);

              const isActive =
                filters.artist_original &&
                typeof filters.artist_original.has === "function" &&
                filters.artist_original.has(englishName);

              // For display in the UI, respect the language switch:
              const displayedName =
                language === "EN"
                  ? artist.artist_name
                  : artist.artist_name_armenian || artist.artist_name;

              // Show a result count:
              const count = resultCounts[englishName] || 0;

              return (
                <div
                  key={artist.id}
                  className={`filter-item ${isAvailable ? "" : "disabled"} ${
                    isActive ? "active" : ""
                  }`}
                  onClick={() =>
                    isAvailable && handleSubItemClick("artist_original", englishName)
                  }
                >
                  <span className="ara-filter-icon-circle"></span>
                  {displayedName} ({count})
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Show selected filters + a "clear all" link, if any filters are active */}
      {Object.keys(filters).length > 0 && (
        <div style={{ marginTop: "10px" }}>
          <div className="selected-filters-container">
            {Object.entries(filters).flatMap(([filterType, selectedItems]) =>
              Array.from(selectedItems).map((item) => (
                <span className="filter-item" key={item}>
                  {getLocalizedName(item)}
                  <button
                    onClick={(e: React.MouseEvent) => {
                      e.preventDefault();
                      handleSubItemClick(filterType, item);
                    }}
                  >
                    ×
                  </button>
                </span>
              ))
            )}
          </div>

          <div
            onClick={(e: React.MouseEvent) => {
              e.preventDefault();
              handleClearAll();
            }}
            style={{
              marginLeft: "10px",
              textDecoration: "underline",
              cursor: "pointer",
            }}
          >
            {translations[language].clear_all}
          </div>
        </div>
      )}
    </>
  );
};

export default FilterMenu;
