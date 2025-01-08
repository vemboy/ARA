"use client";

function PageNumbers(props: any){
    
    const myPages = []
    for(let i = 1; i < props.amountOfPages + 1; i++) {
        console.log(i)
        myPages.push(i)
    }

    return(
      <div>
        {myPages.map(pages => <div>{pages}</div>)}
    </div>
    )
}

export default PageNumbers