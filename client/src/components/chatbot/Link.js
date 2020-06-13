import React from 'react';
const  Link =({items})=>{

    return items.map(item=>(<div><a href={item}  type="application/octet-stream" download>Download</a>
</div>    )
    )
}

export default Link;