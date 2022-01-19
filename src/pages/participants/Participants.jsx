import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { readSimulation } from '../../adapters/Simulations'
import LoadingComponent from '../../components/Loading';
import Ready from "./Ready";

export default function Participants() {
    const [dataGet, setDataGet] = useState(false);
    let urlParams = useParams();

    useEffect(() => {
        document.title = "No Data";
        readSimulation(urlParams.id)
            .then((res) => {
                if (res.status === 200) {
                    setDataGet(res.data);
                    document.title = "Simulation " + res.data.id;
                } else {
                    window.alert("Simulasi Tidak ditemukan");
                    window.location.href = "/";
                }
            })
            .catch((err) => {
                console.log(err)
                window.alert("Terjadi Kesalahan");
            })
    }, [urlParams.id]);

    if (dataGet)
        return <Ready />
    else
        return <LoadingComponent className='child' />
}