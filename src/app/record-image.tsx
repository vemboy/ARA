"use client";

import router from "next/router";
import Link from "next/link";

function RecordImage(props: any) {
  return (
    // <div className="airtable-gallery-container">
    <Link href={`collection-detail/${props.id}`}>
      <div className="airtable-gallery-2">
        <img
          style={{ width: "300px", height: "300px" }}
          src={`${props.src}`}
          alt=""
        />
      </div>
    </Link>
    //  </div>
  );
}

export default RecordImage;
