//DRH846
//11280305
//CMPT 353

import '../css/HomePage.css'

import React, { useEffect, useState } from "react";
import NavBar from "../NavBar";
import ResultsPage from './ResultsPage';

export const HomePage = () => {
    const [servers, setServes] = useState([]);
    const [search, setSearch] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    // const [filteredServers, setFilteredServers] = useState([]);

    const fetchServers = async () => {
        fetch('http://localhost:81/servers', {
            method: 'GET',
            headers: { 'Content-type': 'application/json' }
        })
            .then(response => response.json())
            .then(data => setServes(data))
    }

    useEffect(() => {
        fetchServers();
    }, [])

    useEffect(() => {
        const fetchServer = async () => {
            var serversWithData = [];

            if (search.length !== 0) {
                servers.forEach(server => {
                    if (server.serverName.toLowerCase().includes(search.toLowerCase()) && !(serversWithData.includes(server))) {
                        serversWithData = [...serversWithData, server];
                    }
                    if (server.serverInfo.toLowerCase().includes(search.toLowerCase()) && !(serversWithData.includes(server))) {
                        serversWithData = [...serversWithData, server];
                    }
                    fetch(`http://localhost:81/server/${server.serverID}`, {
                        method: 'GET',
                        headers: { 'Content-type': 'application/json' },
                    })
                        .then(response => response.json())
                        .then(posts => {
                            posts.forEach(post => {
                                if (post.postData.toLowerCase().includes(search.toLowerCase()) && !(serversWithData.includes(server))) {
                                    serversWithData = [...serversWithData, server];
                                }
                                if (post.postUsername.toLowerCase().includes(search.toLowerCase()) && !(serversWithData.includes(server))) {
                                    serversWithData = [...serversWithData, server];
                                }
                            })
                        })
                        .then(() => {
                            setSearchResults(serversWithData);
                        })
                })
            }
        }

        fetchServer();
        // eslint-disable-next-line
    }, [search])

    const getFilteredServers = () => {
        if (searchResults.length === 0) {
            return servers;
        }
        else {
            return [...servers].filter(server => searchResults.includes(server));
        }
    };

    return (
        <>
            <NavBar canSearch={true} setSearch={setSearch} />
            <ResultsPage servers={getFilteredServers()} fetchServers={fetchServers} search={search} searchResults={searchResults}/>
        </>
    );
}