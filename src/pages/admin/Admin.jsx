import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { Container, Button, Table } from 'react-bootstrap'
import { CSVLink } from 'react-csv';
import dayjs from "dayjs";
import "dayjs/locale/id";
import { purgeShortlived, readAllSimulations, readAnovaCSV } from '../../adapters/Simulations';
import LoadingComponent from '../../components/Loading';
import { capitalize, logout, printLog } from '../../Utils';
import './Admin.css'

export default function Admin() {
    const [loading, setLoading] = useState(true);
    const [simulations, setSimulations] = useState(null);
    const [noData, setNoData] = useState(true);
    const [summary, setSummary] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        document.title = "Halaman Admin";

        async function fetchData() {
            const res = await readAllSimulations();
            if (res.status === 200) {
                setSimulations(res.data);
                setLoading(false)
            } else if (res.status === 401) {
                logout(window.location.href = "/");
            } else if (res.status === 404) {
                setLoading(false)
                printLog(res);
                window.alert("Data tidak ditemukan");
            } else {
                setLoading(false)
                printLog(res);
                window.alert("Terjadi Kesalahan");
            }
        }
        async function fetchAnova() {
            const res = await readAnovaCSV();
            if (res.status === 200) {
                setSummary(res.data);
                setLoading(false)
            } else if (res.status === 401) {
                logout(window.location.href = "/");
            } else if (res.status === 404) {
                setLoading(false)
                printLog(res);
                window.alert("Data tidak ditemukan");
            } else {
                setLoading(false)
                printLog(res);
                window.alert("Terjadi Kesalahan");
            }
        }

        fetchData();
        fetchAnova();
    }, []);

    useEffect(() => {
        if (simulations) {
            if (simulations.length !== 0) {
                setNoData(false)
            }
        }
    }, [simulations])

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
            logout(window.location.href = "/")
        }
    }

    async function clearBtn(e) {
        e.preventDefault();

        setLoading(true)
        const res = await purgeShortlived();
        if (res.status === 200) {
            alert("Data berhasil dibersihkan");
        } else if (res.status === 401) {
            printLog(res);
            window.alert("Tidak diizinkan mengakses");
        } else {
            printLog(res);
            alert("Terjadi Kesalahan, mohon coba lagi");
        }
        setLoading(false)
    }

    return (
        <Container>
            <section className="mt-5 header">
                <span className="fs-1">Daftar Simulasi</span>
                <Button variant="primary" onClick={addBtnHandler}>Tambah Simulasi</Button>
            </section>

            {summary ?
                <>
                    <CSVLink filename={"Output Struktur Data hasil eksperimen " + dayjs().locale("id").format("dddd, D MMM YYYY")} data={summary} className="btn btn-primary">
                        <i className='bx bx-download'></i> Download Struktur Data hasil eksperimen
                    </CSVLink>
                    <Button variant='danger' className='d-block mt-3' onClick={clearBtn}> <i className='bx bx-trash'></i> Bersihkan Data</Button>
                </>
                :
                <></>
            }
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
                        (noData ?
                            <tr>
                                <td colSpan={3} className='text-center py-5'>
                                    <h1>No Data</h1>
                                    <Button variant="primary" onClick={addBtnHandler}>Tambah Simulasi</Button>
                                </td>
                            </tr>
                            :
                            (simulations.map((simulation, i) => (
                                <tr key={i} className='simulations' onClick={e => rowHandler(e, simulation.id)}>
                                    <td className='number'>{i + 1}</td>
                                    <td>
                                        <h3>{capitalize(simulation.simulationType)}, {simulation.participantNumber} peserta</h3>
                                        <span>{simulation.goodsType} ({simulation.goodsName}), {simulation.inflationType}, Pertumbuhan Ekonomi {simulation.growthType}</span>
                                    </td>
                                    <td>{dayjs(simulation.timeCreated).locale("id").format("dddd, D MMM YYYY")}</td>
                                </tr>
                            )))
                        )
                    }
                </tbody>
            </Table>

            <section className="d-flex flex-row-reverse">
                <Button variant="danger" className='' onClick={logoutBtnHandler}>Log Out</Button>
            </section>
        </Container>
    )
}
