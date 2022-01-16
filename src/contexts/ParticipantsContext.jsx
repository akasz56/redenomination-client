import { createContext, useContext, useState, useEffect } from 'react';

const participantsContext = createContext({});
const { Provider, Consumer } = participantsContext;

function ParticipantsProvider({ children, ...props }) {
    const [participants, setParticipants] = useState({});
    const [loading, setLoading] = useState(true);

    return (
        <Provider value={{ participants, loading }} {...props}>
            {children}
        </Provider>
    );
};

function useParticipantsContext() {
    const state = useContext(participantsContext);
    if (state === undefined) {
        throw new Error("participantsContext must be called within ParticipantsProvider");
    }
    return { ...state, };
};

export { ParticipantsProvider, Consumer as ParticipantsConsumer, useParticipantsContext };

export default participantsContext