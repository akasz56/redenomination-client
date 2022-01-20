import serverURL from "./serverURL";
import { myToken } from '../Utils';

export async function createSession(body) {
    body.timer = parseInt(body.timer)

    return await fetch(serverURL + "sessions/", {
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
    return await fetch(serverURL + "sessions/" + id, {
        headers: {
            'Authorization': myToken()
        }
    }).then(response => response.json());
}

export async function updateSession(id, body) { }

export async function deleteSession(id) {
    return await fetch(serverURL + "sessions/" + id, {
        method: "DELETE",
        headers: {
            'Authorization': myToken()
        }
    }).then(response => response.json());
}
