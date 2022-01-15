import { Outlet, Navigate } from 'react-router-dom';
import { isAdmin, myRole } from "./Auth";

export default function ProtectedRoute(props) {
    if (isAdmin() || props.auth === myRole()) {
        return <Outlet />;
    } else {
        return <Navigate to='/' />;
    }
}
