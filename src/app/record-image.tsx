"use client";

import router from "next/router"

function RecordImage(props: any){
    return(

        // <div className="airtable-gallery-container">
        <a href={`/collection-detail/${props.id}`}>
          <div className="airtable-gallery-2">
            <img
              style={{width: "300px", height: "300px"}}
              src={`${props.src}`}
            
              alt=""
            />
          </div>
          </a>
        //  </div>
        
    )
}

export default RecordImage

