import React, { createContext } from 'react'
import { connectAsAdmin, connectAsParticipant } from "../adapters/Authentication";

const AuthContext = createContext({});

export function AuthProvider(props) {
    const [auth, setAuth] = useState(false);
    const [role, setRole] = useState(null);

    useEffect(() => {
        // Pull saved login state from localStorage / AsyncStorage
        localStorage.getItem('auth')
    }, []);

    function login(role, password) {
        if (auth) {
            alert(`Anda sudah login sebagai ${role}`);
            return;
        }

        if (role === "admin")
            const result = await connectAsAdmin(password);
        else if (role === "participant")
            const result = await connectAsParticipant(password);

        switch (result.status) {
            case 200:
                localStorage.setItem('auth', "Bearer " + result.data.jwtToken);
                setAuth(true);
                setRole(role);
                break;

            default:
                alert(result.status);
                console.log(result);
                break;
        }
    };

    function logout() {
        localStorage.removeItem('auth');
        setAuth(false);
        setRole(null);
    }

    const authContextValue = {
        auth,
        role,
        login,
        logout,
    };

    return <AuthContext.Provider value={authContextValue} {...props} />;
};

export function useAuth() {
    return React.useContext(AuthContext)
};