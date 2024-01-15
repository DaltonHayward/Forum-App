//DRH846
//11280305
//CMPT 353

import "../css/RegisterUser.css"

import React from 'react';
import { useNavigate } from "react-router-dom";

export const RegisterUser = () => {

    const navigate = useNavigate();

    const registerNewUser = (usernameInput, passwordInput) => {
        // get wanted username from database
        const wantedUsername = usernameInput.value.trim();
        const wantedPassword = passwordInput.value;

        const USERNAME_REGEX = /^(?=.{3,15}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/;
        const PASSWORD_REGEX = /^(?=.{8,20}$)^\w*$/

        if (!USERNAME_REGEX.test(wantedUsername)) {
            alert(`Username can be 3-15 character.\nUsername cannot start or end with '.' or '_'.\nUsername can only contain alphanumeric character, '.', and '_'.`);
            usernameInput.value = "";
            passwordInput.value = "";
            return;
        }

        if (!PASSWORD_REGEX.test(wantedPassword)) {
            alert(`Password can be 8-20 character and cannot contain spaces.`);
            usernameInput.value = "";
            passwordInput.value = "";
            return;
        }

        fetch(`http://localhost:81/username/${wantedUsername}`, {
            method: 'GET',
            headers: { 'Content-type': 'application/json' }
        })
            .then(response => response.json())
            .then(data => {
                // if username does not exist, register new user
                if (data.length === 0) {
                    fetch('http://localhost:81/registerUser', {
                        method: 'POST',
                        headers: { 'Content-type': 'application/json' },
                        body: JSON.stringify({
                            username: wantedUsername,
                            password: wantedPassword
                        })
                    });
                    // return to the login page
                    alert(`Account ${wantedUsername} has been created. Welcome!`);
                    navigate("/")
                }
                else {
                    alert(`${wantedUsername} is already taken.`);
                    usernameInput.value = "";
                    passwordInput.value = "";
                }
            });
    }

    return (
        <>
            <div id="register-container">
                <div id="register-msg">Registration</div>
                <div id="register-desc">Create a new account!</div>

                <input className="register-input" type="text" placeholder="Desired Username" id="username-input"></input>
                <input className="register-input" type="password" placeholder="Password" id="password-input"></input>

                <button className="register-button" onClick={() => registerNewUser(
                    document.getElementById("username-input"),
                    document.getElementById("password-input")
                )}>Register
                </button>

                <button className="register-back-button" onClick={() => { navigate("/") }}> Back </button>
            </div>
        </>

    );
}