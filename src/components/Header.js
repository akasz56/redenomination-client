import { Navbar, Container, Button } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
import { logout, isAdmin, isAuth } from '../utils/Auth';


export default function Header() {
    const handlerClick = (event) => {
        event.preventDefault();
        logout(() => {
            window.location.href = "/";
        });
    }

    return (
        <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
            <Container>
                <Navbar.Brand>
                    <Link to="/" className="fw-bold" style={{ color: "#ffffff", textDecoration: "none" }}>Redenomination Project</Link>
                </Navbar.Brand>
                {isAuth() ?
                    (isAdmin() ?
                        <Link to='/admin' className="btn btn-outline-light"><i className='bx bxs-dashboard' /> Dashboard</Link>
                        :
                        <Button variant="danger" onClick={handlerClick}>Log Out</Button>
                    )
                    :
                    <Link to='/login' className="btn btn-primary">Login as Admin</Link>
                }
            </Container>
        </Navbar >
    )
}
