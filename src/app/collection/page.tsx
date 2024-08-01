"use client";

import Head from "next/head";
import React, { useState, useEffect } from "react";
import axios from "axios";
import RecordCollectionRow from "./record-collection-row";
import RecordCollectionRowDifferent from "./record-collection-row-different";
import RecordListView from "./record-list-view";
import PageNumbers from "./page-numbers";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import { AudioContext } from "../audioLayout";
import Link from "next/link";

interface FilterProp {
  buttonName: string;
  filterName: string;
  filters: { [key: string]: Set<string> };
  setFilter: React.Dispatch<
    React.SetStateAction<{
      [key: string]: Set<string>;
    }>
  >;
}

function FilterButton(filterProp: FilterProp) {
  const [selected, setSelected] = useState(false);

  const selectFilter = () => {
    const newFilters = structuredClone(filterProp.filters);
    newFilters[filterProp.filterName] ??= new Set();
    if (!selected) {
      newFilters[filterProp.filterName].add(filterProp.buttonName);
    } else {
      newFilters[filterProp.filterName].delete(filterProp.buttonName);
    }
    console.log("New Filters:", newFilters);

    setSelected(!selected);
    filterProp.setFilter(newFilters);
  };

  const buttonClass = selected
    ? "brutalist-button clicked"
    : "brutalist-button";

  return (
    <button
      type="button"
      className={buttonClass}
      key={filterProp.buttonName}
      onClick={selectFilter}
    >
      {filterProp.buttonName}
    </button>
  );
}

export default function Collection() {
  const setSong = React.useContext(AudioContext)?.setSong;
  const audioPlayerRef = React.useContext(AudioContext)?.audioPlayerRef;
  console.log("PAGE:", audioPlayerRef);

  const updateSearchString = (e: any) => {
    console.log("Searching...:", e.target.value);
    setSearchString(e.target.value);
  };

  const [filters, setFilter] = useState<{ [key: string]: Set<string> }>({});

  function getUrlWithFilters() {
    const filterObj = {
      _or: [
        { title: { _icontains: searchString } },
        { title_armenian: { _icontains: searchString } },
        { artist_armenian: { _icontains: searchString } },
        { artist_original: { _icontains: searchString } },
      ],
    };
    const stringifiedFilterObj = JSON.stringify(filterObj);
    console.log("stringifiedFilter", stringifiedFilterObj);
    return searchString.length === 0
      ? "https://ara.directus.app/items/record_archive?limit=12"
      : `https://ara.directus.app/items/record_archive?limit=12&filter=${stringifiedFilterObj}`;
  }

  const nextPage = () => {
    setPage(currentPage + 1);
    const url = getUrlWithFilters();
    axios.get(`${url}&page=${currentPage}`).then((response) => {
      console.log("Hello");
      console.log(response);

      const records = response.data.data.map((record: any) => {
        return {
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
        };
      });

      setRecords(records);
      console.log(records);
    });
  };

  const previousPage = () => {
    console.log(currentPage);
    if (currentPage - 2 > 0) {
      setPage(currentPage - 1);
    } else {
      console.log("At start");
    }
    const url = getUrlWithFilters();
    axios.get(`${url}&page=${currentPage}`).then((response) => {
      console.log("Hello");
      console.log(response);

      const records = response.data.data.map((record: any) => {
        return {
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
        };
      });

      setRecords(records);
      console.log(records);
    });
  };

  const [currentPage, setPage] = useState(2);
  const [records, setRecords] = useState<any[]>([]);
  const [searchString, setSearchString] = useState<string>("");

  useEffect(() => {
    const url = getUrlWithFilters();
    axios.get(url).then((response) => {
      console.log("Hello");
      console.log(response.data.data);
      const amountOfPages = response.data.data.length;

      const records = response.data.data.map((record: any) => {
        return {
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
        };
      });

      setRecords(records);
      console.log(records);
    });
  }, [searchString]);

  return (
    <>
<div className="top-container">
  <div className="left-side">
    {/* Place any content you want here */}
  </div>
  <div className="right-side">
    <div className="menu-container">
      <div className="plumbus-container">
        <div className="zog-box"></div>
        <div className="flibber-group">
          <div className="xenon-item xenon-item-a">
            <div className="quark-circle"></div>
          </div>
          <div className="xenon-item xenon-item-b"></div>
        </div>
        <div className="blorptastic-items">
          <div className="tangy-category tangy-cat-a">
            <div className="link-blop">
              <Link href="/">HOMEPAGE</Link>
            </div>
            <div className="link-blop">
              <Link href="/">ՏՆԷՋ</Link>
            </div>
          </div>
          <div className="tangy-category tangy-cat-b">
            <div className="link-blop">
              <Link href="">CONTRIBUTE</Link>
            </div>
            <div className="link-blop">
              <Link href="#">ԱՋԱԿՑԵԼ</Link>
            </div>
          </div>
          <div className="tangy-category tangy-cat-c">
            <div className="link-blop">
              <Link href="javascript:scrollTo(AboutUs);">ABOUT US</Link>
            </div>
            <div className="link-blop">
              <Link href="javascript:scrollTo(AboutUs);">ՄԵՐ ՄԱՍԻՆ</Link>
            </div>
          </div>
          <div className="tangy-category tangy-cat-d">
            <div className="link-blop">
              <Link href="javascript:scrollTo(Footer);">CONTACT</Link>
            </div>
            <div className="link-blop">
              <Link href="javascript:scrollTo(Footer);">ԿԱՊ</Link>
            </div>
          </div>
        </div>
        <h1 className="gorgon-title">Armenian Record Archive</h1>
      </div>
    </div>
  </div>
</div>


      {/* <div className="line"></div> */}

      <div className="container-center-horizontal">
        <div className="collection screen">
          {/* <div className="divider">
            <div className="divider_1">
          <h1 className="hello valign-text-middle">
            Collection <br></br> ՀԱԲԱԿԱԾՈՒ
          </h1>
          </div>
          <div  className="divider_2">

            </div>
            </div> */}
          <div>
            <form className="search-form">
              <input
                className="search_bar"
                name="query"
                placeholder="Search..."
              />
              <span className="search-icon">🔍</span>
            </form>
          </div>

          {/* <div className="group-34">
              <div className="flex-container-1171 flex-container adellesansarm-extra-extra-bold-midnight-45px">
                <div className="text-1 valign-text-middle text-4">
                  <span>
                    <span className="adellesansarm-extra-extra-bold-midnight-45px">
                      Filters / Ֆիլտերներ
                    </span>{" "}
                  </span>
                </div>
              </div>
            </div> */}
          {/* <div className="group-35 adellesansarm-extra-extra-bold-midnight-34px">
              <div className="artist valign-text-middle">Artist +</div>
              <div className="genre valign-text-middle">Genre +</div>
              <div className="country valign-text-middle">Country –</div>
              <div className="year valign-text-middle">Year +</div>
              <div className="instruments valign-text-middle">
                Instruments +
              </div>
            </div> */}
          {/* <div className="rectangle-54"></div> */}
          {/* <div className="group-container">
              <div className="group-47">
                <div className="ellipse-container">
                  <div className="ellipse-1"></div>
                  <div className="ellipse-1"></div>
                  <div className="ellipse-1"></div>
                  <div className="ellipse-15"></div>
                  <div className="ellipse-1"></div>
                  <div className="ellipse-1"></div>
                </div>
                <div className="flex-container-1 flex-container adellesansarm-light-midnight-45px">
                  <div className="text-2 text-4">
                    <span className="adellesansarm-light-midnight-45px">
                      Argentina
                    </span>
                  </div>
                  <div className="text-2 text-4">
                    <span className="adellesansarm-light-midnight-45px">
                      Armenia
                    </span>
                  </div>
                  <div className="text-2 text-4">
                    <span className="adellesansarm-light-midnight-45px">
                      Brazil
                    </span>
                  </div>
                  <div className="text-2 text-4">
                    <span className="adellesansarm-light-midnight-45px">
                      Canada
                    </span>
                  </div>
                  <div className="text-2 text-4">
                    <span className="adellesansarm-light-midnight-45px">
                      Denmark
                    </span>
                  </div>
                  <div className="text-2 text-4">
                    <span className="adellesansarm-light-midnight-45px">
                      England UK
                    </span>
                  </div>
                </div>
              </div>
              <div className="group-48">
                <div className="ellipse-container">
                  <div className="ellipse-1"></div>
                  <div className="ellipse-1"></div>
                  <div className="ellipse-1"></div>
                  <div className="ellipse-15"></div>
                  <div className="ellipse-1"></div>
                  <div className="ellipse-1"></div>
                </div>
                <div className="flex-container-1 flex-container adellesansarm-light-midnight-45px">
                  <div className="text-2 text-4">
                    <span className="adellesansarm-light-midnight-45px">
                      France
                    </span>
                  </div>
                  <div className="text-2 text-4">
                    <span className="adellesansarm-light-midnight-45px">
                      Germany
                    </span>
                  </div>
                  <div className="text-2 text-4">
                    <span className="adellesansarm-light-midnight-45px">
                      Holland
                    </span>
                  </div>
                  <div className="text-2 text-4">
                    <span className="adellesansarm-light-midnight-45px">
                      Italy
                    </span>
                  </div>
                  <div className="text-2 text-4">
                    <span className="adellesansarm-light-midnight-45px">
                      Jordan
                    </span>
                  </div>
                  <div className="text-2 text-4">
                    <span className="adellesansarm-light-midnight-45px">
                      Lebanon
                    </span>
                  </div>
                </div>
              </div>
              <div className="group-49">
                <div className="ellipse-container">
                  <div className="ellipse-1"></div>
                  <div className="ellipse-1"></div>
                  <div className="ellipse-1"></div>
                  <div className="ellipse-15"></div>
                  <div className="ellipse-1"></div>
                  <div className="ellipse-1"></div>
                </div>
                <div className="flex-container-1 flex-container adellesansarm-light-midnight-45px">
                  <div className="text-2 text-4">
                    <span className="adellesansarm-light-midnight-45px">
                      Qatar
                    </span>
                  </div>
                  <div className="text-2 text-4">
                    <span className="adellesansarm-light-midnight-45px">
                      Russia
                    </span>
                  </div>
                  <div className="text-2 text-4">
                    <span className="adellesansarm-light-midnight-45px">
                      United States
                    </span>
                  </div>
                  <div className="text-2 text-4">
                    <span className="adellesansarm-light-midnight-45px">
                      USSR
                    </span>
                  </div>
                  <div className="text-2 text-4">
                    <span className="adellesansarm-light-midnight-45px">
                      Uraguay
                    </span>
                  </div>
                  <div className="text-2 text-4">
                    <span className="adellesansarm-light-midnight-45px">
                      Venezuela
                    </span>
                  </div>
                </div>
              </div>
            </div> */}
          <div className="record_divider">
            <div className="record_divider_1">
              <RecordListView
                setCurrentSong={setSong}
                audioPlayerRef={audioPlayerRef}
                records={records}
              ></RecordListView>
            </div>
          </div>
        </div>
        <div className="record_divider_2">
          <div>
            <div className="brutalist-container">
              <form className="brutalist-form">
                <div className="brutalist-filter-group">
                  <label className="brutalist-label">Artist / Ֆիլտերներ</label>
                  <input
                    type="text"
                    name="artist"
                    className="brutalist-input"
                  />
                </div>
                <div className="brutalist-filter-group">
                  <label className="brutalist-label">Country –</label>
                  <input
                    type="text"
                    name="country"
                    className="brutalist-input"
                  />
                </div>
                <div className="brutalist-filter-group">
                  <label className="brutalist-label">Year +</label>
                  <input type="text" name="year" className="brutalist-input" />
                </div>
                <div className="brutalist-filter-group">
                  <label className="brutalist-label">Genre +</label>
                  <div className="brutalist-button-group">
                    {[
                      "Pop",
                      "Rock",
                      "Jazz",
                      "Classical",
                      "Hip-Hop",
                      "Electronic",
                    ].map((genre) => (
                      <FilterButton
                        filterName={"genre"}
                        buttonName={genre}
                        filters={filters}
                        setFilter={setFilter}
                      ></FilterButton>
                    ))}
                  </div>
                </div>
                <div className="brutalist-filter-group">
                  <label className="brutalist-label">Instruments +</label>
                  <div className="brutalist-button-group">
                    {[
                      "Guitar",
                      "Piano",
                      "Drums",
                      "Violin",
                      "Bass",
                      "Saxophone",
                    ].map((instrument) => (
                      <FilterButton
                        filterName={"instrument"}
                        buttonName={instrument}
                        filters={filters}
                        setFilter={setFilter}
                      ></FilterButton>
                    ))}
                  </div>
                </div>
                <div className="brutalist-footer">
                  <button type="submit" className="brutalist-submit-btn">
                    Apply Filters
                  </button>
                </div>
              </form>
            </div>
            <div className="brutalist-nav-buttons">
              <button
                type="button"
                className="brutalist-nav-btn"
                onClick={previousPage}
              >
                Previous
              </button>
              <button
                type="button"
                className="brutalist-nav-btn"
                onClick={nextPage}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
