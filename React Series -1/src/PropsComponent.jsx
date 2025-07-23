import React from 'react';

const PropsComponent = ({name , age , isLogged , array }) => {
 
   return(
    <>
    {
     (isLogged) ?
    (<>
        <div className="mydiv"> <h1>User Logged Sucesfully !!!!</h1>  <span>My name is {name} my age is {age}</span></div>
        <div className="my" key={array.keys}>{array}</div>

    </>

    )
    :
    (
     <div className="div"><h1><b>User Logged Sucessfully </b></h1></div> 
    )
    }

    </>
   )

};

export default PropsComponent;
