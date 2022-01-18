import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { logout } from '../../utils/Auth';
import { readAllSimulations } from '../../adapters/Simulations';
import { Container, Button, Table } from 'react-bootstrap'
import LoadingComponent from '../../components/Loading';
import dayjs from "dayjs";
import "dayjs/locale/id";
import './Admin.css'

export default function Admin() {
    const [simulations, setSimulations] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        document.title = "Admin Page";
        readAllSimulations().then((value) => {
            setSimulations(value.data);
        })
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

    function capitalize(string) {
        const words = string.split(" ");
        for (let i = 0; i < words.length; i++) {
            words[i] = words[i][0].toUpperCase() + words[i].substr(1);
        }
        return words.join(" ")
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
                            <tr key={i} className='simulations' onClick={event => rowHandler(event, simulation.id)}>
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
