"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";

interface Stats {
  distinctSongs: number | null;
  recordLabels: number | null;
  artists: number | null;
}

export default function AboutStats() {
  const [stats, setStats] = useState<Stats>({
    distinctSongs: null,
    recordLabels: null,
    artists: null,
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

        // 2) # of record labels (all items in record_labels)
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

        // 3) # of artists (all items in artists)
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

        setStats({
          distinctSongs: distinctSongsCount,
          recordLabels: labelsCount,
          artists: artistsCount,
        });
      } catch (error) {
        console.error("Error fetching stats from Directus:", error);
      }
    }
    fetchStats();
  }, []);

  return (
    <div className="aboutStatsContainer">
      <div className="aboutStatItem">
        <strong># of distinct songs</strong>
        <div className="aboutStatNumber">
          {stats.distinctSongs !== null ? stats.distinctSongs : "Loading..."}
        </div>
      </div>
      <div className="aboutStatItem">
        <strong># of Record Labels</strong>
        <div className="aboutStatNumber">
          {stats.recordLabels !== null ? stats.recordLabels : "Loading..."}
        </div>
      </div>
      <div className="aboutStatItem">
        <strong># of Artists</strong>
        <div className="aboutStatNumber">
          {stats.artists !== null ? stats.artists : "Loading..."}
        </div>
      </div>
    </div>
  );
}
