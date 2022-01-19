import serverURL from "./serverURL";

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
    return await fetch(serverURL + "sessions/" + id)
        .then(response => response.json());
}

export async function updateSession(id, body) { }

export async function deleteSession(id) { }
