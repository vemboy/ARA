// SampleRecordImage.tsx
"use client";
import React from "react";

interface SampleRecordImageProps {
  isPlaying?: boolean;
  className?: string;
}

/**
 * Renders your designer's nested circle record,
 * with NO spinning on play.
 */
export default function SampleRecordImage({ isPlaying, className }: SampleRecordImageProps) {
  return (
    <div className={`sample-record-image ${className ? className : ""} ${isPlaying ? 'playing' : ''}`}>
      {/* .record replicates your original container */}
      <div className="record">
        <div className="outer-circle">
          <div className="middle-circle">
            <div className="outline-circle">
              <div className="center-circle"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
