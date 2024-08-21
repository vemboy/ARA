import React, { useState, useEffect } from "react";
import { Responsive, WidthProvider } from "react-grid-layout";
import RecordCollectionRow from "./record-collection-row";
import "react-grid-layout/css/styles.css";
import {
  getDefaultImageThumbnailUrl,
  getImageThumbnailUrl,
} from "@/utils/assetUtils";

const GridLayout = WidthProvider(Responsive);

function RecordListView(props: any) {
  const [currentSongId, setCurrentSongId] = useState<string | null>(null);
  const [availableWidth, setAvailableWidth] = useState(1200); // Set a default width

  // Update available width on resize (browser-side only)
  useEffect(() => {
    // Check if window is defined to ensure we're in the browser
    if (typeof window !== "undefined") {
      const handleResize = () => setAvailableWidth(window.innerWidth - 300);
      setAvailableWidth(window.innerWidth - 300); // Initial set on mount

      window.addEventListener('resize', handleResize);

      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  const cols = 5; // Assuming 5 columns for large screens, adjust as needed
  const itemWidth = availableWidth / cols; // Dynamic width for each item

  const layout = props.records.map((record: any, index: number) => ({
    i: record.id.toString(),
    x: (index % cols),
    y: Math.floor(index / cols),
    w: 1, // Fixed to 1 column width per item
    h: 1, // Let height be dynamic based on content
  }));

  return (
    <div style={{ marginLeft: "280px", padding: "20px", overflowY: "auto", height: "100vh" }}>
      <GridLayout
        className="layout"
        layouts={{ lg: layout }}
        cols={{ lg: cols, md: 4, sm: 3, xs: 2, xxs: 1 }} // Adjust columns based on screen size
        rowHeight={330}
        width={availableWidth} // Set dynamic width based on available space
        isDraggable={false}
        isResizable={false}
        margin={[15, 15]} // Gap between grid items
        preventCollision={true}
        compactType={null} // Disable compacting
      >
        {props.records.map((record: any) => (
          <div key={record.id} className="grid-item" style={{ width: itemWidth }}>
            <RecordCollectionRow
              setCurrentSong={props.setCurrentSong}
              audioPlayerRef={props.audioPlayerRef}
              currentSongId={currentSongId}
              setCurrentSongId={setCurrentSongId}
              songId={record.songId}
              title_armenian={
                record.title_armenian ? record.title_armenian : "No armenian yet"
              }
              id={record.id}
              genre={record.genre ? record.genre : "unknown genre"}
              year={record.year ? record.year : "unknown year"}
              title={record.title}
              color={record.color}
              display_title={
                record.display_title ? record.display_title : "No title yet"
              }
              author={(record.author ?? "Unknown author").substring(0, 20)}
              src={
                record.image
                  ? getImageThumbnailUrl(record.image)
                  : getDefaultImageThumbnailUrl()
              }
            />
          </div>
        ))}
      </GridLayout>
    </div>
  );
}

export default RecordListView;
