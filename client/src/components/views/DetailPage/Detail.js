
import React from 'react'
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

function Detail() {
    const user = useSelector((state) => state.user);
    return (
        <div>
            <Link to={{
                pathname: '/chat',
                state: { params: { buyer: user.userData && user.userData._id, seller: "60043dfb03ef5437f44344e2" } }
            }}> My Link </Link>
        </div>
    )
}

export default Detail
