import serverURL from "./serverURL";

const simulations = [
    {
        simulationID: 1,
        simulationType: "Double Auction",
        goodsType: "Barang Elastis",
        inflationType: "Inflasi Tinggi",
        date: "Jumat, 8 Jan 2022",
    },
    {
        simulationID: 2,
        simulationType: "Posted Offer",
        goodsType: "Barang Elastis",
        inflationType: "Inflasi Tinggi",
        date: "Jumat, 9 Jan 2022",
    },
    {
        simulationID: 3,
        simulationType: "Double Auction",
        goodsType: "Barang Elastis",
        inflationType: "Inflasi Tinggi",
        date: "Jumat, 10 Jan 2022",
    }
];

const simulation = {
    token: "1DA080122",
    timer: "8 menit",
    sessions: [
        {
            sessionID: 1,
            sessionType: "Ulangan Pertama",
            date: "Jumat, 8 Jan 2022",
        },
        {
            sessionID: 2,
            sessionType: "Ulangan Kedua",
            date: "Jumat, 9 Jan 2022",
        },
        {
            sessionID: 3,
            sessionType: "Ulangan Ketiga",
            date: "Jumat, 10 Jan 2022",
        }
    ]
}

export async function createSimulation(body) {
    // return await fetch(serverURL + "simulations/", {
    //     method: "POST",
    //     headers: {
    //         "Accept": "application/json",
    //         "Content-Type": "application/json"
    //     },
    //     body: JSON.stringify(body)
    // }).then(response => response.json());
}

export async function readAllSimulations() {
    return simulations;
    // return await fetch(serverURL + "simulations/")
    //     .then(response => response.json());
}

export async function readSimulation(id) {
    return Object.assign(simulations[id - 1], simulation);
    // return await fetch(serverURL + "simulations/" + id)
    //     .then(response => response.json());
}

export async function updateSimulation(id, body) {
    // return await fetch(serverURL + "simulations/" + id, {
    //     method: "PUT",
    //     headers: {
    //         "Accept": "application/json",
    //         "Content-Type": "application/json"
    //     },
    //     body: JSON.stringify(body)
    // }).then(response => response.json());
}

export async function deleteSimulation(id) {
    // return await fetch(serverURL + "simulations/" + id, { method: "DELETE" })
    //     .then(response => response.json());
}