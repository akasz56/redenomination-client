// const serverURL = "https://carbide-bongo-338115.et.r.appspot.com/";
const serverURL = "http://127.0.0.1:8000/";

export async function connectAsAdmin(password) {
    return await fetch(serverURL + "api/sessions/admins", {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        body:
            JSON.stringify({
                "password": password
            })
    }).then(response => response.json());
}

export async function connectAsParticipant(token) {
    return await fetch(serverURL + "api/sessions/tokens", {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        body:
            JSON.stringify({
                "token": token
            })
    }).then(response => response.json());
}