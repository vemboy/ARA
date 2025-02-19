"use client";
import React from "react";


interface NewSampleRecordImageProps {
  isPlaying?: boolean;
  className?: string;
}

export default function NewSampleRecordImage({ isPlaying, className }: NewSampleRecordImageProps) {
  return (
    <div className={`new-sample-record-image ${className || ""} ${isPlaying ? "new-playing" : ""}`}>
      <div className="new-record">
        <div className="new-outer-circle">
          <div className="new-middle-circle">
            <div className="new-outline-circle">
              <div className="new-center-circle"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
