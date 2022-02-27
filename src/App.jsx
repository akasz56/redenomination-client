import { Routes, Route, Outlet, Navigate } from 'react-router-dom';
import { myRole } from './Utils';

import { Header, Footer } from "./components/Layouts";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Admin from "./pages/admin/Admin";

import Simulation from "./pages/admin/Simulation/Simulation";
import SimulationCreate from "./pages/admin/Simulation/Create";
import SimulationEdit from "./pages/admin/Simulation/Edit";

import Session from "./pages/admin/Session/Session";

import Participants from './pages/participants/Participants';

import Error404 from './pages/errors/Error404';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function App() {
	return (<>
		<Header />
		<Routes>

			<Route path="/">
				<Route index element={<Homepage />} />
				<Route path="login" element={<Login />} />
				<Route path="participant" element={<Participants />} />
			</Route>

			<Route path="/" element={<ProtectedRoute for='admin' />}>
				<Route path="admin">
					<Route index element={<Admin />} />
				</Route>
				<Route path="simulations">
					<Route index element={<Navigate to='/admin' />} />
					<Route path="create" element={<SimulationCreate />} />
					<Route path=":id">
						<Route index element={<Simulation />} />
						<Route path="edit" element={<SimulationEdit />} />
					</Route>
				</Route>
				<Route path="sessions">
					<Route index element={<Navigate to='/admin' />} />
					<Route path=":id">
						<Route index element={<Session />} />
					</Route>
				</Route>
				<Route path="participant/*" element={<Participants />} />
			</Route>

			<Route path="*" element={<Error404 />} />

		</Routes>
		<Footer />
	</>)
}

function Homepage() {
	if (myRole() === 'admin') {
		return <Navigate to='/admin' />
	} else {
		return <Home />
	}
}

function ProtectedRoute(props) {
	if (props.for === myRole()) {
		return <Outlet />;
	} else {
		return <Navigate to='/' />;
	}
}