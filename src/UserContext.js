import React, { createContext, useState, useEffect} from "react"

const initUser = null;

const getInitialState = () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : initUser;
}

export const UserContext = createContext();

const UserContextProvider = (props) => {
    const [user, setUser] = useState(getInitialState);

    useEffect( () => {
        localStorage.setItem('user', JSON.stringify(user));
    }, [user]);

    const login = (user) => setUser(user);

    const logout = () => setUser(null);

    return (
        <UserContext.Provider value={{user, login, logout}}>
            {props.children}
        </UserContext.Provider>
    );
};
    
export default UserContextProvider;