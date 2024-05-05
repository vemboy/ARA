"use client";

function RecordCollectionRowDifferent(props: any){
    return(
      <>
        <div>
              <img src={`${props.src}`} className="airtable-gallery"></img>
  
            </div>
            <div className="flex-col-4 flex-col-7">
              <div className="hello-body-6 adellesansarm-heavy-normal-midnight-15px">
                {props.title} <br></br> {props.title_armenian}
              </div>
              <div className="flex-container-110 flex-container adellesansarm-light-midnight-15px">
                <div className="text-3 text-4">
                  <span className="adellesansarm-lightitalic-light-midnight-15px"></span>
                </div>
                <div className="text-3 text-4">
                  <span className="adellesansarm-lightitalic-light-midnight-15px">
                    {props.author}
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
          </div>
      </>
    )
}

export default RecordCollectionRowDifferent