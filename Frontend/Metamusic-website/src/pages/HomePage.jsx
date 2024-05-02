import { Link, useOutletContext } from "react-router-dom";
import { useState, useRef, useEffect } from 'react';


export function HomePage({ logOut }) {
    const [user, setUser] = useOutletContext();
    const [isUserEditPage, setIsUserEditPage] = useState(false);

    return (
        <div>
            <h1>Hello World</h1>
            </div>
    );
}