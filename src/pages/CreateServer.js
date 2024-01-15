//DRH846
//11280305
//CMPT 353

import "../css/CreateServer.css"

import React, { useContext } from 'react';
import { UserContext } from "../UserContext";
import { useNavigate } from "react-router-dom";
import NavBar from '../NavBar';

export const CreateServer = () => {
    const { user } = useContext(UserContext);

    const navigate = useNavigate();

    const create = (serverNameInput, serverInfoInput) => {
        const serverName = serverNameInput.value;
        const serverInfo = serverInfoInput.value;

        const SERVERNAME_REGEX = /^(?=.{1,25}$)/;
        const SERVERINFO_REGEX = /^(?=.{1,250}$)/;

        if (!SERVERNAME_REGEX.test(serverName)) {
            alert(`Server name must be 25 charcters or less`);
            serverNameInput.value = "";
            serverInfoInput.value = "";
            return;
        }

        if (!SERVERINFO_REGEX.test(serverInfo)) {
            alert(`Server info must be 250 charcters or less`);
            serverNameInput.value = "";
            serverInfoInput.value = "";
            return;
        }

        fetch('http://localhost:81/server', {
            method: 'POST',
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify({
                serverCreator: user.username,
                serverName: serverName,
                serverInfo: serverInfo
            })
        })
        .then(response => {
            console.log(response, response.status);
            if (response.status === 201) {
                alert(`Server '${serverName}' has been created.`);
                navigate("/home", { replace: true });
            }
            else {
                alert(`Could not make '${serverName}'`);
                serverNameInput.value = "";
                serverInfoInput.value = "";
            }
        });
    }

    return (
        <>
            <NavBar canSearch={false}/>
            <div id="create-server-container">
                <div id="create-server-msg">Create A Server</div>

                <input className="create-server-input" type="text" placeholder="Server Name" id="serverName-input"></input>
                <input className="create-server-input" type="text" placeholder="About" id="serverInfo-input"></input>

                <button className="create-server-button" onClick={() => create(
                    document.getElementById("serverName-input"),
                    document.getElementById("serverInfo-input")
                )}>Create Server
                </button>

                <button className="create-server-back-button" onClick={() => { navigate("/home") }}> Back </button>
            </div>
        </>
    );
}

