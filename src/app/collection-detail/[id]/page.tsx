"use client";

import Head from "next/head";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { usePathname } from 'next/navigation'

interface Props {}

const Album: React.FC<Props> = ({}) => {
  const [record, setRecord] = useState(null);
  const pathName = usePathname()
  const recordId = pathName.split('/').slice(-1)[0]
  console.log(pathName)
  console.log(recordId)

  useEffect(() => {
    axios
      .get(
        `https://ara.directus.app/items/record_archive/${recordId}`
      )
      .then((response) => {
        console.log(response);
        setRecord(response.data.data);
      });
  }, []);

  console.log(recordId)
  if (record === null) {
    return null;
  }

  return (
    <div className="overlap-group6">
      <div className="overlap-group8">
        <img
          className="r-11379693-1515454010-2972-3"
          src={
            record['record_image']
              ? `https://ara.directus.app/assets/${record['record_image']}`
              : "https://ara.directus.app/assets/bfcf94c6-e40d-4fe1-8fbc-df54dc96ec48"
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
          <div style={{marginTop: "70px"}} className="flex-container-1232 flex-container adellesansarm-semi-bold-black-33px">
            <div className="text-1 text-6">
              <span className="adellesansarm-semi-bold-black-33px">Origin: Canada</span>
            </div>
            <div className="text-1 text-6">
              <span className="adellesansarm-semi-bold-black-33px">
                {record['genre'] ?? "Genre: Unkown"}
              </span>
            </div>
            <div className="text-1 text-6">
              <span className="adellesansarm-semi-bold-black-33px">
                {record['record_original_recording_date'] ?? "Date: Unkown"}
              </span>
            </div>
          </div>
      

          <div className="rectangle-90"></div>
         
        </div>
      </div>
      <div className="flex-container-1225 flex-container adellesansarm-regular-normal-midnight-52px">
        <div className="text-2 text-6">
          <span className="adellesansarm-regular-normal-midnight-52px-1">
            ԱՒՕ
          </span>
        </div>
        <div style={{marginTop: "40px", width: "35vw"}} className="text-2 text-6">
          <span style={{fontSize: "35px", lineHeight: "normal"}}  className="adellesansarm-regular-normal-midnight-52px">
            Artist(s): {record['artist_original']}
          </span>
        </div>
        <div style={{top: "0px"}} className="text-2 text-6">
          <span style={{fontSize: "30px", color: "black !important"}} className="adellesansarm-regular-normal-midnight-52px">
            Grouping: {record['title']}
          </span>
          
        </div>
      </div>
    </div>
  );
};

export default function CollectionDetail() {
  return (
    <div className="container-center-horizontal">
      <div className="collection-detail screen">
        <div className="group-9">
        </div>
        
        <Album></Album>
       
        <div className="flex-container-1229 flex-container fitvariable-regular-normal-midnight-222px">
          <div className="text-3 valign-text-middle text-6">
            <span>
              <span className="fitvariable-regular-normal-midnight-222px">
                Tracklist
              </span>{" "}
            </span>
          </div>
          <div className="text-3 valign-text-middle text-6">
            <span>
              <span className="fitvariable-regular-normal-midnight-222px">
                Երգացանկ
              </span>{" "}
            </span>
          </div>
        </div>
        <div className="hello-body-container">
          <p className="hello-body-1">
            ԵՐԵՍ ԱՌԱՋԻՆ / <br></br> SIDE ONE
          </p>
          <p className="hello-body-2">
            ԵՐԵՍ ԵՐԿՐՈՐԴ / <br></br> SIDE TWO
          </p>
        </div>
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
              <div className="airtable-gallery"></div>
              <p className="lorem-ipsum-dolor-si valign-text-middle">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ut
                nisi vitae orci porta consequat. Fusce porttitor felis odio, in
                pretium nibh ullamcorper sit amet. Cras rutrum leo libero, vel
                iaculis mi consectetur in. In rhoncus nec turpis a pharetra.
                Phasellus ac dignissim velit. Proin posuere libero sollicitudin,
                vestibulum quam quis, ultricies elit. Sed interdum lobortis
                vestibulum.
                <br />
                <br />
                In nibh mi, aliquet ac tincidunt eu, convallis vitae metus.
                Donec quis lacus ligula. Phasellus fringilla vulputate ex vitae
                dapibus. Suspendisse non elit maximus dolor ultricies
                scelerisque ut non dui. Morbi maximus erat quis ipsum
                condimentum laoreet. Curabitur facilisis laoreet urna, ac
                placerat arcu dapibus sed. Nullam dolor mauris, vulputate non
                luctus sed, tristique vitae metus. Sed id sapien quis ante
                pulvinar pharetra. Suspendisse et urna ligula. Fusce
                pellentesque lobortis fermentum. Integer eget nisl vitae justo
                lobortis imperdiet id quis risus.
                <br />
                <br />
                Etiam justo nunc, fringilla ac finibus eu, vehicula quis odio.
                Maecenas porttitor enim et justo elementum, ullamcorper blandit
                nulla sodales. Praesent enim neque, pharetra non tellus at,
                malesuada sagittis neque. Nam felis orci, elementum a pulvinar
                posuere, cursus sit amet nibh. Donec felis nisi, pharetra vitae
                scelerisque vitae, pellentesque ut eros. Suspendisse sed rutrum
                quam, nec volutpat nulla. Nam varius odio a porttitor laoreet.
                Morbi cursus elit at arcu mattis tempor. Suspendisse vitae purus
                metus. Curabitur sodales lacus et metus cursus ultricies.
                <br />
                <br />
                Aliquam placerat metus neque, a viverra est ultricies id.
                Vivamus lectus turpis, semper sed tempor ut, iaculis vitae
                turpis. Aliquam pharetra sagittis facilisis. Curabitur dictum
                sodales erat at suscipit. Donec scelerisque tristique metus, ac
                tincidunt orci vehicula id. Curabitur interdum lorem neque, sit
                amet faucibus ligula mollis sed. Ut in elit euismod dui
                elementum maximus at ut tortor. Donec molestie vel libero sit
                amet finibus. Sed volutpat mattis sodales. Etiam velit eros,
                aliquam quis ultricies a, tincidunt id sapien. Vestibulum
                pellentesque lacinia libero, eu efficitur erat mattis at. Donec
                vehicula ligula at vestibulum lacinia. Duis viverra volutpat
                enim eu tristique.
              </p>
              <p className="curabitur-urna-orci valign-text-middle">
                Curabitur urna orci, dapibus et tincidunt non, tempor a metus.
                Vestibulum tristique leo cursus purus elementum varius. Ut neque
                turpis, bibendum eu ultricies a, dictum eget justo. In aliquet,
                neque imperdiet sagittis faucibus, enim odio lacinia purus, ac
                laoreet dolor ipsum quis ex. Phasellus ac elit et felis semper
                tempus. Sed turpis ipsum, vehicula vel facilisis ac, malesuada
                ut dui. Mauris quis nunc lacus. Aliquam ac urna id orci gravida
                consequat.
              </p>
              <p className="x1-curabitur-urna-or valign-text-middle">
                1. Curabitur urna orci, dapibus et tincidunt non, tempor a
                metus. Vestibulum tristique leo cursus purus elementum varius.
                Ut neque turpis, bibendum eu ultricies a, dictum t.
              </p>
              <h1 className="armenian-diaspora-of valign-text-middle">
                Armenian Diaspora of Canada <br />
                The story of Avo Sarkissian
              </h1>
              <div className="rectangle-89"></div>
              <div className="rectangle-92"></div>
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
            <div className="flex-container-1241 flex-container adellesansarm-regular-normal-midnight-23px">
              <div className="text-5 text-6">
                <span className="adellesansarm-regular-normal-midnight-23px">
                  A1. Մոնթրէալ / Montreal
                </span>
              </div>
              <div className="text-5 text-6">
                <span className="adellesansarm-regular-normal-midnight-23px"></span>
              </div>
              <div className="text-5 text-6">
                <span className="adellesansarm-extra-extra-bold-midnight-23px">
                  A2. Յիշէ Այն Օրը / Hishe Ayn Ore
                </span>
              </div>
              <div className="text-5 text-6">
                <span className="adellesansarm-regular-normal-midnight-23px"></span>
              </div>
              <div className="text-5 text-6">
                <span className="adellesansarm-regular-normal-midnight-23px">
                  A3. Ես Քեզ Սնիծ / Yes Kez Aniz
                </span>
              </div>
              <div className="text-5 text-6">
                <span className="adellesansarm-regular-normal-midnight-23px">
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;ԺՈՂՈՎՐԴԱԿԱՆ
                </span>
              </div>
              <div className="text-5 text-6">
                <span className="adellesansarm-regular-normal-midnight-23px">
                  A4. Գինետուն / Kinedoun
                </span>
              </div>
              <div className="text-5 text-6">
                <span className="adellesansarm-regular-normal-midnight-23px">
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;ԺՈՂՈՎՐԴԱԿԱՆ
                </span>
              </div>
              <div className="text-5 text-6">
                <span className="adellesansarm-regular-normal-midnight-23px">
                  A5. Մինակ Եմ Այսօր / Menag Yem Aysor
                </span>
              </div>
            </div>
            <div className="flexcontainer-container-1">
              <div className="flex-container-1242 flex-container adellesansarm-extra-extra-bold-midnight-23px">
                <div className="text-5 text-6">
                  <span className="adellesansarm-extra-extra-bold-midnight-23px"></span>
                </div>
                <div className="text-5 text-6">
                  <span className="adellesansarm-extra-extra-bold-midnight-23px">
                    3:10
                  </span>
                </div>
                <div className="text-5 text-6">
                  <span className="adellesansarm-extra-extra-bold-midnight-23px"></span>
                </div>
                <div className="text-5 text-6">
                  <span className="adellesansarm-extra-extra-bold-midnight-23px">
                    5:30
                  </span>
                </div>
                <div className="text-5 text-6">
                  <span className="adellesansarm-extra-extra-bold-midnight-23px"></span>
                </div>
                <div className="text-5 text-6">
                  <span className="adellesansarm-extra-extra-bold-midnight-23px">
                    3:36
                  </span>
                </div>
                <div className="text-5 text-6">
                  <span className="adellesansarm-extra-extra-bold-midnight-23px"></span>
                </div>
                <div className="text-5 text-6">
                  <span className="adellesansarm-extra-extra-bold-midnight-23px">
                    3:30
                  </span>
                </div>
                <div className="text-5 text-6">
                  <span className="adellesansarm-extra-extra-bold-midnight-23px"></span>
                </div>
                <div className="text-5 text-6">
                  <span className="adellesansarm-extra-extra-bold-midnight-23px">
                    4:27
                  </span>
                </div>
              </div>
              <div className="flex-container-1245 flex-container adellesansarm-regular-normal-midnight-23px">
                <div className="text-5 text-6">
                  <span className="adellesansarm-regular-normal-midnight-23px">
                    B1. Իմ Եարիս / Im Yaris
                  </span>
                </div>
                <div className="text-5 text-6">
                  <span className="adellesansarm-regular-normal-midnight-23px"></span>
                </div>
                <div className="text-5 text-6">
                  <span className="adellesansarm-regular-normal-midnight-23px">
                    B2. Այն Օրէն Որ / Ayn Oren Vor
                  </span>
                </div>
                <div className="text-5 text-6">
                  <span className="adellesansarm-regular-normal-midnight-23px"></span>
                </div>
                <div className="text-5 text-6">
                  <span className="adellesansarm-regular-normal-midnight-23px">
                    B3. Տլէեաման / Dele Yaman
                  </span>
                </div>
                <div className="text-5 text-6">
                  <span className="adellesansarm-regular-normal-midnight-23px"></span>
                </div>
                <div className="text-5 text-6">
                  <span className="adellesansarm-regular-normal-midnight-23px">
                    B4. Մի Մեղք Ունեմ / Mi Mekhk Ounem
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex-container-1243 flex-container adellesansarm-extra-extra-bold-midnight-23px">
            <div className="text-5 text-6">
              <span className="adellesansarm-extra-extra-bold-midnight-23px"></span>
            </div>
            <div className="text-5 text-6">
              <span className="adellesansarm-extra-extra-bold-midnight-23px">
                3:10
              </span>
            </div>
            <div className="text-5 text-6">
              <span className="adellesansarm-extra-extra-bold-midnight-23px"></span>
            </div>
            <div className="text-5 text-6">
              <span className="adellesansarm-extra-extra-bold-midnight-23px">
                5:30
              </span>
            </div>
            <div className="text-5 text-6">
              <span className="adellesansarm-extra-extra-bold-midnight-23px"></span>
            </div>
            <div className="text-5 text-6">
              <span className="adellesansarm-extra-extra-bold-midnight-23px">
                3:36
              </span>
            </div>
            <div className="text-5 text-6">
              <span className="adellesansarm-extra-extra-bold-midnight-23px"></span>
            </div>
            <div className="text-5 text-6">
              <span className="adellesansarm-extra-extra-bold-midnight-23px">
                3:30
              </span>
            </div>
            <div className="text-5 text-6">
              <span className="adellesansarm-extra-extra-bold-midnight-23px"></span>
            </div>
            <div className="text-5 text-6">
              <span className="adellesansarm-extra-extra-bold-midnight-23px">
                4:27
              </span>
            </div>
          </div>
          <img className="vector-13" src="img/vector-13.svg" alt="Vector 13" />
        </div>
      </div>
    </div>
  );
}
