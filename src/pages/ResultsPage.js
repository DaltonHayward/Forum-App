
import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../UserContext';

const ResultsPage = ({ servers, fetchServers, search, searchResults }) => {

    const { user } = useContext(UserContext);

    const [isDeleted, setIsDeleted] = useState(false);

    const navigate = useNavigate();

    const deleteServer = (serverID) => {
        setIsDeleted(true);
        if (window.confirm("Are you sure you want to remove this post?")) {
            fetch(`http://localhost:81/server`, {
                method: 'DELETE',
                headers: { 'Content-type': 'application/json' },
                body: JSON.stringify({
                    serverID: serverID
                })
            }).then(() => { fetchServers(); });
        }
        else {
            setIsDeleted(false);
        }
    }

    const handleServerClick = (server) => {
        navigate(`/server/${server.serverID}/${server.serverName}`)
    }

    // server available to render
    const renderServers = servers.map(server =>
        <div key={server.serverID} className="server">
            <div onClick={() => handleServerClick(server)}>
                <div className="server-name">{server.serverName}</div>
                <div className="server-info">{server.serverInfo}</div>
            </div>
            {((user.username === server.serverCreator) || (user.isAdmin === 1)) &&
                <div className="server-delete-button" disabled={isDeleted} onClick={() => deleteServer(server.serverID)}>
                    🗑
                </div>}
        </div>
    );

    // // no server to render
    // const renderNoServers =
    //     <div className="server">
    //         <div >
    //             <div className="server-name">Currently No Servers (⌣́_⌣̀)</div>
    //             <div className="server-info">Create one in the Create Server page!</div>
    //         </div>
    //     </div>

    const renderNoFoundServers =
        <div className="server">
            <div >
                <div className="server-name">No Servers containing '{search}'.</div>
                <div className="server-info">Try another search.</div>
            </div>
        </div>


                console.log(servers);
    return (
        <div id='servers' className="grow">
            {(servers.length > 0 && search.length > 0 && searchResults.length === 0) && renderNoFoundServers}
            {renderServers}
            
            
        </div>
    )
}

export default ResultsPage;