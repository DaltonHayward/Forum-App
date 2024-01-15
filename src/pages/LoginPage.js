//DRH846
//11280305
//CMPT 353

import "../css/LoginPage.css"

import React, { useContext } from 'react';
import { useNavigate } from "react-router-dom";
import { UserContext } from '../UserContext';

export const LoginPage = () => {
    const { login } = useContext(UserContext);

    const navigate = useNavigate();

    const authenticateUser = (usernameInput, passwordInput) => { // check credentials
        const username = usernameInput.value;
        const password = passwordInput.value;

        // handle blank forms 
        if (username === "" || password === "") {
            alert("Username or password is incorrect.");
            usernameInput.value = "";
            passwordInput.value = "";
            return;
        }
        // verify login info provided by user
        fetch(`http://localhost:81/verifyLogin/${username}/${password}`, {
            method: 'GET',
            headers: { 'Content-type': 'application/json' }
        })
            .then(response => response.json())
            .then(match => {
                // if username and password match
                if (match === true) {
                    fetch(`http://localhost:81/username/${username}`, {
                        method: 'GET',
                        headers: { 'Content-type': 'application/json' }
                    })
                        .then(response => response.json())
                        .then(user => {
                            login(user[0]);
                            navigate("/home");
                        });
                }
                // handle username that isnt in the db / wrong password
                if (!match || match.length === 0) {
                    alert("Username or password is incorrect.");
                    usernameInput.value = "";
                    passwordInput.value = "";
                }
            });
    }

    return (
        <div id="login-container">

            <div id="welcome-msg">Welcome</div>
            <div id="welcome-desc">Sign in to join the discussion!</div>

            <input className="login-input" type="text" placeholder="Username" id="username-input"></input>
            <input className="login-input" type="password" placeholder="Password" id="password-input"></input>

            <button className="login-button" onClick={() => authenticateUser(
                document.getElementById("username-input"),
                document.getElementById("password-input")
            )}>Login
            </button>

            <button className="login-register-button" onClick={() => { navigate("/registration"); }}>Register new user</button>
        </div>

    );
};