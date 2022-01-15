import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { logout } from '../../utils/Auth';
import { readAllSimulations } from '../../adapters/Simulations';
import { Container, Button, Table } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css';
import './Admin.css'

export default function Admin() {
    const [simuData, setSimuData] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        document.title = "Admin Page";
        readAllSimulations().then((value) => setSimuData(value))
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
                    {simuData ?
                        (simuData.map((res, index) => (
                            <tr key={index} className='simulations' onClick={event => rowHandler(event, index)}>
                                <td className='number'>{res.simulationID}</td>
                                <td>
                                    <h3>{res.simulationType}</h3>
                                    <span>{res.goodsType}, {res.inflationType}</span>
                                </td>
                                <td>{res.date}</td>
                            </tr>
                        )))
                        :
                        <tr className='simulations'>
                            <td className='number'>0</td>
                            <td>
                                <h3>Simulation Type</h3>
                                <span>Goods Type, Inflation Type</span>
                            </td>
                            <td>Date</td>
                        </tr>
                    }
                </tbody>
            </Table>
            <Button variant="danger" onClick={logoutBtnHandler}>Log Out</Button>
        </Container>
    )
}
