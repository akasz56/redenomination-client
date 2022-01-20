import { useEffect, useState } from 'react'
// import { useParams } from 'react-router-dom';
// import { readSimulation } from '../../adapters/Simulations'
// import LoadingComponent from '../../components/Loading';
import Ready from "./Ready";

export default function Participants() {
    // const [data, setData] = useState(false);
    // let urlParams = useParams();

    useEffect(() => {
        document.title = "Simulation " + data.id;

        // async function fetchData() {
        //     const res = await readSimulation(urlParams.id)
        //     if (res.status === 200) {
        //         setData(res.data);
        //         document.title = "Simulation " + res.data.id;
        //     } else if (res.status === 401) {
        //         console.log(res);
        //         window.alert("Tidak diizinkan mengakses");
        //     } else if (res.status === 404) {
        //         window.alert("Simulasi Tidak ditemukan");
        //         window.location.href = "/";
        //     } else {
        //         console.log(res)
        //         window.alert("Terjadi Kesalahan");
        //     }
        // }
        // fetchData();
    }, [
        // urlParams.id
    ]);

    // if (data)
    return <Ready data={data} />
    // else
    // return <LoadingComponent className='child' />
}

//------------- posted offer buyer
// Ready
// idleView
// FlashSale
// idleView
// FlashSale
// idleView
// FlashSale
//------------- posted offer seller
// Ready
// PostPrice
// idleView
// PostPrice
// idleView
// PostPrice
// idleView









const data = {
    id: "296b53f5-ec49-4c06-83d7-00dbba081a77",
    token: "SQIGDA180122",
    simulationType: "double auction",
    goodsType: "Elastis",
    goodsName: "laptop",
    goodsPic: "https://via.placeholder.com/800x600",
    inflationType: "Inflasi Tinggi",
    participantNumber: 4,
    avgTrxOccurrence: "0.00",
    avgTrxPrice: "0.00",
    timer: 4,
    timeCreated: "2022-01-18T12:03:28.263Z",
    timeLastRun: "2022-01-18T12:03:28.263Z",
    buyers: [
        {
            id: "53758baa-f417-475f-a33d-992c96409570",
            loginToken: "SQIGDA180122",
            unitValue: "3000.00"
        },
        {
            id: "befe0db3-83d8-47bf-9ea0-77b8533ff58b",
            loginToken: "SQIGDA180122",
            unitValue: "4000.00"
        }
    ],
    sellers: [
        {
            id: "001e9fd0-3ac2-451f-98d6-e40b017c0e18",
            loginToken: "SQIGDA180122",
            unitCost: "2000.00"
        },
        {
            id: "20b84e97-745d-4aac-8bec-097a269517d7",
            loginToken: "SQIGDA180122",
            unitCost: "1000.00"
        }
    ],
    sessions: [
        {
            id: "0279dae3-6fbd-4d94-82b1-e91e1e8bbf62",
            sessionType: "Ulangan Pertama",
            avgTrxOccurrence: "0.00",
            avgTrxPrice: "0.00",
            timer: 4,
            timeCreated: "2022-01-19T08:46:32.634Z",
            timeLastRun: "2022-01-19T08:46:32.634Z"
        }
    ]
}