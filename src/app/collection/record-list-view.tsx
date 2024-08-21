import React, { useState } from "react";
import { Responsive, WidthProvider } from "react-grid-layout";
import RecordCollectionRow from "./record-collection-row";
import "react-grid-layout/css/styles.css";
import {
  getDefaultImageThumbnailUrl,
  getImageThumbnailUrl,
} from "@/utils/assetUtils";

const ResponsiveGridLayout = WidthProvider(Responsive);

function RecordListView(props: any) {
  const [currentSongId, setCurrentSongId] = useState<string | null>(null);

  // Configure the layout for the grid
  const layout = props.records.map((record: any, index: number) => ({
    i: record.id.toString(),
    x: (index % 5), // 5 columns per row
    y: Math.floor(index / 5),
    w: 1, // Each item takes up 1 column space
    h: 1, // Set height dynamically
    minW: 2, // Ensure minimum width
  }));

  const layouts = { lg: layout, md: layout, sm: layout, xs: layout, xxs: layout };

  return (
    <div style={{ marginLeft: "280px", marginTop: "-25px", padding: "20px", overflowY: "auto", height: "100vh" }}>
      <ResponsiveGridLayout
        className="layout"
        layouts={layouts}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 5, md: 4, sm: 3, xs: 2, xxs: 1 }} // Maintain consistent number of columns
        rowHeight={330} // Dynamic row height based on content
        isDraggable={false} // Disable dragging
        isResizable={false} // Disable resizing
        margin={[15, 15]} // Margin between grid items
        preventCollision={true} // Prevent overlapping
        compactType={null} // Disable grid compaction
      >
        {props.records.map((record: any) => (
          <div key={record.id} className="grid-item" style={{ minWidth: "300px", maxWidth: "300px" }}>
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
      </ResponsiveGridLayout>
    </div>
  );
}

export default RecordListView;