import { createContext, useContext, useState, useEffect } from 'react';

const adminContext = createContext({});
const { Provider, Consumer } = adminContext;

function AdminProvider({ children, ...props }) {
    const [admin, setAdmin] = useState({});
    const [loading, setLoading] = useState(true);

    return (
        <Provider value={{ admin, loading }} {...props}>
            {children}
        </Provider>
    );
};

function useAdminContext() {
    const state = useContext(adminContext);
    if (state === undefined) {
        throw new Error("adminContext must be called within AdminProvider");
    }
    return { ...state, };
};

export { AdminProvider, Consumer as AdminConsumer, useAdminContext };

export default adminContext