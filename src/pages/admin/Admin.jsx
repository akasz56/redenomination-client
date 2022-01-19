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
    const [loading, setLoading] = useState(true);
    const [simulations, setSimulations] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        document.title = "Halaman Admin";

        async function fetchData() {
            const res = await readAllSimulations();
            if (res.status === 200) {
                setSimulations(res.data);
                setLoading(false)
            } else if (res.status === 401) {
                setLoading(false)
                console.log(res);
                window.alert("Tidak diizinkan mengakses");
            } else if (res.status === 404) {
                setLoading(false)
                console.log(res);
                window.alert("Data tidak ditemukan");
            } else {
                setLoading(false)
                console.log(res);
                window.alert("Terjadi Kesalahan");
            }
        }

        fetchData();
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
                    {loading ?
                        <tr><td colSpan={3}><LoadingComponent className="mx-auto my-5" /></td></tr>
                        :
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
                    }
                </tbody>
            </Table>
            <Button variant="danger" onClick={logoutBtnHandler}>Log Out</Button>
        </Container>
    )
}
