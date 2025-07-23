import React from 'react'

const ListRendering = () => {
    const array=["kishore ram m"," ram","seetha"];
  return (
    <div>ListRendering
<ul>
    {array.map ((name,index)  => (
 <li key={index}>{name }</li>        
    ) )}
</ul>

    </div>
  )
}

export default ListRendering