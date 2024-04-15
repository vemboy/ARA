function RecordCollectionRow(props: any){
    return(
      <>
        <div>
        {/* <div className="airtable-gallery-container"> */}
          <a href={`/collection-detail/${props.id}`}><img src={`${props.src}`} className="airtable-gallery"></img></a>

       {/* </div> */}


        {/* <div className="x-container adellesansarm-heavy-normal-midnight-15px"> */}
          <p className="hello-body-2 valign-text-middle">
            {props.author}
          </p>
        {/* </div> */}

        {/* <div className="hello-body-container-3 adellesansarm-light-midnight-15px"> */}
          <div className="hello-body-2 valign-text-middle">
            {props.title}
          </div>
        {/* </div> */}


                {/* <div className="flexcontainer-container-1 adellesansarm-semi-bold-mako-10px"> */}
          {/* <div className="flex-container-1148 flex-container"> */}
          <div className="text-33-wrapper">
            <div className="text-33">
              <span className="adellesansarm-semi-bold-mako-10px">Canada - </span>
            </div>
            <div className="text-33">
              <span className="adellesansarm-semi-bold-mako-10px">
                - {props.genre} - 
              </span>
            </div>
            <div className="text-33">
              <span className="adellesansarm-semi-bold-mako-10px"> - {props.year}</span>
            </div>
            </div>
          {/* </div> */}
         
        {/* </div> */}
</div>
      </>
    )
}

export default RecordCollectionRow