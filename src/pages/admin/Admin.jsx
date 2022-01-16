import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { logout } from '../../utils/Auth';
import { readAllSimulations } from '../../adapters/Simulations';
import { Container, Button, Table } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css';
import './Admin.css'

export default function Admin() {
    const [simulations, setSimulations] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        document.title = "Admin Page";
        readAllSimulations().then((value) => setSimulations(value))
    }, []);

    function addBtnHandler(event) {
        event.preventDefault();
        navigate('/simulations/create');
    }

    function rowHandler(event, id) {
        event.preventDefault();
        navigate('/simulations/' + id);
    }

    function logoutBtnHandler(event) {
        event.preventDefault();
        if (window.confirm("Yakin ingin keluar?")) {
            logout(() => window.location.href = "/");
        }
    }

    if (simulations)
        return (
            <Container>
                <div className="mt-5 header">
                    <span className="fs-1">History Simulasi</span>
                    <Button variant="primary" onClick={addBtnHandler}>Tambah Simulasi</Button>
                </div>

                <Table responsive hover className="mt-3">
                    <thead>
                        <tr>
                            <th width='50'>No</th>
                            <th width='60%'>Jenis Simulasi</th>
                            <th>Tanggal Dibuat</th>
                        </tr>
                    </thead>
                    <tbody>
                        {simulations.map((simulation, i) => (
                            <tr key={i} className='simulations' onClick={event => rowHandler(event, simulation.simulationID)}>
                                <td className='number'>{simulation.simulationID}</td>
                                <td>
                                    <h3>{simulation.simulationType}</h3>
                                    <span>{simulation.goodsType}, {simulation.inflationType}</span>
                                </td>
                                <td>{simulation.timeCreated}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
                <Button variant="danger" onClick={logoutBtnHandler}>Log Out</Button>
            </Container>
        )
    else
        return (
            <Container>
                <div className="mt-5 header">
                    <span className="fs-1">History Simulasi</span>
                    <Button variant="primary" onClick={addBtnHandler}>Tambah Simulasi</Button>
                </div>

                <Table responsive hover className="mt-3">
                    <thead>
                        <tr>
                            <th width='50'>No</th>
                            <th width='60%'>Jenis Simulasi</th>
                            <th>Tanggal Dibuat</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className='simulations'>
                            <td className='number'>0</td>
                            <td>
                                <h3>Simulation Type</h3>
                                <span>Goods Type, Inflation Type</span>
                            </td>
                            <td>Date</td>
                        </tr>
                    </tbody>
                </Table>
                <Button variant="danger" onClick={logoutBtnHandler}>Log Out</Button>
            </Container>
        )
}