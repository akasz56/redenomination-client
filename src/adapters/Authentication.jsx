import { apiURL } from "./serverURL";

export async function connectAsAdmin(password) {
    return await fetch(apiURL + "sessions/admins", {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ "password": password })
    }).then(response => response.json());
}