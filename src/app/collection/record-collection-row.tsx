function RecordCollectionRow(props: any){
    return(
      <>
        <div className="airtable-gallery-container">
          <img src={`${props.src}`} className="airtable-gallery"></img>
          <img src={`${props.src}`} className="airtable-gallery-1"></img>
          <img src={`${props.src}`} className="airtable-gallery-1"></img>
          <img src={`${props.src}`} className="airtable-gallery-1"></img>
        </div>


        <div className="x-container adellesansarm-heavy-normal-midnight-15px">
          <p className="hello-body-2 valign-text-middle">
            {props.author}
          </p>
        </div>

        <div className="hello-body-container-3 adellesansarm-light-midnight-15px">
          <div className="hello-body-2 valign-text-middle">
            {props.title}
          </div>
          <div className="hello-body-3 valign-text-middle">
            {props.title}
          </div>
          <div className="hello-body-4 valign-text-middle">
            {props.title}
          </div>
          <div className="hello-body-4 valign-text-middle">
            {props.title}
          </div>
        </div>


                <div className="flexcontainer-container-1 adellesansarm-semi-bold-mako-10px">
          <div className="flex-container-1148 flex-container">
            <div className="text-3 text-4">
              <span className="adellesansarm-semi-bold-mako-10px">Canada</span>
            </div>
            <div className="text-3 text-4">
              <span className="adellesansarm-semi-bold-mako-10px">
                {props.genre}
              </span>
            </div>
            <div className="text-3 text-4">
              <span className="adellesansarm-semi-bold-mako-10px">{props.year}</span>
            </div>
          </div>
          <div className="flex-container-1149 flex-container">
            <div className="text-3 text-4">
              <span className="adellesansarm-semi-bold-mako-10px">Canada</span>
            </div>
            <div className="text-3 text-4">
              <span className="adellesansarm-semi-bold-mako-10px">
                {props.genre}
              </span>
            </div>
            <div className="text-3 text-4">
              <span className="adellesansarm-semi-bold-mako-10px">{props.year}</span>
            </div>
          </div>
          <div className="flex-container-1150 flex-container">
            <div className="text-3 text-4">
              <span className="adellesansarm-semi-bold-mako-10px">Canada</span>
            </div>
            <div className="text-3 text-4">
              <span className="adellesansarm-semi-bold-mako-10px">
                {props.genre}
              </span>
            </div>
            <div className="text-3 text-4">
              <span className="adellesansarm-semi-bold-mako-10px">{props.year}</span>
            </div>
          </div>
          <div className="flex-container-1151 flex-container">
            <div className="text-3 text-4">
              <span className="adellesansarm-semi-bold-mako-10px">Canada</span>
            </div>
            <div className="text-3 text-4">
              <span className="adellesansarm-semi-bold-mako-10px">
                {props.genre}
              </span>
            </div>
            <div className="text-3 text-4">
              <span className="adellesansarm-semi-bold-mako-10px">{props.year}</span>
            </div>
          </div>
        </div>
      </>
    )
}

export default RecordCollectionRow