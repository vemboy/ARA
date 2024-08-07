"use client";


import React, { useState, useEffect } from "react";
import axios from "axios";
import RecordImage from "./record-image";
import Link from "next/link";


export default function Home() {
  const [imageIds, setImageIds] = useState([]);

  useEffect(() => {
    axios
      .get("https://ara.directus.app/items/record_archive?limit=8")
      .then((response) => {
        console.log("CORRECT");
        console.log(response);
        const records = response.data.data.map((record: any) => {
          return {
            image: record.record_image,
            id: record.id,
          };
        });

        setImageIds(records);
        console.log(records);
      });

  }, []);
  return (
    <div>
      <input type="hidden" id="anPageName" name="page" value="frame-1" />
      <div className="container-center-horizontal">
        <div style={{height: "700px"}} className="frame-1 screen">
          <div className="overlap-group3">
            <div className="rectangle-137-2"></div>
            <div className="group-79-2">
              <div className="overlap-group2-2">
                <div className="ellipse-1-2"></div>
              </div>
              <div className="group-81">
                <div className="overlap-group">
                  <p className="armenian-record-arch valign-text-middle">
                    Armenian Record Archive is a nonprofit center for
                    inspiration, education, and community.
                  </p>
                  <div className="flex-container-515 flex-container adellesansarm-regular-normal-white-29px">
                    <div className="text valign-text-middle">
                      <span>
                        <span className="adellesansarm-regular-normal-white-29px">
                          Interested in helping out? We’re looking for folks to
                          help with digitization and historical research. If
                          you’re in a position to donate your time or resources
                          to support ARA, please email
                          hye@armenianrecordarchive.com.
                        </span>
                      </span>
                    </div>
                    <div className="text valign-text-middle">
                      <span>
                        <span className="adellesansarm-regular-normal-white-29px">
                          For more information, scroll down to the About Us
                          section.
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
                <div className="overlap-group">
                  <p className="armenian-record-arch valign-text-middle">
                    Armenian Record Archive-ը ոչշահագորձության կենտրոնա
                    երաժշտական արխիվ:
                  </p>
                  <div className="flex-container-517 flex-container adellesansarm-regular-normal-white-29px">
                    <div className="text valign-text-middle">
                      <span>
                        <span className="adellesansarm-regular-normal-white-29px">
                          Հետաքրքրվա՞ծ եք օգնել: Մենք փնտրում ենք մարդկանց,
                          որոնք կօգնեն թվայնացման և պատմական հետազոտությունների
                          հարցում: Եթե ​​ի վիճակի եք նվիրել ձեր ժամանակը կամ
                          ռեսուրսները ARA- ին աջակցելու համար, խնդրում ենք
                          ուղարկել hye@armenianrecordarchive.com էլ.
                        </span>
                      </span>
                    </div>
                    <div className="text valign-text-middle">
                      <span>
                        <span className="adellesansarm-regular-normal-white-29px">
                          Լրացուցիչ տեղեկությունների համար անցեք ներքև ՝ «Մեր
                          մասին» բաժինը:
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="group-80-2 adellesansarm-extra-extra-bold-white-16-3px-2">
              <div className="flex-container-58-2 flex-container">
                <div className="text-1 valign-text-middle">
                  <span>
                    <span className="adellesansarm-extra-extra-bold-white-16-3px-2">
                      <Link href="/collection">COLLECTION</Link>
                    </span>{" "}
                  </span>
                </div>
                <div className="text-1 valign-text-middle">
                  <span>
                    <span className="adellesansarm-extra-extra-bold-white-16-3px-2">
                      <Link href="/collection">ՀԱԲԱԿԱԾՈՒ</Link>
                    </span>{" "}
                  </span>
                </div>
              </div>
              <div className="flex-container-59 flex-container">
                <div className="text-1 valign-text-middle">
                  <span>
                    <span className="adellesansarm-extra-extra-bold-white-16-3px-2">
                      <Link href="#">CONTRIBUTE</Link>
                    </span>{" "}
                  </span>
                </div>
                <div className="text-1 valign-text-middle">
                  <span>
                    <span className="adellesansarm-extra-extra-bold-white-16-3px-2">
                      <Link href="#">ԱՋԱԿՑԵԼ</Link>
                    </span>{" "}
                  </span>
                </div>
              </div>
              <div className="flex-container-57 flex-container">
                <div className="text-1 valign-text-middle">
                  <span>
                    <span className="adellesansarm-extra-extra-bold-white-16-3px-2">
                      <Link href="javascript:scrollTo(AboutUs);">ABOUT US</Link>
                    </span>{" "}
                  </span>
                </div>
                <div className="text-1 valign-text-middle">
                  <span>
                    <span className="adellesansarm-extra-extra-bold-white-16-3px-2">
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
                    <span className="adellesansarm-extra-extra-bold-white-16-3px-2">
                      <Link href="javascript:scrollTo(Footer);">CONTACT</Link>
                    </span>{" "}
                  </span>
                </div>
                <div className="text-1 valign-text-middle">
                  <span>
                    <span className="adellesansarm-extra-extra-bold-white-16-3px-2">
                      <Link href="javascript:scrollTo(Footer);">ԿԱՊ</Link>
                    </span>{" "}
                  </span>
                </div>
              </div>
            </div>
            <h1 className="full-page-armenian-2 valign-text-middle">
              Armenian Record Archive
            </h1>
          </div>
        </div>
      </div>
      <input type="hidden" id="anPageName" name="page" value="macbook-pro-81" />
      <div className="container-center-horizontal">
        <div className="macbook-pro-81 screen">
          <div className="overlap-group1"></div>

          <div className="hello-body-container">
            <div>
              <div className="my_title_2">
                COLLECTION
                <br></br>
                ՀԱԲԱԿԱԾՈՒ
              </div>
            </div>
            <p className="hello-body">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean
              blandit dictum libero, ut congue nisl dapibus vel. Maecenas auctor
              laoreet nibh ac interdum. Quisque dapibus, enim eu tempor
              congueLorem ipsum dolor sit amet, consectetur adipiscing elit.
              Aenean blandit dictum libero, ut congue nisl dapibus vel. Maecenas
              auctor laoreet nibh ac interdum. Quisque dapibus, enim eu tempor
              congue..
            </p>
            <p className="hello-body">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean
              blandit dictum libero, ut congue nisl dapibus vel. Maecenas auctor
              laoreet nibh ac interdum. Quisque dapibus, enim eu tempor
              congue.Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Aenean blandit dictum libero, ut congue nisl dapibus vel. Maecenas
              auctor laoreet nibh ac interdum. Quisque dapibus, enim eu tempor
              congue.
            </p>
          </div>
          <Link href="/collection">
            <div className="hello-body-1 valign-text-bottom">
              View collection —&gt;
              <br />
              Հավակածուներ
            </div>
          </Link>
          <div className="overlap-group2">
            <div className="rectangle-16 rectangle">
              <div className="stat-page-container">
                <div className="stat-page-1">
                  <div className="stat-text-1">1,924</div>
                  <div className="stat-text-2">135</div>
                  <div className="stat-text-3">27</div>
                </div>
                <div className="stat-page-2">
                  <div className="stat-text-4">
                    Digitized Records
                    <br></br>
                    Տվանածված
                  </div>
                  <div className="stat-text-5">
                    Countries
                    <br></br>
                    Երգիներ
                  </div>
                  <div className="stat-text-6">
                    Contributors
                    <br></br>
                    Մասնակծողներ
                  </div>
                </div>
              </div>

              <div className="about-us-container" id="about-us">
                <div className="about-us-page-1">
                  <div className="about-us-title">About</div>
                  <div className="about-us-title-2">Us</div>
                </div>
                <div className="about-us-page-2">
                  <div className="about-us-text">
                    Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                    Nostrum numquam eaque sed, voluptate saepe voluptatibus
                    itaque minima veniam architecto rem, dolor nihil voluptatem.
                    Minima deserunt ratione, itaque dolorum
                  </div>
                </div>
              </div>

              <div className="footer-container" id="footer">
                <div className="footer-container-1">
                  <div className="footer-container-1-1">
                    <div className="footer-container-1-1-title">Contact</div>
                    <div className="footer-container-1-1-title-2">About</div>
                    <div className="footer-container-1-1-title-3">People</div>
                    <div className="footer-container-1-1-title-4">Culture</div>
                    <div className="footer-container-1-1-title-5">
                      Whitepaper
                    </div>
                  </div>
                  <div className="footer-container-1-2"></div>
                  <div className="footekr-container-1-3"></div>
                </div>
                <div className="footer-container-2">
                  <div className="footer-container-2-title">ARA</div>
                </div>
              </div>
            </div>
            <div className="group-65 group">

              {imageIds.map((record) => (
                <RecordImage
                  id={record["id"]}
                  src={`https://ara.directus.app/assets/${
                    record["image"]
                      ? record["image"]
                      : "bfcf94c6-e40d-4fe1-8fbc-df54dc96ec48"
                  }?key=thumbnail`}
                ></RecordImage>
              ))}
          
            </div>
          </div>
          <div className="overlap-group">`</div>
        </div>
      </div>
    </div>
  );
}

{
  /* <script>
            const AboutUs = document.getElementById("about-us");
            const Footer = document.getElementById("footer");

            console.log("Hello")

            function scrollTo(name) {
              console.log("hi")
              name.scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});
            }
          </script> */
}
