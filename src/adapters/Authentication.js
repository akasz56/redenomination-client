import serverURL from "./serverURL";

const offlineResponse = {
    status: 200,
    data: { jwtToken: "yes" }
}

export async function connectAsAdmin(password) {
    // return await fetch(serverURL + "api/sessions/admins", {
    //     method: "POST",
    //     headers: {
    //         "Accept": "application/json",
    //         "Content-Type": "application/json"
    //     },
    //     body:
    //         JSON.stringify({
    //             "password": password
    //         })
    // }).then(response => response.json());
    return offlineResponse;
}

export async function connectAsParticipant(token) {
    // return await fetch(serverURL + "api/sessions/tokens", {
    //     method: "POST",
    //     headers: {
    //         "Accept": "application/json",
    //         "Content-Type": "application/json"
    //     },
    //     body:
    //         JSON.stringify({
    //             "token": token
    //         })
    // }).then(response => response.json());
    return offlineResponse;
}