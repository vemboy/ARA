"use client";

import Head from "next/head";
import React, { useState, useEffect } from "react";
import axios from "axios";
import RecordCollectionRow from './record-collection-row'

export default function Collection() {

  const [records, setRecords] = useState([]);

  useEffect(() => {
    axios
      .get("https://ara.directus.app/items/record_archive?limit=4")
      .then((response) => {
        console.log("Hello")
        console.log(response);
        
        const records = response.data.data.map((record: any) => {
          return {
            author: record.artist_original,
            title: record.title,
            image: record.record_image,
            id: record.id,
            genre: record.genre,
            year: record.year
          };
        });

        setRecords(records);
        console.log(records)
      });
      }, []);

      

  return (
    <div className="container-center-horizontal">
      <div className="collection screen">
        <h1 className="hello valign-text-middle">
          Collection <br></br> ՀԱԲԱԿԱԾՈՒ
        </h1>
        <div> 
        <div className="overlap-group11">
          <div className="flex-container-1169 flex-container adellesansarm-extra-extra-bold-midnight-34px">
            <div className="text valign-text-middle text-4">
              <span>
                <span className="adellesansarm-extra-extra-bold-midnight-34px">
                  SEARCH
                </span>{" "}
              </span>
            </div>
            <div className="text valign-text-middle text-4">
              <span>
                <span className="adellesansarm-extra-extra-bold-midnight-34px">
                  ՊՆԴՐԻ
                </span>{" "}
              </span>
            </div>
          </div>
          <div className="rectangle-104"></div>
        </div>
        <div className="group-34">
          <div className="flex-container-1171 flex-container adellesansarm-extra-extra-bold-midnight-45px">
            <div className="text-1 valign-text-middle text-4">
              <span>
                <span className="adellesansarm-extra-extra-bold-midnight-45px">
                  Filters
                </span>{" "}
              </span>
            </div>
            <div className="text-1 valign-text-middle text-4">
              <span>
                <span className="adellesansarm-extra-extra-bold-midnight-45px">
                  Ֆիլտերներ
                </span>{" "}
              </span>
            </div>
          </div>
        </div>
        <div className="group-35 adellesansarm-extra-extra-bold-midnight-34px">
          <div className="artist valign-text-middle">Artist +</div>
          <div className="genre valign-text-middle">Genre +</div>
          <div className="country valign-text-middle">Country –</div>
          <div className="year valign-text-middle">Year +</div>
          <div className="instruments valign-text-middle">Instruments +</div>
        </div>
        <div className="rectangle-54"></div>
        <div className="group-container">
          <div className="group-47">
            <div className="ellipse-container">
              <div className="ellipse-1"></div>
              <div className="ellipse-1"></div>
              <div className="ellipse-1"></div>
              <div className="ellipse-15"></div>
              <div className="ellipse-1"></div>
              <div className="ellipse-1"></div>
            </div>
            <div className="flex-container-1 flex-container adellesansarm-light-midnight-45px">
              <div className="text-2 text-4">
                <span className="adellesansarm-light-midnight-45px">
                  Argentina
                </span>
              </div>
              <div className="text-2 text-4">
                <span className="adellesansarm-light-midnight-45px">
                  Armenia
                </span>
              </div>
              <div className="text-2 text-4">
                <span className="adellesansarm-light-midnight-45px">
                  Brazil
                </span>
              </div>
              <div className="text-2 text-4">
                <span className="adellesansarm-light-midnight-45px">
                  Canada
                </span>
              </div>
              <div className="text-2 text-4">
                <span className="adellesansarm-light-midnight-45px">
                  Denmark
                </span>
              </div>
              <div className="text-2 text-4">
                <span className="adellesansarm-light-midnight-45px">
                  England UK
                </span>
              </div>
            </div>
          </div>
          <div className="group-48">
            <div className="ellipse-container">
              <div className="ellipse-1"></div>
              <div className="ellipse-1"></div>
              <div className="ellipse-1"></div>
              <div className="ellipse-15"></div>
              <div className="ellipse-1"></div>
              <div className="ellipse-1"></div>
            </div>
            <div className="flex-container-1 flex-container adellesansarm-light-midnight-45px">
              <div className="text-2 text-4">
                <span className="adellesansarm-light-midnight-45px">
                  France
                </span>
              </div>
              <div className="text-2 text-4">
                <span className="adellesansarm-light-midnight-45px">
                  Germany
                </span>
              </div>
              <div className="text-2 text-4">
                <span className="adellesansarm-light-midnight-45px">
                  Holland
                </span>
              </div>
              <div className="text-2 text-4">
                <span className="adellesansarm-light-midnight-45px">Italy</span>
              </div>
              <div className="text-2 text-4">
                <span className="adellesansarm-light-midnight-45px">
                  Jordan
                </span>
              </div>
              <div className="text-2 text-4">
                <span className="adellesansarm-light-midnight-45px">
                  Lebanon
                </span>
              </div>
            </div>
          </div>
          <div className="group-49">
            <div className="ellipse-container">
              <div className="ellipse-1"></div>
              <div className="ellipse-1"></div>
              <div className="ellipse-1"></div>
              <div className="ellipse-15"></div>
              <div className="ellipse-1"></div>
              <div className="ellipse-1"></div>
            </div>
            <div className="flex-container-1 flex-container adellesansarm-light-midnight-45px">
              <div className="text-2 text-4">
                <span className="adellesansarm-light-midnight-45px">Qatar</span>
              </div>
              <div className="text-2 text-4">
                <span className="adellesansarm-light-midnight-45px">
                  Russia
                </span>
              </div>
              <div className="text-2 text-4">
                <span className="adellesansarm-light-midnight-45px">
                  United States
                </span>
              </div>
              <div className="text-2 text-4">
                <span className="adellesansarm-light-midnight-45px">USSR</span>
              </div>
              <div className="text-2 text-4">
                <span className="adellesansarm-light-midnight-45px">
                  Uraguay
                </span>
              </div>
              <div className="text-2 text-4">
                <span className="adellesansarm-light-midnight-45px">
                  Venezuela
                </span>
              </div>
            </div>
          </div>
        </div>
</div>


        <div className="overlap-group-container">
          <div className="flex-row flex">
            <div className="flex-col flex">
              <div className="rectangle-3"></div>
              <div className="rectangle-3-1"></div>
            </div>
            <div className="flex-col flex">
              <div className="rectangle-3"></div>
              <div className="rectangle-3-1"></div>
            </div>
          </div>
          <div className="flex-row-1 flex-row-3">
            <div className="flex-col-1 flex-col-7">
              <div className="rectangle-4"></div>
              <div className="rectangle-4"></div>
              <div className="rectangle-4"></div>
            </div>
            <div className="flex-col-2 flex-col-7">
              <div className="rectangle-4-1"></div>
              <div className="rectangle-4-1"></div>
              <div className="rectangle-4-1"></div>
            </div>
          </div>
        </div>

                  <div className="group-65 group">
        {records.map(record => <RecordCollectionRow genre={record['genre'] ? record['genre'] : 'unknown genre'} year={record['year'] ? record['year'] : 'unknown year'} title={record['title']} author={record['author'].substring(0, 20)} src={`https://ara.directus.app/assets/${record['image'] ? record['image'] : 'bfcf94c6-e40d-4fe1-8fbc-df54dc96ec48'}`}></RecordCollectionRow>)}
</div>

        <div className="group-61">
          <div className="flex-row-2 flex-row-3">
            <div className="flex-col-3 flex-col-7">
              <div className="airtable-gallery"></div>
              <div className="overlap-group">
                <div className="airtable-gallery-4"></div>
                <img
                  className="r-11379693-1515454010-2972-1 r-11379693-1515454010-2972"
                  src=""
                  alt="R-11379693-1515454010-2972 10"
                />
              </div>
              <div className="airtable-gallery-6"></div>
              <div className="airtable-gallery-5"></div>
            </div>
            <div className="flex-col-4 flex-col-7">
              <div className="hello-body-6 adellesansarm-heavy-normal-midnight-15px">
                Avo Sarkissian <br></br>Աւօ Սարգիսյան
              </div>
              <div className="flex-container-110 flex-container adellesansarm-light-midnight-15px">
                <div className="text-3 text-4">
                  <span className="adellesansarm-lightitalic-light-midnight-15px"></span>
                </div>
                <div className="text-3 text-4">
                  <span className="adellesansarm-lightitalic-light-midnight-15px">
                    From Montreal With Love
                  </span>
                </div>
              </div>
              <div className="flex-container-1114 flex-container adellesansarm-semi-bold-mako-10px">
                <div className="text-3 text-4">
                  <span className="adellesansarm-semi-bold-mako-10px">
                    Canada
                  </span>
                </div>
                <div className="text-3 text-4">
                  <span className="adellesansarm-semi-bold-mako-10px">
                    Folk, World, &amp; Country
                  </span>
                </div>
                <div className="text-3 text-4">
                  <span className="adellesansarm-semi-bold-mako-10px">
                    1977
                  </span>
                </div>
              </div>
              <div className="hello-body-5 valign-text-middle adellesansarm-bold-mako-10px">
                SHARE →
              </div>
              <div className="hello-body-7 adellesansarm-heavy-normal-midnight-15px">
                Avo Sarkissian <br></br>Աւօ Սարգիսյան
              </div>
              <div className="flex-container-110 flex-container adellesansarm-light-midnight-15px">
                <div className="text-3 text-4">
                  <span className="adellesansarm-lightitalic-light-midnight-15px"></span>
                </div>
                <div className="text-3 text-4">
                  <span className="adellesansarm-lightitalic-light-midnight-15px">
                    From Montreal With Love
                  </span>
                </div>
              </div>
              <div className="flex-container-111 flex-container adellesansarm-semi-bold-mako-10px">
                <div className="text-3 text-4">
                  <span className="adellesansarm-semi-bold-mako-10px">
                    Canada
                  </span>
                </div>
                <div className="text-3 text-4">
                  <span className="adellesansarm-semi-bold-mako-10px">
                    Folk, World, &amp; Country
                  </span>
                </div>
                <div className="text-3 text-4">
                  <span className="adellesansarm-semi-bold-mako-10px">
                    1977
                  </span>
                </div>
              </div>
              <div className="hello-body-5 valign-text-middle adellesansarm-bold-mako-10px">
                SHARE →
              </div>
              <div className="hello-body-8 adellesansarm-heavy-normal-midnight-15px">
                Avo Sarkissian <br></br>Աւօ Սարգիսյան
              </div>
              <div className="flex-container-110 flex-container adellesansarm-light-midnight-15px">
                <div className="text-3 text-4">
                  <span className="adellesansarm-lightitalic-light-midnight-15px"></span>
                </div>
                <div className="text-3 text-4">
                  <span className="adellesansarm-lightitalic-light-midnight-15px">
                    From Montreal With Love
                  </span>
                </div>
              </div>
              <div className="flex-container-111 flex-container adellesansarm-semi-bold-mako-10px">
                <div className="text-3 text-4">
                  <span className="adellesansarm-semi-bold-mako-10px">
                    Canada
                  </span>
                </div>
                <div className="text-3 text-4">
                  <span className="adellesansarm-semi-bold-mako-10px">
                    Folk, World, &amp; Country
                  </span>
                </div>
                <div className="text-3 text-4">
                  <span className="adellesansarm-semi-bold-mako-10px">
                    1977
                  </span>
                </div>
              </div>
              <div className="hello-body-5 valign-text-middle adellesansarm-bold-mako-10px">
                SHARE →
              </div>
              <div className="hello-body-9 adellesansarm-heavy-normal-midnight-15px">
                Avo Sarkissian <br></br>Աւօ Սարգիսյան
              </div>
              <div className="flex-container-110 flex-container adellesansarm-light-midnight-15px">
                <div className="text-3 text-4">
                  <span className="adellesansarm-lightitalic-light-midnight-15px"></span>
                </div>
                <div className="text-3 text-4">
                  <span className="adellesansarm-lightitalic-light-midnight-15px">
                    From Montreal With Love
                  </span>
                </div>
              </div>
              <div className="flex-container-1117 flex-container adellesansarm-semi-bold-mako-10px">
                <div className="text-3 text-4">
                  <span className="adellesansarm-semi-bold-mako-10px">
                    Canada
                  </span>
                </div>
                <div className="text-3 text-4">
                  <span className="adellesansarm-semi-bold-mako-10px">
                    Folk, World, &amp; Country
                  </span>
                </div>
                <div className="text-3 text-4">
                  <span className="adellesansarm-semi-bold-mako-10px">
                    1977
                  </span>
                </div>
              </div>
              <div className="hello-body-5 valign-text-middle adellesansarm-bold-mako-10px">
                SHARE →
              </div>
            </div>
            <div className="flex-col-5 flex-col-7">
              <div className="airtable-gallery"></div>
              <div className="overlap-group5">
                <div className="group-57"></div>
                <img
                  className="r-11379693-1515454010-2972-9 r-11379693-1515454010-2972"
                  src=""
                  alt="R-11379693-1515454010-2972 9"
                />
              </div>
              <div className="airtable-gallery-7"></div>
              <div className="airtable-gallery-5"></div>
            </div>
          </div>
          <div className="flex-col-6 flex-col-7">
            <div className="overlap-group4">
              <p className="hello-body valign-text-middle adellesansarm-heavy-normal-midnight-15px">
                Avo Sarkissian / Աւօ Սարգիսյան
              </p>
              <div className="flex-container-111-1 adellesansarm-regular-normal-midnight-15px">
                <div className="text-3 text-4">
                  <span className="adellesansarm-heavyitalic-normal-midnight-15px"></span>
                </div>
                <div className="text-3 text-4">
                  <span className="adellesansarm-heavyitalic-normal-midnight-15px">
                    From Montreal With Love
                  </span>
                </div>
              </div>
            </div>
            <div className="flex-container-11 flex-container adellesansarm-semi-bold-mako-10px">
              <div className="text-3 text-4">
                <span className="adellesansarm-semi-bold-mako-10px">
                  Canada
                </span>
              </div>
              <div className="text-3 text-4">
                <span className="adellesansarm-semi-bold-mako-10px">
                  Folk, World, &amp; Country
                </span>
              </div>
              <div className="text-3 text-4">
                <span className="adellesansarm-semi-bold-mako-10px">1977</span>
              </div>
            </div>
            <div className="hello-body-5 valign-text-middle adellesansarm-bold-mako-10px">
              SHARE →
            </div>
            <div className="overlap-group1">
              <p className="hello-body valign-text-middle adellesansarm-heavy-normal-midnight-15px">
                Avo Sarkissian / Աւօ Սարգիսյան
              </p>
              <div className="flex-container-111-1 adellesansarm-regular-normal-midnight-15px">
                <div className="text-3 text-4">
                  <span className="adellesansarm-heavyitalic-normal-midnight-15px"></span>
                </div>
                <div className="text-3 text-4">
                  <span className="adellesansarm-heavyitalic-normal-midnight-15px">
                    From Montreal With Love
                  </span>
                </div>
              </div>
            </div>
            <div className="flex-container-11 flex-container adellesansarm-semi-bold-mako-10px">
              <div className="text-3 text-4">
                <span className="adellesansarm-semi-bold-mako-10px">
                  Canada
                </span>
              </div>
              <div className="text-3 text-4">
                <span className="adellesansarm-semi-bold-mako-10px">
                  Folk, World, &amp; Country
                </span>
              </div>
              <div className="text-3 text-4">
                <span className="adellesansarm-semi-bold-mako-10px">1977</span>
              </div>
            </div>
            <div className="hello-body-5 valign-text-middle adellesansarm-bold-mako-10px">
              SHARE →
            </div>
            <div className="overlap-group2">
              <p className="hello-body valign-text-middle adellesansarm-heavy-normal-midnight-15px">
                Avo Sarkissian / Աւօ Սարգիսյան
              </p>
              <div className="flex-container-111-1 adellesansarm-regular-normal-midnight-15px">
                <div className="text-3 text-4">
                  <span className="adellesansarm-heavyitalic-normal-midnight-15px"></span>
                </div>
                <div className="text-3 text-4">
                  <span className="adellesansarm-heavyitalic-normal-midnight-15px">
                    From Montreal With Love
                  </span>
                </div>
              </div>
            </div>
            <div className="flex-container-11 flex-container adellesansarm-semi-bold-mako-10px">
              <div className="text-3 text-4">
                <span className="adellesansarm-semi-bold-mako-10px">
                  Canada
                </span>
              </div>
              <div className="text-3 text-4">
                <span className="adellesansarm-semi-bold-mako-10px">
                  Folk, World, &amp; Country
                </span>
              </div>
              <div className="text-3 text-4">
                <span className="adellesansarm-semi-bold-mako-10px">1977</span>
              </div>
            </div>
            <div className="hello-body-5 valign-text-middle adellesansarm-bold-mako-10px">
              SHARE →
            </div>
            <div className="overlap-group3">
              <p className="hello-body valign-text-middle adellesansarm-heavy-normal-midnight-15px">
                Avo Sarkissian / Աւօ Սարգիսյան
              </p>
              <div className="flex-container-111-1 adellesansarm-regular-normal-midnight-15px">
                <div className="text-3 text-4">
                  <span className="adellesansarm-heavyitalic-normal-midnight-15px"></span>
                </div>
                <div className="text-3 text-4">
                  <span className="adellesansarm-heavyitalic-normal-midnight-15px">
                    From Montreal With Love
                  </span>
                </div>
              </div>
            </div>
            <div className="flex-container-11 flex-container adellesansarm-semi-bold-mako-10px">
              <div className="text-3 text-4">
                <span className="adellesansarm-semi-bold-mako-10px">
                  Canada
                </span>
              </div>
              <div className="text-3 text-4">
                <span className="adellesansarm-semi-bold-mako-10px">
                  Folk, World, &amp; Country
                </span>
              </div>
              <div className="text-3 text-4">
                <span className="adellesansarm-semi-bold-mako-10px">1977</span>
              </div>
            </div>
            <div className="hello-body-5 valign-text-middle adellesansarm-bold-mako-10px">
              SHARE →
            </div>
          </div>
        </div>
        <div className="rectangle-100"></div>
        <div className="overlap-group18">
          <div className="overlap-group17">
            <div className="overlap-group6">
              <p className="hello-body-10 adellesansarm-regular-normal-midnight-15px">
                <span className="adellesansarm-regular-normal-midnight-15px">
                  A1. Մոնթրէալ / Montreal<br></br>
                  <br></br>
                </span>
                <span className="adellesansarm-extra-extra-bold-midnight-15px">
                  A2. Յիշէ Այն Օրը / Hishe Ayn Ore<br></br>
                </span>
                <span className="adellesansarm-regular-normal-midnight-15px">
                  <br></br>A3. Ես Քեզ Սնիծ / Yes Kez Aniz<br></br>
                  <br></br>A4. Գինետուն / Kinedoun<br></br>
                  <br></br>A5. Մինակ Եմ Այսօր / Menag Yem Aysor
                </span>
              </p>
              <p className="hello-body-11 adellesansarm-regular-normal-midnight-15px">
                <span className="adellesansarm-regular-normal-midnight-15px">
                  A1. Մոնթրէալ / Montreal<br></br>
                  <br></br>
                </span>
                <span className="adellesansarm-extra-extra-bold-midnight-15px">
                  A2. Յիշէ Այն Օրը / Hishe Ayn Ore<br></br>
                </span>
                <span className="adellesansarm-regular-normal-midnight-15px">
                  <br></br>A3. Ես Քեզ Սնիծ / Yes Kez Aniz<br></br>
                  <br></br>A4. Գինետուն / Kinedoun<br></br>
                  <br></br>A5. Մինակ Եմ Այսօր / Menag Yem Aysor
                </span>
              </p>
              <p className="hello-body-12 adellesansarm-regular-normal-midnight-15px">
                <span className="adellesansarm-regular-normal-midnight-15px">
                  A1. Մոնթրէալ / Montreal<br></br>
                  <br></br>
                </span>
                <span className="adellesansarm-extra-extra-bold-midnight-15px">
                  A2. Յիշէ Այն Օրը / Hishe Ayn Ore<br></br>
                </span>
                <span className="adellesansarm-regular-normal-midnight-15px">
                  <br></br>A3. Ես Քեզ Սնիծ / Yes Kez Aniz<br></br>
                  <br></br>A4. Գինետուն / Kinedoun<br></br>
                  <br></br>A5. Մինակ Եմ Այսօր / Menag Yem Aysor
                </span>
              </p>
              <div className="hello-body-13 adellesansarm-regular-normal-midnight-15px">
                <span className="adellesansarm-regular-normal-midnight-15px">
                  <br></br>3:10<br></br>
                  <br></br>
                </span>
                <span className="adellesansarm-extra-extra-bold-midnight-15px">
                  5:30<br></br>
                </span>
                <span className="adellesansarm-regular-normal-midnight-15px">
                  <br></br>3:36<br></br>
                  <br></br>3:30<br></br>
                  <br></br>4:27
                </span>
              </div>
              <div className="hello-body-14 adellesansarm-regular-normal-midnight-15px">
                <span className="adellesansarm-regular-normal-midnight-15px">
                  <br></br>3:10<br></br>
                  <br></br>
                </span>
                <span className="adellesansarm-extra-extra-bold-midnight-15px">
                  5:30<br></br>
                </span>
                <span className="adellesansarm-regular-normal-midnight-15px">
                  <br></br>3:36<br></br>
                  <br></br>3:30<br></br>
                  <br></br>4:27
                </span>
              </div>
              <div className="hello-body-15 adellesansarm-regular-normal-midnight-15px">
                <br></br>3:10<br></br>
                <br></br>5:30<br></br>
                <br></br>3:36<br></br>
                <br></br>3:30
              </div>
              <div className="hello-body-16 adellesansarm-regular-normal-midnight-15px">
                <br></br>3:10<br></br>
                <br></br>5:30<br></br>
                <br></br>3:36<br></br>
                <br></br>3:30
              </div>
              <div className="hello-body-17 adellesansarm-regular-normal-midnight-15px">
                <br></br>3:10<br></br>
                <br></br>5:30<br></br>
                <br></br>3:36<br></br>
                <br></br>3:30
              </div>
              <p className="hello-body-18 adellesansarm-regular-normal-midnight-15px">
                B1. Իմ Եարիս / Im Yaris<br></br>
                <br></br>B2. Այն Օրէն Որ / Ayn Oren Vor<br></br>
                <br></br>B3. Տլէեաման / Dele Yaman<br></br>
                <br></br>B4. Մի Մեղք Ունեմ / Mi Mekhk Ounem
              </p>
              <p className="hello-body-19 adellesansarm-regular-normal-midnight-15px">
                B1. Իմ Եարիս / Im Yaris<br></br>
                <br></br>B2. Այն Օրէն Որ / Ayn Oren Vor<br></br>
                <br></br>B3. Տլէեաման / Dele Yaman<br></br>
                <br></br>B4. Մի Մեղք Ունեմ / Mi Mekhk Ounem
              </p>
              <p className="hello-body-20 adellesansarm-regular-normal-midnight-15px">
                B1. Իմ Եարիս / Im Yaris<br></br>
                <br></br>B2. Այն Օրէն Որ / Ayn Oren Vor<br></br>
                <br></br>B3. Տլէեաման / Dele Yaman<br></br>
                <br></br>B4. Մի Մեղք Ունեմ / Mi Mekhk Ounem
              </p>
              <div className="hello-body-21 adellesansarm-extra-extra-bold-midnight-15px">
                TRACKLIST/ԵՐԳԵՐԸ
              </div>
              <div className="hello-body-22 adellesansarm-extra-extra-bold-midnight-15px">
                TRACKLIST/ԵՐԳԵՐԸ
              </div>
              <div className="rectangle-101"></div>
              <div className="rectangle-102"></div>
              <div className="rectangle-103"></div>
            </div>
            <div className="hello-body-23 adellesansarm-regular-normal-midnight-15px">
              <span className="adellesansarm-regular-normal-midnight-15px">
                <br></br>3:10<br></br>
                <br></br>
              </span>
              <span className="adellesansarm-extra-extra-bold-midnight-15px">
                5:30<br></br>
              </span>
              <span className="adellesansarm-regular-normal-midnight-15px">
                <br></br>3:36<br></br>
                <br></br>3:30<br></br>
                <br></br>4:27
              </span>
            </div>
            <div className="overlap-group12">
              <div className="airtable-gallery-4"></div>
              <img
                className="r-11379693-1515454010-2972-1 r-11379693-1515454010-2972"
                src=""
                alt="R-11379693-1515454010-2972 13"
              />
            </div>
            <div className="airtable-gallery-8"></div>
            <div className="airtable-gallery-9"></div>
            <div className="hello-body-24 adellesansarm-heavy-normal-midnight-15px">
              Avo Sarkissian <br></br>Աւօ Սարգիսյան
            </div>
            <div className="hello-body-25 adellesansarm-heavy-normal-midnight-15px">
              Avo Sarkissian <br></br>Աւօ Սարգիսյան
            </div>
            <div className="flex-container-175 flex-container adellesansarm-light-midnight-15px">
              <div className="text-3 text-4">
                <span className="adellesansarm-lightitalic-light-midnight-15px"></span>
              </div>
              <div className="text-3 text-4">
                <span className="adellesansarm-lightitalic-light-midnight-15px">
                  From Montreal With Love
                </span>
              </div>
            </div>
            <div className="flex-container-176 flex-container adellesansarm-light-midnight-15px">
              <div className="text-3 text-4">
                <span className="adellesansarm-lightitalic-light-midnight-15px"></span>
              </div>
              <div className="text-3 text-4">
                <span className="adellesansarm-lightitalic-light-midnight-15px">
                  From Montreal With Love
                </span>
              </div>
            </div>
            <div className="flex-container-177 flex-container adellesansarm-semi-bold-mako-10px">
              <div className="text-3 text-4">
                <span className="adellesansarm-semi-bold-mako-10px">
                  Canada
                </span>
              </div>
              <div className="text-3 text-4">
                <span className="adellesansarm-semi-bold-mako-10px">
                  Folk, World, &amp; Country
                </span>
              </div>
              <div className="text-3 text-4">
                <span className="adellesansarm-semi-bold-mako-10px">1977</span>
              </div>
            </div>
            <div className="flex-container-178 flex-container adellesansarm-semi-bold-mako-10px">
              <div className="text-3 text-4">
                <span className="adellesansarm-semi-bold-mako-10px">
                  Canada
                </span>
              </div>
              <div className="text-3 text-4">
                <span className="adellesansarm-semi-bold-mako-10px">
                  Folk, World, &amp; Country
                </span>
              </div>
              <div className="text-3 text-4">
                <span className="adellesansarm-semi-bold-mako-10px">1977</span>
              </div>
            </div>
            <div className="flex-container-179 flex-container adellesansarm-semi-bold-mako-10px">
              <div className="text-3 text-4">
                <span className="adellesansarm-semi-bold-mako-10px">
                  Canada
                </span>
              </div>
              <div className="text-3 text-4">
                <span className="adellesansarm-semi-bold-mako-10px">
                  Folk, World, &amp; Country
                </span>
              </div>
              <div className="text-3 text-4">
                <span className="adellesansarm-semi-bold-mako-10px">1977</span>
              </div>
            </div>
            <div className="hello-body-26 valign-text-middle adellesansarm-bold-mako-10px">
              SHARE →
            </div>
            <div className="hello-body-27 valign-text-middle adellesansarm-bold-mako-10px">
              SHARE →
            </div>
            <div className="hello-body-28 valign-text-middle adellesansarm-bold-mako-10px">
              SHARE →
            </div>
          </div>
          <div className="hello-body-29 adellesansarm-extra-extra-bold-midnight-15px">
            TRACKLIST/ԵՐԳԵՐԸ
          </div>
          <div className="hello-body-30 adellesansarm-heavy-normal-midnight-15px">
            Avo Sarkissian <br></br>Աւօ Սարգիսյան
          </div>
          <div className="flex-container-174 flex-container adellesansarm-light-midnight-15px">
            <div className="text-3 text-4">
              <span className="adellesansarm-lightitalic-light-midnight-15px"></span>
            </div>
            <div className="text-3 text-4">
              <span className="adellesansarm-lightitalic-light-midnight-15px">
                From Montreal With Love
              </span>
            </div>
          </div>
        </div>
      </div>
      
    </div>
    
  );
}

