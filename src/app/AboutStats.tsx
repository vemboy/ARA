"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";

interface Stats {
  distinctSongs: number | null;
  recordsWithPhoto: number | null;
  recordLabels: number | null;
  artists: number | null;
  armenianTitles: number | null;
}

export default function AboutStats() {
  const [stats, setStats] = useState<Stats>({
    distinctSongs: null,
    recordsWithPhoto: null,
    recordLabels: null,
    artists: null,
    armenianTitles: null,
  });

  useEffect(() => {
    async function fetchStats() {
      try {
        // 1) # of distinct songs (group by `audio`)
        const distinctSongsRes = await axios.get(
          "https://ara.directus.app/items/record_archive",
          {
            params: {
              limit: -1,
              groupBy: ["audio"],
              fields: "audio",
            },
          }
        );
        const distinctSongsCount = distinctSongsRes.data.data.length;

        // 2) # of records with a photo (filter record_image not null)
        const recordsWithPhotoRes = await axios.get(
          "https://ara.directus.app/items/record_archive",
          {
            params: {
              limit: 0,
              "filter[record_image][_nnull]": true,
              meta: "filter_count",
            },
          }
        );
        const photoCount = recordsWithPhotoRes.data.meta.filter_count ?? 0;

        // 3) # of record labels (all items in record_labels)
        const labelsRes = await axios.get(
          "https://ara.directus.app/items/record_labels",
          {
            params: {
              limit: 0,
              meta: "total_count",
            },
          }
        );
        const labelsCount = labelsRes.data.meta.total_count ?? 0;

        // 4) # of artists (all items in artists)
        const artistsRes = await axios.get(
          "https://ara.directus.app/items/artists",
          {
            params: {
              limit: 0,
              meta: "total_count",
            },
          }
        );
        const artistsCount = artistsRes.data.meta.total_count ?? 0;

        // 5) # of songs with Armenian titles (filter title_armenian not null)
        const armenianTitlesRes = await axios.get(
          "https://ara.directus.app/items/record_archive",
          {
            params: {
              limit: 0,
              "filter[title_armenian][_nnull]": true,
              meta: "filter_count",
            },
          }
        );
        const armenianTitlesCount =
          armenianTitlesRes.data.meta.filter_count ?? 0;

        setStats({
          distinctSongs: distinctSongsCount,
          recordsWithPhoto: photoCount,
          recordLabels: labelsCount,
          artists: artistsCount,
          armenianTitles: armenianTitlesCount,
        });
      } catch (error) {
        console.error("Error fetching stats from Directus:", error);
      }
    }
    fetchStats();
  }, []);

  return (
    <div style={{ display: "grid", gap: "1rem", marginTop: "2rem" }}>
      <div>
        <strong># of distinct songs</strong>
        <div style={{ fontSize: "2rem" }}>
          {stats.distinctSongs !== null ? stats.distinctSongs : "Loading..."}
        </div>
      </div>
      <div>
        <strong># of records with a photo</strong>
        <div style={{ fontSize: "2rem" }}>
          {stats.recordsWithPhoto !== null ? stats.recordsWithPhoto : "Loading..."}
        </div>
      </div>
      <div>
        <strong># of Record Labels</strong>
        <div style={{ fontSize: "2rem" }}>
          {stats.recordLabels !== null ? stats.recordLabels : "Loading..."}
        </div>
      </div>
      <div>
        <strong># of Artists</strong>
        <div style={{ fontSize: "2rem" }}>
          {stats.artists !== null ? stats.artists : "Loading..."}
        </div>
      </div>
      <div>
        <strong># of songs with Armenian titles</strong>
        <div style={{ fontSize: "2rem" }}>
          {stats.armenianTitles !== null ? stats.armenianTitles : "Loading..."}
        </div>
      </div>
    </div>
  );
}
