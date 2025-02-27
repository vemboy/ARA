"use client";
export const dynamic = "force-dynamic";
import React from "react";
import { Dispatch, SetStateAction } from "react";

interface ArtistType {
  id: string;
  artist_name: string;
  artist_name_armenian?: string | null;
}

interface FilterMenuProps {
  genres: string[];
  instruments: string[];
  regions: string[];
  artists: ArtistType[];
  labels: any[];
  labelIdToNameMap: { [key: string]: string };
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

  const getLocalizedName = (item: string | null | undefined) => {
    if (!item) return "Unknown";
    const itemStr = String(item);
    if (!itemStr.includes("-|-")) return itemStr;
    const parts = itemStr.split("-|-");
    return language === "EN" ? parts[0] : parts[1] || parts[0];
  };

  const handleItemClick = (filterType: string, itemName: string) => {
    setIncludedFilters((prev) => {
      const next = structuredClone(prev);
      next[filterType] ??= new Set();
      if (next[filterType].has(itemName)) {
        next[filterType].delete(itemName);
      } else {
        setExcludedFilters((prevEx) => {
          const exCopy = structuredClone(prevEx);
          exCopy[filterType]?.delete(itemName);
          return exCopy;
        });
        next[filterType].add(itemName);
      }
      return next;
    });
  };

  const handleItemDoubleClick = (filterType: string, itemName: string) => {
    setExcludedFilters((prev) => {
      const next = structuredClone(prev);
      next[filterType] ??= new Set();
      if (next[filterType].has(itemName)) {
        next[filterType].delete(itemName);
      } else {
        setIncludedFilters((prevInc) => {
          const incCopy = structuredClone(prevInc);
          incCopy[filterType]?.delete(itemName);
          return incCopy;
        });
        next[filterType].add(itemName);
      }
      return next;
    });
  };

  const handleClearAll = () => {
    setIncludedFilters({});
    setExcludedFilters({});
  };

  const instrumentGroupings: { [group: string]: string[] } = {
    "String (plucked)": ["banjo", "kamancha", "mandoline", "oud", "tanbur", "tar", "qanun"],
    "String (bowed)": ["cello", "keman", "violin"],
    "Percussion": ["daf", "darabuka", "dhol", "drum", "dumbeg", "tambourine", "tam-tam"],
    "Keyboard": ["organ", "piano"],
    "Wind": ["clarinet", "duduk", "flute"],
  };

  const handleGroupClick = (filterType: string, groupItems: string[]) => {
    setIncludedFilters((prev) => {
      const next = structuredClone(prev);
      next[filterType] ??= new Set();
      const allIncluded = groupItems.every((item) => next[filterType].has(item));
      if (allIncluded) {
        groupItems.forEach((item) => next[filterType].delete(item));
      } else {
        setExcludedFilters((prevEx) => {
          const exCopy = structuredClone(prevEx);
          groupItems.forEach((item) => exCopy[filterType]?.delete(item));
          return exCopy;
        });
        groupItems.forEach((item) => next[filterType].add(item));
      }
      return next;
    });
  };

  const handleGroupDoubleClick = (filterType: string, groupItems: string[]) => {
    setExcludedFilters((prev) => {
      const next = structuredClone(prev);
      next[filterType] ??= new Set();
      const allExcluded = groupItems.every((item) => next[filterType].has(item));
      if (allExcluded) {
        groupItems.forEach((item) => next[filterType].delete(item));
      } else {
        setIncludedFilters((prevInc) => {
          const incCopy = structuredClone(prevInc);
          groupItems.forEach((item) => incCopy[filterType]?.delete(item));
          return incCopy;
        });
        groupItems.forEach((item) => next[filterType].add(item));
      }
      return next;
    });
  };

  const renderFilterItems = (items: string[], filterType: string) => {
    let sortedItems: string[];
    if (filterType === "regions") {
      const regionOrder: { [region: string]: number } = {
        "North America": 1,
        "South America": 2,
        "Europe": 3,
        "Soviet Union": 4,
      };
      sortedItems = [...items]
        .map((item) => item.trim())
        .sort((a, b) => {
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
      sortedItems = [...items].sort((a, b) => a.localeCompare(b));
    }
    return sortedItems.map((item) => {
      const filterKey = filterType === "artist_original" ? "artists" : filterType;
      const isAvailable = availableFilters[filterKey as keyof typeof availableFilters].has(item);
      const isIncluded = includedFilters[filterType]?.has(item) ?? false;
      const isExcluded = excludedFilters[filterType]?.has(item) ?? false;
      let className = "filter-item";
      if (!isAvailable) className += " disabled";
      if (isIncluded) className += " active";
      if (isExcluded) className += " excluded";
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
      <div className="ara-filter-options-wrapper">
        {["genres", "instruments", "record_label", "regions", "artist_original"].map((fKey) => (
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
          <div className="ara-filter-items" data-filter="genre">
            {renderFilterItems(genres, "genres")}
          </div>
        )}

        {activeFilter === "instruments" && (
          <div className="ara-filter-items instrument-groups" data-filter="instrument">
            {Object.entries(instrumentGroupings).map(([groupHeader, groupItemsLower]) => {
              const groupItems = instruments.filter((inst) => {
                const eng = inst.split("-|-")[0].trim().toLowerCase();
                return groupItemsLower.includes(eng);
              });
              if (groupItems.length === 0) return null;
              const groupCount = groupItems.reduce(
                (sum, item) => sum + (resultCounts[item] || 0),
                0
              );
              return (
                <div key={groupHeader} className="instrument-group-column">
                  <div
                    className="filter-group-header"
                    onClick={() => handleGroupClick("instruments", groupItems)}
                    onDoubleClick={() => handleGroupDoubleClick("instruments", groupItems)}
                    style={{ fontWeight: "bold", marginBottom: "0.5rem", cursor: "pointer" }}
                  >
                    {groupHeader} ({groupCount})
                  </div>
                  <div className="group-items">
                    {groupItems.map((item) => {
                      const isAvailable = availableFilters["instruments"].has(item);
                      const isIncluded = includedFilters["instruments"]?.has(item) ?? false;
                      const isExcluded = excludedFilters["instruments"]?.has(item) ?? false;
                      let className = "filter-item";
                      if (!isAvailable) className += " disabled";
                      if (isIncluded) className += " active";
                      if (isExcluded) className += " excluded";
                      return (
                        <div
                          key={item}
                          className={className}
                          onClick={() => isAvailable && handleItemClick("instruments", item)}
                          onDoubleClick={() =>
                            isAvailable && handleItemDoubleClick("instruments", item)
                          }
                        >
                          <span className="ara-filter-icon-circle"></span>
                          {getLocalizedName(item)} ({resultCounts[item] || 0})
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {activeFilter === "record_label" && (
          <div className="ara-filter-items" data-filter="label">
            {[...labels]
              .sort((a, b) => a.label_en.localeCompare(b.label_en))
              .map((label) => {
                const labelName = label.label_en;
                const isAvailable = availableFilters.record_label.has(labelName);
                const isIncluded = includedFilters.record_label?.has(labelName) ?? false;
                const isExcluded = excludedFilters.record_label?.has(labelName) ?? false;
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
              const englishName = artist.artist_name?.trim() || "";
              const isAvailable = availableFilters.artists.has(englishName);
              const isIncluded = includedFilters.artist_original?.has(englishName) ?? false;
              const isExcluded = excludedFilters.artist_original?.has(englishName) ?? false;
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
                    isAvailable && handleItemClick("artist_original", englishName)
                  }
                  onDoubleClick={() =>
                    isAvailable && handleItemDoubleClick("artist_original", englishName)
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

      {(Object.values(includedFilters).some((set) => set.size > 0) ||
        Object.values(excludedFilters).some((set) => set.size > 0)) && (
        <div style={{ marginTop: "10px" }}>
          <div className="selected-filters-container">
            {Object.entries(includedFilters).flatMap(([fType, items]) =>
              Array.from(items).map((item) => (
                <span
                  className="filter-item active"
                  key={`inc-${fType}-${item}`}
                  onClick={(e) => {
                    e.preventDefault();
                    setIncludedFilters((prev) => {
                      const copy = structuredClone(prev);
                      copy[fType]?.delete(item);
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
            {Object.entries(excludedFilters).flatMap(([fType, items]) =>
              Array.from(items).map((item) => (
                <span className="filter-item excluded" key={`ex-${fType}-${item}`}>
                  {getLocalizedName(item)}
                  <button
                    onClick={(e: React.MouseEvent) => {
                      e.preventDefault();
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
            style={{ marginLeft: "10px", textDecoration: "underline", cursor: "pointer" }}
          >
            {translations[language].clear_all}
          </div>
        </div>
      )}
    </>
  );
};

export default FilterMenu;
