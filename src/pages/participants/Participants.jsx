import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { readSimulation } from '../../adapters/Simulations'
import LoadingComponent from '../../components/Loading';
import Ready from "./Ready";

export default function Participants() {
    const [data, setData] = useState(false);
    let urlParams = useParams();

    useEffect(() => {
        document.title = "No Data";

        async function fetchData() {
            const res = await readSimulation(urlParams.id)
            if (res.status === 200) {
                setData(res.data);
                document.title = "Simulation " + res.data.id;
            } else if (res.status === 401) {
                setLoading(false)
                console.log(res);
                window.alert("Tidak diizinkan mengakses");
            } else if (res.status === 404) {
                window.alert("Simulasi Tidak ditemukan");
                window.location.href = "/";
            } else {
                console.log(err)
                window.alert("Terjadi Kesalahan");
            }
        }
        fetchData();
    }, [urlParams.id]);

    if (data)
        return <Ready data={data} />
    else
        return <LoadingComponent className='child' />
}