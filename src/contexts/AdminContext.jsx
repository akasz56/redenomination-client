import { createContext, useContext, useState } from 'react';

const adminContext = createContext({});
const { Provider, Consumer } = adminContext;

function AdminProvider({ children, ...props }) {
    const [simulation, setSimulation] = useState({});
    const [session, setSession] = useState({});

    return (
        <Provider value={{ simulation, setSimulation, session, setSession }} {...props}>
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