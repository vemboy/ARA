import { getImageDetailUrl } from "@/utils/assetUtils";
import axios from "axios";

export async function generateStaticParams() {
  const ids = ["01055d36-41df-40b3-8db5-5caab2750967"];
  return ids.map((id) => {
    console.log("Generating static page:", id);
    return { id };
  });
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const recordId = id;
  const res = await axios.get(
    `https://ara.directus.app/items/record_archive/${recordId}`
  );

  const currentRecord = await res.data.data;
  console.log("currentRecord", currentRecord);
  const ARAID = currentRecord["ARAID"];

  return (
    <div className="ara-main" id="ara-main">
      {/* Top Menu */}
      <div className="ara-menu" id="ara-menu">
        <div className="ara-menu-title" id="ara-menu-title">
          ARMENIAN RECORD ARCHIVE
        </div>
      </div>

      <div className="container">
        {/* Header Section */}
        <div className="ara-record-header">
          <div className="ara-header__recording-label">
            {currentRecord.record_label?.label_en ?? "Unknown Label"}
          </div>
          <div
            className="ara-header__share"
            //onClick={() => setIsShareOpen(true)}
            style={{ cursor: "pointer" }}
          >
            SHARE
          </div>
        </div>

        {/* Left: Image + Thumbnails */}
        <div className="ara-record-image">
          <div className="ara-record-image__container">
            {/* SPIN if "isPlaying" */}
            <img
              src={getImageDetailUrl(currentRecord["record_image"])}
              alt="Record"
              draggable="false"
              className={`ara-record-image__main ${"spinning-record"}`}
            />
          </div>
        </div>

        {/* Metadata Section */}
        <div className="ara-record-meta-section">
          <div className="ara-record-meta-section__metadata-row">
            <div className="ara-record-meta-section__data-title">
              DATA CATEGORY
            </div>
            <div className="ara-record-meta-section__side-a-data">
              SIDE A DATA
            </div>
            <div className="ara-record-meta-section__side-b-data">
              SIDE B DATA
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// export default async function Page({
//   params,
// }: {
//   params: Promise<{ id: string }>;
// }) {
//   const { id } = await params;
//   console.log("params:", id);
//   return <div>HELLO {id}</div>;
// }
