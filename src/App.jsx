import { Routes, Route } from 'react-router-dom';
import { Outlet, Navigate } from 'react-router-dom';
import { myRole } from "./utils/Auth";

import { Header, Footer } from "./components/Layouts";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Admin from "./pages/admin/Admin";
import Simulation from "./pages/admin/Simulation/Simulation";
import SimulationSummary from "./pages/admin/Simulation/Summary";
import SimulationCreate from "./pages/admin/Simulation/Create";
import SimulationEdit from "./pages/admin/Simulation/Edit";
import Session from "./pages/admin/Session/Session";
import SessionSummary from "./pages/admin/Session/Summary";
import Ready from "./pages/participants/Ready";
import Error404 from './pages/errors/Error404';
import PostedOffer from './pages/participants/PostedOffer';
import DoubleAuction from './pages/participants/DoubleAuction';
import Decentralized from './pages/participants/Decentralized';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function App() {
	return (<>
		<Header />
		<Routes>

			<Route path="/">
				<Route index element={<Home />} />
				<Route path="login" element={<Login />} />
				<Route path="participant-test" element={<Test />} />
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
						<Route path="summary" element={<SimulationSummary />} />
					</Route>
				</Route>
				<Route path="sessions">
					<Route index element={<Navigate to='/admin' />} />
					<Route path=":id">
						<Route index element={<Session />} />
						<Route path="summary" element={<SessionSummary />} />
					</Route>
				</Route>
			</Route>

			<Route path="/" element={<ProtectedRoute for='participant' />}>
				<Route path="ready" element={<Ready />} />
				<Route path="Posted-offer" element={<PostedOffer />} />
				<Route path="double-auction" element={<DoubleAuction />} />
				<Route path="decentralized" element={<Decentralized />} />
			</Route>

			<Route path="*" element={<Error404 />} />

		</Routes>
		<Footer />
	</>)
}

function ProtectedRoute(props) {
	if (props.for === myRole()) {
		return <Outlet />;
	} else {
		return <Navigate to='/' />;
	}
}

function Test() {
	localStorage.setItem('auth', JSON.stringify({
		login: true,
		role: "participant",
		token: "Bearer yes"
	}))
	window.location.href = "/";
}
