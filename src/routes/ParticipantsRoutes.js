import { Outlet } from 'react-router-dom';
import ProtectedRoute from "../utils/ProtectedRoute";
import { ParticipantsProvider } from '../contexts/ParticipantsContext'

export default function ParticipantsRoutes() {
    return (
        <ParticipantsProvider>
            <ProtectedRoute auth='participant'>
                <Outlet />
            </ProtectedRoute>
        </ParticipantsProvider>
    );
}
