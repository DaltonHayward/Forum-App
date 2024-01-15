//DRH846
//11280305
//CMPT 353

import "./css/NavBar.css";

import React, { useContext, useState } from "react";
import { NavLink } from "react-router-dom";
import { UserContext } from "./UserContext";

const NavBar = ({ canSearch, setSearch }) => {
    const { user, logout } = useContext(UserContext);

    const [searchActive, setSearchActive] = useState(false);

    const logoutHandler = () => {
        if (window.confirm("Are you sure want to logout?")) {
            logout();
        }
    };

    const toggleSearchActive = (searchElement) => {
        if (searchActive) {
            setSearchActive(false);
            setSearch("");
            searchElement.className = "search-button";
        } else {
            setSearchActive(true);
            searchElement.className += " active";
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        setSearch(event.target[0].value);
    }

    return (
        <nav>
            <ul>
                <li className="nav-a">
                    <div className="welcome-message">Welcome {user.username}</div>
                </li>
                <li className="nav-a">
                    <NavLink to="/home" className="nav-link">
                        Server List
                    </NavLink>
                </li>
                <li className="nav-a">
                    <NavLink to="/server" className="nav-link">
                        Create Server
                    </NavLink>
                </li>
                <li className="nav-a">
                    <a id="logout-button" href="/" onClick={() => logoutHandler()}>
                        Logout
                    </a>
                </li>
                <li className="nav-a">
                    {canSearch &&
                        <div className="search-container">
                            {searchActive && (
                                <div className="search-input-container">
                                    <form onSubmit={handleSubmit}>
                                        <input
                                            type="text"
                                            placeholder="Search"
                                            id="search-input"
                                        ></input>
                                        <input type="submit" style={{ display: 'none', height: 0, width: 0 }}></input>    
                                    </form>
                                </div>
                            )}
                            <div
                                id="search-btn"
                                className="search-button"
                                onClick={() => {
                                    toggleSearchActive(document.getElementById("search-btn"));
                                }}
                            >
                                🔎︎
                            </div>
                        </div>
                    }
                </li>
            </ul>
        </nav>
    );
}

export default NavBar;