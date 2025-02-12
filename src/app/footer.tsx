"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Footer() {
  const router = useRouter();
  const [araIds, setAraIds] = useState<string[]>([]);

  // On mount, fetch a list of ARAIDs for random picking
  useEffect(() => {
    axios
      .get("https://ara.directus.app/items/record_archive?fields=ARAID&limit=-1")
      .then((res) => {
        const data = res.data?.data;
        if (Array.isArray(data)) {
          const validIds = data
            .map((item: any) => item.ARAID)
            .filter((id: any) => typeof id === "string");
          setAraIds(validIds);
        }
      })
      .catch((err) => console.error("Error fetching ARAIDs for random:", err));
  }, []);

  // “Random Record” link => pick random ARAID, go to detail
  const handleRandomRecord = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!araIds.length) return;

    const randomIndex = Math.floor(Math.random() * araIds.length);
    const randomId = araIds[randomIndex];
    // Adjust route if needed for your detail page path
    router.push(`/collection-detail/${randomId}`);
  };

  return (
    <footer className="ara-footer">
      {/* LEFT: big text occupying 80% width */}
      <div className="ara-footer-left">
        <div className="ara-footer-title">ARMENIANRECORDARCHIVEARMENIANRECORDARCHIVEARMENIANRECORDARCHIVEARMENIANRECORDARCHIVEARMENIANRECORD</div>
      </div>

      {/* RIGHT: 2 columns side-by-side (20% total) */}
      <div className="ara-footer-right">
        {/* Column 1: 3 links */}
        <div className="ara-footer-column">
          <Link href="/#collection">Collection</Link>
          <Link href="/about">About Us</Link>
          <a href="#" onClick={handleRandomRecord}>
            Random Record
          </a>
        </div>
        {/* Column 2: placeholders */}
        <div className="ara-footer-column">
          <div>Placeholder 1</div>
          <div>Placeholder 2</div>
          <div>Placeholder 3</div>
        </div>

                <div className="ara-footer-column">
          <div>Placeholder 1</div>
          <div>Placeholder 2</div>
          <div>Placeholder 3</div>
        </div>
      </div>
    </footer>
  );
}
