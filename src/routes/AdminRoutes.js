import { Outlet } from 'react-router-dom';
import ProtectedRoute from "../utils/ProtectedRoute";
import { AdminProvider } from '../contexts/AdminContext'

export default function AdminRoutes() {
    return (
        <AdminProvider>
            <ProtectedRoute auth='admin'>
                <Outlet />
            </ProtectedRoute>
        </AdminProvider>
    );
}
