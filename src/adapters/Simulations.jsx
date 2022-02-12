import { apiURL } from "./serverURL";
import { myToken } from '../Utils';

export async function createSimulation(body, additionalPlayer) {
    body.simulationType = body.simulationType.toLowerCase()
    body.participantNumber = parseInt(body.participantNumber)
    body.timer = parseInt(body.timer)

    body.buyer = Object.keys(body.unitValue).map((key) => { return { "unitValue": parseInt(body.unitValue[key]) } });
    body.seller = Object.keys(body.unitCost).map((key) => { return { "unitCost": parseInt(body.unitCost[key]) } });

    if (additionalPlayer === "seller") {
        body.buyer = body.buyer.splice(0, body.participantNumber / 2);
        body.seller = body.seller.splice(0, body.participantNumber / 2 + 1);
    }
    else if (additionalPlayer === "buyer") {
        body.buyer = body.buyer.splice(0, body.participantNumber / 2 + 1);
        body.seller = body.seller.splice(0, body.participantNumber / 2);
    }
    else {
        body.buyer = body.buyer.splice(0, body.participantNumber / 2);
        body.seller = body.seller.splice(0, body.participantNumber / 2);
    }
    delete body.unitValue
    delete body.unitCost

    return await fetch(apiURL + "simulations/", {
        method: "POST",
        headers: {
            'Accept': "application/json",
            'Content-Type': "application/json",
            'Authorization': myToken()
        },
        body: JSON.stringify(body)
    }).then(response => response.json());
}

export async function readAllSimulations() {
    return await fetch(apiURL + "simulations/", {
        headers: {
            'Authorization': myToken()
        }
    }).then(response => response.json());
}

export async function readSimulation(id) {
    return await fetch(apiURL + "simulations/" + id, {
        headers: {
            'Authorization': myToken()
        }
    }).then(response => response.json());
}

export async function updateSimulation(id, body) {
    return await fetch(apiURL + "simulations/" + id, {
        method: "PUT",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": myToken()
        },
        body: JSON.stringify(body)
    }).then(response => response.json());
}

export async function deleteSimulation(id) {
    return await fetch(apiURL + "simulations/" + id, {
        method: "DELETE",
        headers: {
            'Authorization': myToken()
        }
    }).then(response => response.json());
}

export async function uploadPicture(id, formData) {
    return await fetch(apiURL + "simulations/" + id + "/pictures", {
        method: 'POST',
        headers: {
            'Authorization': myToken()
        },
        body: formData
    }).then(response => response.json());
}

export async function readSimulationSummary(id) {
    return await fetch(apiURL + "simulations/" + id + "/summary", {
        headers: {
            'Authorization': myToken()
        },
    }).then(response => response.json());
}

export async function readAnovaCSV() {
    return await fetch(apiURL + "anova", {
        headers: {
            'Authorization': myToken()
        }
    }).then(response => response.json());
}
