import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { logout } from '../../utils/Auth';
import { readAllSimulations } from '../../adapters/Simulations';
import { Container, Button, Table } from 'react-bootstrap'
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
                    {simulations ?
                        simulations.map((simulation, i) => (
                            <tr key={i} className='simulations' onClick={event => rowHandler(event, simulation.simulationID)}>
                                <td className='number'>{i + 1}</td>
                                <td>
                                    <h3>{simulation.simulationType}</h3>
                                    <span>{simulation.goodsType}, {simulation.inflationType}</span>
                                </td>
                                <td>{simulation.timeCreated}</td>
                            </tr>
                        ))
                        :
                        <tr><td colSpan={3}><h1 className='my-5 text-center'>Tidak ada Data</h1></td></tr>
                    }
                </tbody>
            </Table>
            <Button variant="danger" onClick={logoutBtnHandler}>Log Out</Button>
        </Container>
    )
}
