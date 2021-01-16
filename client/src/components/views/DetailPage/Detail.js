
import React from 'react'
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

function Detail() {
    const user = useSelector((state) => state.user);
    return (
        <div>
                           <Link to={{
  pathname: '/chat',
  state: { params: {buyer: user.userData && user.userData._id, seller: "60030df3abde4f2058b3e08a"} }
}}> My Link </Link>
        </div>
    )
}

export default Detail
