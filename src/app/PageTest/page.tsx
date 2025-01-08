"use client";

import React, { useRef, useState } from "react";
import RecordListView from "../../app/collection/record-list-view"; // Adjust the path accordingly
import "react-grid-layout/css/styles.css"; // Grid layout styles

export default function TestRecordListView() {
  // Generate 20 mock records for testing the RecordListView component
  const mockRecords = Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    songId: `song${i + 1}`,
    author: `Artist ${i + 1}`,
    title: `Record ${i + 1}`,
    display_title: `Record Title ${i + 1}`,
    color: `#${Math.floor(Math.random() * 16777215).toString(16)}`, // Random color
    image: "https://via.placeholder.com/150", // Placeholder image
    genre: `Genre ${i + 1}`,
    year: `${2020 + i}`,
    title_armenian: `Title Armenian ${i + 1}`,
  }));

  // Mock the setCurrentSong and audioPlayerRef for testing purposes
  const audioPlayerRef = useRef(null);
  const setSong = (song: string) => {
    console.log("Setting song:", song);
  };

  return (
    <div>
      <h1 style={{ textAlign: "center" }}>Test RecordListView with 20 Records</h1>
      <RecordListView
        records={mockRecords}
        setCurrentSong={setSong}
        audioPlayerRef={audioPlayerRef}
      />
    </div>
  );
}