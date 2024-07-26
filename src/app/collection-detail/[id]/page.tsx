"use client";

import Head from "next/head";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { usePathname } from "next/navigation";
import {
  getDefaultImageDetailUrl,
  getImageDetailUrl,
} from "@/utils/assetUtils";
import Link from "next/link";

interface Props {}

const Album: React.FC<Props> = ({}) => {
  const [record, setRecord] = useState(null);
  const pathName = usePathname();
  const recordId = pathName.split("/").slice(-1)[0];
  console.log(pathName);
  console.log(recordId);

  useEffect(() => {
    axios
      .get(`https://ara.directus.app/items/record_archive/${recordId}`)
      .then((response) => {
        console.log(response);
        setRecord(response.data.data);
      });
  }, []);

  console.log(recordId);
  if (record === null) {
    return null;
  }

  return (

        <>



    
    <div className="overlap-group6">
      <div className="overlap-group8">
        <img
          className="r-11379693-1515454010-2972-3"
          src={
            record["record_image"]
              ? getImageDetailUrl(record["record_image"])
              : getDefaultImageDetailUrl()
          }
          alt="R-11379693-1515454010-2972 3"
        />
        <div className="overlap-group3">
          <div className="flex-container-1226 flex-container adellesansarm-extra-extra-bold-white-19px">
            <div className="text">
              <span className="adellesansarm-extra-extra-bold-white-19px"></span>
            </div>
            <div className="text">
              <span className="adellesansarm-extra-extra-bold-white-19px">
                3:51
              </span>
            </div>
            <div className="text">
              <span className="adellesansarm-extra-extra-bold-white-19px"></span>
            </div>
            <div className="text">
              <span className="adellesansarm-extra-extra-bold-white-19px">
                3:35
              </span>
            </div>
            <div className="text">
              <span className="adellesansarm-extra-extra-bold-white-19px"></span>
            </div>
            <div className="text">
              <span className="adellesansarm-extra-extra-bold-white-19px">
                7:33
              </span>
            </div>
            <div className="text">
              <span className="adellesansarm-extra-extra-bold-white-19px"></span>
            </div>
            <div className="text">
              <span className="adellesansarm-extra-extra-bold-white-19px">
                4:20
              </span>
            </div>
          </div>
          <div
            style={{ marginTop: "70px" }}
            className="flex-container-1232 flex-container adellesansarm-semi-bold-black-33px"
          >
            <div className="text-1 text-6">
              <span className="adellesansarm-semi-bold-black-33px">
                Origin: Canada
              </span>
            </div>
            <div className="text-1 text-6">
              <span className="adellesansarm-semi-bold-black-33px">
                {record["genre"] ?? "Genre: Unkown"}
              </span>
            </div>
            <div className="text-1 text-6">
              <span className="adellesansarm-semi-bold-black-33px">
                {record["record_original_recording_date"] ?? "Date: Unkown"}
              </span>
            </div>
          </div>


        </div>
      </div>
      <div className="flex-container-1225 flex-container adellesansarm-regular-normal-midnight-52px">
        <div className="text-2 text-6">
          <span className="adellesansarm-regular-normal-midnight-52px-1">
            ԱՒՕ
          </span>
        </div>
        <div
          style={{ marginTop: "40px", width: "35vw" }}
          className="text-2 text-6"
        >
          <span
            style={{ fontSize: "35px", lineHeight: "normal" }}
            className="adellesansarm-regular-normal-midnight-52px"
          >
            Artists: {record["artist_original"]}
          </span>
        </div>
        <div style={{ top: "0px" }} className="text-2 text-6">
          <span
            style={{ fontSize: "30px", color: "black !important" }}
            className="adellesansarm-regular-normal-midnight-52px"
          >
            Grouping: {record["title"]}
          </span>
        </div>
      </div>
    </div>
    </>
  );
};

export default function CollectionDetail() {
  return (

    <>
 <div className="frame-1 screen">
          <div className="overlap-group3">
            <div className="rectangle-137"></div>
            <div className="group-79">
              <div className="overlap-group2">
                <div className="ellipse-1"></div>
              </div>
              <div className="group-81">
                

              </div>
            </div>
            <div className="group-80 adellesansarm-extra-extra-bold-white-16-3px">
              <div className="flex-container-58 flex-container">
                <div className="text-1 valign-text-middle">
                  <span>
                    <span className="adellesansarm-extra-extra-bold-white-16-3px">
                      <Link href="/">HOMEPAGE</Link>
                    </span>{" "}
                  </span>
                </div>
                <div className="text-1 valign-text-middle">
                  <span>
                    <span className="adellesansarm-extra-extra-bold-white-16-3px">
                      <Link href="/">ՏՆԷՋ</Link>
                    </span>{" "}
                  </span>
                </div>
              </div>
              <div className="flex-container-59 flex-container">
                <div className="text-1 valign-text-middle">
                  <span>
                    <span className="adellesansarm-extra-extra-bold-white-16-3px">
                      <Link href="">COLLECTION</Link>
                    </span>{" "}
                  </span>
                </div>
                <div className="text-1 valign-text-middle">
                  <span>
                    <span className="adellesansarm-extra-extra-bold-white-16-3px">
                      <Link href="#">ՀԱԲԱԿԱԾՈՒ</Link>
                    </span>{" "}
                  </span>
                </div>
              </div>
              <div className="flex-container-57 flex-container">
                <div className="text-1 valign-text-middle">
                  <span>
                    <span className="adellesansarm-extra-extra-bold-white-16-3px">
                      <Link href="javascript:scrollTo(AboutUs);">ABOUT US</Link>
                    </span>{" "}
                  </span>
                </div>
                <div className="text-1 valign-text-middle">
                  <span>
                    <span className="adellesansarm-extra-extra-bold-white-16-3px">
                      <Link href="javascript:scrollTo(AboutUs);">
                        ՄԵՐ ՄԱՍԻՆ
                      </Link>
                    </span>{" "}
                  </span>
                </div>
              </div>
              <div className="flex-container-56 flex-container">
                <div className="text-1 valign-text-middle">
                  <span>
                    <span className="adellesansarm-extra-extra-bold-white-16-3px">
                      <Link href="javascript:scrollTo(Footer);">CONTACT</Link>
                    </span>{" "}
                  </span>
                </div>
                <div className="text-1 valign-text-middle">
                  <span>
                    <span className="adellesansarm-extra-extra-bold-white-16-3px">
                      <Link href="javascript:scrollTo(Footer);">ԿԱՊ</Link>
                    </span>{" "}
                  </span>
                </div>
              </div>
            </div>
            <h1 className="full-page-armenian valign-text-middle">
              Armenian Record Archive
            </h1>
          </div>
        </div>
    <div className="container-center-horizontal">
      <div className="collection-detail screen">
        
        
        <div className="group-9"></div>

        <Album></Album>



        <div className="overlap-group5">
          <div className="overlap-group7">
            <div className="overlap-group2">
              <div className="group-5"></div>
              <div className="flex-container-1227 flex-container adellesansarm-extra-extra-bold-white-19px">
                <div className="text">
                  <span className="adellesansarm-extra-extra-bold-white-19px">
                    Design
                  </span>
                </div>
                <div className="text">
                  <span className="adellesansarm-regular-normal-white-19px">
                    Dickran A. Manavian
                  </span>
                </div>
                <div className="text">
                  <span className="adellesansarm-extra-extra-bold-white-19px">
                    Engineer
                  </span>
                </div>
                <div className="text">
                  <span className="adellesansarm-regular-normal-white-19px">
                    Joey Galimi
                  </span>
                </div>
                <div className="text">
                  <span className="adellesansarm-extra-extra-bold-white-19px">
                    Lead Vocals, Arranged by
                  </span>
                </div>
                <div className="text">
                  <span className="adellesansarm-regular-normal-white-19px">
                    Avo Sarkissian (tracks: A1–A5, B1–B4)
                  </span>
                </div>
                <div className="text">
                  <span className="adellesansarm-extra-extra-bold-white-19px">
                    Word by, Music by
                  </span>
                </div>
                <div className="text">
                  <span className="adellesansarm-regular-normal-white-19px">
                    Avo Sarkissian (tracks: A1, A2, A5, B1, B4)
                  </span>
                </div>
              </div>
              


            </div>
            <div className="flexcontainer-container">
              <div className="flex-container-1228 flex-container adellesansarm-extra-extra-bold-white-19px">
                <div className="text">
                  <span className="adellesansarm-extra-extra-bold-white-19px">
                    Design
                  </span>
                </div>
                <div className="text">
                  <span className="adellesansarm-regular-normal-white-19px">
                    Dickran A. Manavian
                  </span>
                </div>
                <div className="text">
                  <span className="adellesansarm-extra-extra-bold-white-19px">
                    Engineer
                  </span>
                </div>
                <div className="text">
                  <span className="adellesansarm-regular-normal-white-19px">
                    Joey Galimi
                  </span>
                </div>
                <div className="text">
                  <span className="adellesansarm-extra-extra-bold-white-19px">
                    Lead Vocals, Arranged by
                  </span>
                </div>
                <div className="text">
                  <span className="adellesansarm-regular-normal-white-19px">
                    Avo Sarkissian (tracks: A1–A5, B1–B4)
                  </span>
                </div>
                <div className="text">
                  <span className="adellesansarm-extra-extra-bold-white-19px">
                    Word by, Music by
                  </span>
                </div>
                <div className="text">
                  <span className="adellesansarm-regular-normal-white-19px">
                    Avo Sarkissian (tracks: A1, A2, A5, B1, B4)
                  </span>
                </div>
              </div>
              <div className="flex-container-1230 flex-container fitvariable-regular-normal-white-222px">
                <div className="text-4 valign-text-middle text-6">
                  <span>
                    <span className="fitvariable-regular-normal-white-222px">
                      Credits
                    </span>{" "}
                  </span>
                </div>
                <div className="text1-1230 valign-text-middle">
                  <span>
                    <span className="fitvariable-regular-normal-white-222px">
                      ԵՐԱԽՏԻՔԻ ՏՈՒՐՔ
                    </span>{" "}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex-container-1231 flex-container fitvariable-regular-normal-white-222px">
              <div className="text-4 valign-text-middle text-6">
                <span>
                  <span className="fitvariable-regular-normal-white-222px">
                    Personel
                  </span>{" "}
                </span>
              </div>
              <div className="text-4 valign-text-middle text-6">
                <span>
                  <span className="fitvariable-regular-normal-white-222px">
                    Մասնակիցներ
                  </span>{" "}
                </span>
              </div>
            </div>


          </div>

        </div>
      </div>
    </div>

    </>
  );
}
