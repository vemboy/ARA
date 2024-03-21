function RecordImage(props: any){
    return(

        // <div className="airtable-gallery-container">
          <div className="airtable-gallery-2">
            <img
              style={{width: "300px", height: "300px"}}
              src={`${props.src}`}
            
              alt=""
            />
          </div>
        //  </div>
    )
}

export default RecordImage