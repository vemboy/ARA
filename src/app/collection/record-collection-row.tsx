"use client";

function RecordCollectionRow(props: any) {
  console.log(props.display_title)
  return (
    <>
      <div>
        {/* <div className="airtable-gallery-container"> */}
        <div style={{backgroundColor: `${props.color}`}} className="div-container-container"> 
          <div className="ARA_TITLE">ARA</div>
        <div className="div-container">
        <a>
          <img
            src={`${props.src}`}
            onClick={() => {
              props.setCurrentSong(
                `https://ara.directus.app/assets/${props.songId}`
              ),
                console.log(`https://ara.directus.app/assets/${props.songId}`),
                console.log(props);
            }}
            className="airtable-gallery"
          ></img>
        </a>
</div>

        <div className="text-container">


          <div>
          {props.display_title}

          </div>

        </div>
        </div>



      </div>
    </>
  );
}

export default RecordCollectionRow;
