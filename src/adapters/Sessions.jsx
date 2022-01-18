import serverURL from "./serverURL";
import { getSession } from "./jsonFormats";

export async function createSession(body) {
    body.timer = parseInt(body.timer)

    return await fetch(serverURL + "sessions/", {
        method: "POST",
        headers: {
            'Accept': "application/json",
            'Content-Type': "application/json"
        },
        body: JSON.stringify(body)
    }).then(response => response.json());
}

export async function readSession(id) {
    return getSession;
}

export async function updateSession(id, body) { }

export async function deleteSession(id) { }
