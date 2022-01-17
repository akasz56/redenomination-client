import { Routes, Route } from 'react-router-dom';
import { Outlet, Navigate } from 'react-router-dom';
import { myRole } from "./utils/Auth";

import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Admin from "./pages/admin/Admin";
import Simulation from "./pages/admin/Simulation/Simulation";
import SimulationSummary from "./pages/admin/Simulation/Summary";
import SimulationCreate from "./pages/admin/Simulation/Create";
import SimulationEdit from "./pages/admin/Simulation/Edit";
import Session from "./pages/admin/Session/Session";
import SessionSummary from "./pages/admin/Session/Summary";
import Participants from "./pages/participants/Participants";
import Error404 from './pages/errors/Error404';

export default function App() {
	return (<>
		<Header />
		<Routes>

			<Route path="/">
				<Route index element={<Home />} />
				<Route path="login" element={<Login />} />
			</Route>

			<Route path="/" element={<ProtectedRoute for='admin' />}>
				<Route path="/simulations">
					<Route index element={<Admin />} />
					<Route path="create" element={<SimulationCreate />} />
					<Route path=":id">
						<Route index element={<Simulation />} />
						<Route path="edit" element={<SimulationEdit />} />
						<Route path="summary" element={<SimulationSummary />} />
					</Route>
				</Route>
				<Route path="/sessions/:id">
					<Route index element={<Session />} />
					<Route path="summary" element={<SessionSummary />} />
				</Route>
			</Route>

			<Route path="/" element={<ProtectedRoute for='participant' />}>
				<Route path="/participants">
					<Route index element={<Participants />} />
				</Route>
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
