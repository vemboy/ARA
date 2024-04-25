function RecordCollectionRow(props: any){
    return(
      <>
        <div>
        {/* <div className="airtable-gallery-container"> */}
          <a /*href={`/collection-detail/${props.id}`}*/><img src={`${props.src}`} onClick={() => {props.setCurrentSong(`https://ara.directus.app/assets/${props.songId}`), console.log(`https://ara.directus.app/assets/${props.songId}`), console.log(props)}} className="airtable-gallery"></img></a>

       {/* </div> */}


        {/* <div className="x-container adellesansarm-heavy-normal-midnight-15px"> */}
          <p className="hello-body-2 valign-text-middle">
           <div style={{fontSize: "20px"}}> {props.author}</div>
          </p>
        {/* </div> */}

        {/* <div className="hello-body-container-3 adellesansarm-light-midnight-15px"> */}
          <div className="hello-body-2 valign-text-middle">
            {props.title}
            <div style={{display: "block"}}></div>
            {props.title_armenian}
          </div>
        {/* </div> */}


                {/* <div className="flexcontainer-container-1 adellesansarm-semi-bold-mako-10px"> */}
          {/* <div className="flex-container-1148 flex-container"> */}
          {/* <div className="text-33-wrapper">
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
            </div> */}
          {/* </div> */}
         
        {/* </div> */}
</div>
      </>
    )
}

export default RecordCollectionRow