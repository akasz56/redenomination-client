import React, { createContext } from 'react'

const AuthContext = createContext({});

const AuthProvider = (props) => {
    const [auth, setAuth] = useState(false);
    const [role, setRole] = useState(false);

    useEffect(() => {
        // Pull saved login state from localStorage / AsyncStorage
    }, []);

    const login = () => {
        sleep(2000).then(() => setLoggedIn(true));
    };

    const logout = () => {
        sleep(2000).then(() => setLoggedIn(false));
    };

    const authContextValue = {
        login,
        loggedIn,
        logout
    };

    return <AuthContext.Provider value={authContextValue} {...props} />;
};

const useAuth = () => React.useContext(AuthContext);
