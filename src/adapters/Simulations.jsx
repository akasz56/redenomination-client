import serverURL from "./serverURL";
import { getSimulation, getUnitCostValue } from "./jsonFormats";

export async function createSimulation(body) {
    console.log(body);
    return;
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
    return [
        getSimulation,
        getSimulation,
        getSimulation,
        getSimulation
    ];
    // return await fetch(serverURL + "simulations/")
    //     .then(response => response.json());
}

export async function readSimulation(id) {
    return getSimulation;
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


export async function readUnitCostValue(id) {
    return getUnitCostValue;
    // return await fetch(serverURL + "simulations/" + id, { method: "DELETE" })
    //     .then(response => response.json());
}