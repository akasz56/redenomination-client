import { Outlet, Navigate } from 'react-router-dom';
import { isAdmin, myRole } from "./Auth";

export default function ProtectedRoute(auth) {
    if (isAdmin() || auth === myRole) {
        return <Outlet />;
    } else {
        return <Navigate to='/login' />;
    }
}
