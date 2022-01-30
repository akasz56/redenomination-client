import { apiURL } from "./serverURL";
import { myToken } from '../Utils';

export async function createSession(body) {
    body.timer = parseInt(body.timer)

    return await fetch(apiURL + "sessions/", {
        method: "POST",
        headers: {
            'Accept': "application/json",
            'Content-Type': "application/json",
            'Authorization': myToken()
        },
        body: JSON.stringify(body)
    }).then(response => response.json());
}

export async function readSession(id) {
    return await fetch(apiURL + "sessions/" + id, {
        headers: {
            'Authorization': myToken()
        }
    }).then(response => response.json());
}

export async function updateSession(id, body) {
    return await fetch(apiURL + "sessions/" + id, {
        method: "PUT",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": myToken()
        },
        body: JSON.stringify(body)
    }).then(response => response.json());
}

export async function deleteSession(id) {
    return await fetch(apiURL + "sessions/" + id, {
        method: "DELETE",
        headers: {
            'Authorization': myToken()
        }
    }).then(response => response.json());
}

export async function runSession(id) {
    return await fetch(apiURL + "sessions/" + id + "/runs", {
        method: "POST",
        headers: {
            'Authorization': myToken()
        }
    }).then(response => response.json());
}

export async function finishSession(id) {
    return await fetch(apiURL + "sessions/" + id + "/finishes", {
        method: "POST",
        headers: {
            'Authorization': myToken()
        }
    }).then(response => response.json());
}
