// filter-menu.tsx
"use client";
export const dynamic = "force-dynamic";

import React from "react";
import { Dispatch, SetStateAction } from "react";

/** Artist type from your Directus "artists" table. */
interface ArtistType {
  id: string;
  artist_name: string;
  artist_name_armenian?: string | null;
}

/**
 * Props for the FilterMenu
 */
interface FilterMenuProps {
  genres: string[];
  instruments: string[];
  regions: string[];
  artists: ArtistType[];
  labels: any[];
  labelIdToNameMap: { [key: string]: string };

  // Instead of a single "filters", we now have 2 sets:
  includedFilters: { [key: string]: Set<string> };
  setIncludedFilters: React.Dispatch<React.SetStateAction<{ [key: string]: Set<string> }>>;
  excludedFilters: { [key: string]: Set<string> };
  setExcludedFilters: React.Dispatch<React.SetStateAction<{ [key: string]: Set<string> }>>;

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
  includedFilters,
  setIncludedFilters,
  excludedFilters,
  setExcludedFilters,
  availableFilters,
  resultCounts,
  language,
  activeFilter,
  setActiveFilter,
}) => {
  // Simple translations for tab labels
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
      artist_original: "Երաժիշտ",
      genres: "Ոճ",
      instruments: "Նուագարան",
      record_label: "Պիտակ",
      regions: "Շրջան",
      clear_all: "Մաքրել բոլորը",
    },
  };

  /**
   * Helper to show either English or Armenian if the string is in "english-|-armenian" format
   */
  const getLocalizedName = (item: string | null | undefined) => {
    if (!item) return "Unknown";
    const itemStr = String(item);
    if (!itemStr.includes("-|-")) return itemStr;
    const [english, armenian] = itemStr.split("-|-");
    return language === "EN" ? english : armenian;
  };

  /**
   * Single-click => toggle "included"
   * Double-click => toggle "excluded"
   */

  // Single-click
  const handleItemClick = (filterType: string, itemName: string) => {
    // We remove from "excluded" if present, then toggle in "included"
    setIncludedFilters((prev) => {
      const next = structuredClone(prev);
      next[filterType] ??= new Set();

      // If already in included, remove it
      if (next[filterType].has(itemName)) {
        next[filterType].delete(itemName);
      } else {
        // Also remove from excluded set if it’s present there
        setExcludedFilters((prevEx) => {
          const exCopy = structuredClone(prevEx);
          exCopy[filterType]?.delete(itemName);
          return exCopy;
        });
        // Add to included
        next[filterType].add(itemName);
      }
      return next;
    });
  };

  // Double-click
  const handleItemDoubleClick = (filterType: string, itemName: string) => {
    // We remove from "included" if present, then toggle in "excluded"
    setExcludedFilters((prev) => {
      const next = structuredClone(prev);
      next[filterType] ??= new Set();

      // If already in excluded, remove it
      if (next[filterType].has(itemName)) {
        next[filterType].delete(itemName);
      } else {
        // Also remove from included if it’s there
        setIncludedFilters((prevInc) => {
          const incCopy = structuredClone(prevInc);
          incCopy[filterType]?.delete(itemName);
          return incCopy;
        });
        // Add to excluded
        next[filterType].add(itemName);
      }
      return next;
    });
  };

  /** Clears all filters */
  const handleClearAll = () => {
    setIncludedFilters({});
    setExcludedFilters({});
  };

  /** The order in which filter tabs are shown */
  const filterOrder = [
    "genres",
    "instruments",
    "record_label",
    "regions",
    "artist_original",
  ];

  /**
   * For typical array-based filter items (genres, instruments, regions).
   * We'll apply the correct classes for "active" (included) or "excluded".
   * We'll also handle "disabled" if not in availableFilters set.
   */

  const hasActiveIncluded = Object.values(includedFilters).some(
  (set) => set.size > 0
);
const hasActiveExcluded = Object.values(excludedFilters).some(
  (set) => set.size > 0
);

const renderFilterItems = (items: string[], filterType: string) => {
  let sortedItems: string[];
  
  // Special handling for regions - west to east geographical order
if (filterType === "regions") {
  const regionOrder = {
    "North America": 1,
    "South America": 2,
    "Europe": 3,
    "Soviet Union": 4,
  };

  sortedItems = [...items].map(item => item.trim()).sort((a, b) => {
    let aOrder = 999;
    let bOrder = 999;

    for (const [region, order] of Object.entries(regionOrder)) {
      if (a.toLowerCase().includes(region.toLowerCase())) {
        aOrder = order;
        break;
      }
    }
    for (const [region, order] of Object.entries(regionOrder)) {
      if (b.toLowerCase().includes(region.toLowerCase())) {
        bOrder = order;
        break;
      }
    }

    if (aOrder !== bOrder) {
      return aOrder - bOrder;
    }
    return a.localeCompare(b);
  });
} else {
    // For other filter types, just sort alphabetically
    sortedItems = [...items].sort((a, b) => a.localeCompare(b));
  }
  
  // Render filter items
  return sortedItems.map((item) => {
    const filterKey =
      filterType === "artist_original" ? "artists" : filterType;
    const isAvailable =
      availableFilters[filterKey as keyof typeof availableFilters].has(item);

    const isIncluded = includedFilters[filterType]?.has(item) ?? false;
    const isExcluded = excludedFilters[filterType]?.has(item) ?? false;

    let className = "filter-item";
    if (!isAvailable) {
      className += " disabled";
    }
    if (isIncluded) {
      className += " active";
    }
    if (isExcluded) {
      className += " excluded";
    }

    return (
      <div
        key={item}
        className={className}
        onClick={() => isAvailable && handleItemClick(filterType, item)}
        onDoubleClick={() => isAvailable && handleItemDoubleClick(filterType, item)}
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
            className={`ara-filter-option ${activeFilter === fKey ? "selected" : ""}`}
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
          <div className="ara-filter-items" data-filter="genre">
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
    {[...labels]
      .sort((a, b) => a.label_en.localeCompare(b.label_en))
      .map((label) => {
        const labelName = label.label_en;
        const isAvailable = availableFilters.record_label.has(labelName);
        const isIncluded =
          includedFilters.record_label?.has(labelName) ?? false;
        const isExcluded =
          excludedFilters.record_label?.has(labelName) ?? false;

        let className = "filter-item";
        if (!isAvailable) className += " disabled";
        if (isIncluded) className += " active";
        if (isExcluded) className += " excluded";

        return (
          <div
            key={label.id}
            className={className}
            onClick={() => isAvailable && handleItemClick("record_label", labelName)}
            onDoubleClick={() =>
              isAvailable && handleItemDoubleClick("record_label", labelName)
            }
          >
            <span className="ara-filter-icon-circle"></span>
            {labelName} ({resultCounts[labelName] || 0})
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

        {activeFilter === "artist_original" && (
          <div className="ara-filter-items" data-filter="artist">
            {artists.map((artist) => {
              // We'll match rec.artist_original vs. artist.artist_name
              const englishName = artist.artist_name?.trim() || "";
              const isAvailable = availableFilters.artists.has(englishName);

              const isIncluded =
                includedFilters.artist_original?.has(englishName) ?? false;
              const isExcluded =
                excludedFilters.artist_original?.has(englishName) ?? false;

              let className = "filter-item";
              if (!isAvailable) className += " disabled";
              if (isIncluded) className += " active";
              if (isExcluded) className += " excluded";

              const displayedName =
                language === "EN"
                  ? artist.artist_name
                  : artist.artist_name_armenian || artist.artist_name;

              const count = resultCounts[englishName] || 0;

              return (
                <div
                  key={artist.id}
                  className={className}
                  onClick={() =>
                    isAvailable &&
                    handleItemClick("artist_original", englishName)
                  }
                  onDoubleClick={() =>
                    isAvailable &&
                    handleItemDoubleClick("artist_original", englishName)
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

      {/* Show selected filters + "Clear All" link if anything is set */}
      {(hasActiveIncluded || hasActiveExcluded) && (
        <div style={{ marginTop: "10px" }}>
          {/* Included pills */}
          <div className="selected-filters-container">
            {Object.entries(includedFilters).flatMap(([fType, items]) =>
              Array.from(items).map((item) => (
                <span
                  className="filter-item active"
                  key={`inc-${fType}-${item}`}
                  onClick={(e) => {
                    e.preventDefault(); // Prevent default link/text selection
                    setIncludedFilters((prev) => {
                      const copy = structuredClone(prev);
                      copy[fType]?.delete(item);
                      // If that set is now empty, remove the key completely (optional):
                      if (copy[fType] && copy[fType].size === 0) {
                        delete copy[fType];
                      }
                      return copy;
                    });
                  }}
                  style={{ cursor: "pointer" }}
                >
                  {getLocalizedName(item)}
                  <span style={{ marginLeft: "0.3rem" }}>×</span>
                </span>
              ))
            )}

            {/* Excluded pills */}
            {Object.entries(excludedFilters).flatMap(([fType, items]) =>
              Array.from(items).map((item) => (
                <span className="filter-item excluded" key={`ex-${fType}-${item}`}>
                  {getLocalizedName(item)}
                  <button
                    onClick={(e: React.MouseEvent) => {
                      e.preventDefault();
                      // remove from excluded
                      setExcludedFilters((prev) => {
                        const copy = structuredClone(prev);
                        copy[fType]?.delete(item);
                        return copy;
                      });
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
