import serverURL from "./serverURL";

export async function createSimulation(body) {
    body.simulationType = body.simulationType.toLowerCase()
    body.participantNumber = parseInt(body.participantNumber)
    body.timer = parseInt(body.timer)

    body.buyer = Object.keys(body.unitValue).map((key) => { return { "unitValue": parseInt(body.unitValue[key]) } });
    body.buyer = body.buyer.splice(0, body.participantNumber / 2);
    delete body.unitValue

    body.seller = Object.keys(body.unitCost).map((key) => { return { "unitCost": parseInt(body.unitCost[key]) } });
    body.seller = body.seller.splice(0, body.participantNumber / 2);
    delete body.unitCost

    body.goodsPic = "https://via.placeholder.com/800x600";

    return await fetch(serverURL + "simulations/", {
        method: "POST",
        headers: {
            'Accept': "application/json",
            'Content-Type': "application/json"
        },
        body: JSON.stringify(body)
    }).then(response => response.json());
}

export async function readAllSimulations() {
    return await fetch(serverURL + "simulations/")
        .then(response => response.json());
}

export async function readSimulation(id) {
    return await fetch(serverURL + "simulations/" + id)
        .then(response => response.json());
}

export async function updateSimulation(id, body) {
    // return await fetch(serverURL + "simulations/" + id, {
    //     method: "PUT",
    //     headers: {
    //         "Accept": "application/json",
    //         "Content-Type: "application/json"
    //     },
    //     body: JSON.stringify(body)
    // }).then(response => response.json());
}

export async function deleteSimulation(id) {
    return await fetch(serverURL + "simulations/" + id, { method: "DELETE" })
        .then(response => response.json());
}


export async function readUnitCostValue(id) {
    // return await fetch(serverURL + "simulations/" + id, { method: "DELETE" })
    //     .then(response => response.json());
}