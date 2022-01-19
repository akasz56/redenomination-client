import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { Container, Button, Table } from 'react-bootstrap'
import dayjs from "dayjs";
import "dayjs/locale/id";
import { readAllSimulations } from '../../adapters/Simulations';
import LoadingComponent from '../../components/Loading';
import { capitalize } from '../../Utils';
import './Admin.css'

export default function Admin() {
    const [simulations, setSimulations] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        document.title = "Halaman Admin";
        readAllSimulations().then((value) => {
            setSimulations(value.data);
        })
    }, []);

    function addBtnHandler(e) {
        e.preventDefault();
        navigate('/simulations/create');
    }

    function rowHandler(e, id) {
        e.preventDefault();
        navigate('/simulations/' + id);
    }

    function logoutBtnHandler(e) {
        e.preventDefault();
        if (window.confirm("Yakin ingin keluar?")) {
            localStorage.removeItem('auth');
            window.location.href = "/"
        }
    }

    return (
        <Container>
            <div className="mt-5 header">
                <span className="fs-1">Daftar Simulasi</span>
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
                            <tr key={i} className='simulations' onClick={e => rowHandler(e, simulation.id)}>
                                <td className='number'>{i + 1}</td>
                                <td>
                                    <h3>{capitalize(simulation.simulationType)}</h3>
                                    <span>{simulation.goodsType}, {simulation.inflationType}</span>
                                </td>
                                <td>{dayjs(simulation.timeCreated).locale("id").format("dddd, D MMM YYYY")}</td>
                            </tr>
                        ))
                        :
                        <tr><td colSpan={3}><LoadingComponent className="mx-auto my-5" /></td></tr>
                    }
                </tbody>
            </Table>
            <Button variant="danger" onClick={logoutBtnHandler}>Log Out</Button>
        </Container>
    )
}
