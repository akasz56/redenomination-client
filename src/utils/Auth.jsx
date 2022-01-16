import { connectAsAdmin, connectAsParticipant } from "../adapters/Authentication";

//------------------------------------------ CheckAuth
export function myRole() {
    const jwt = JSON.parse(localStorage.getItem('auth'));
    if (jwt) { return jwt.role; }
}
export function isAdmin() { return myRole() === "admin"; }
export function isParticipant() { return myRole() === "participant"; }
export function isAuth() { return isAdmin() || isParticipant(); }


//------------------------------------------ Logins
export async function loginAsAdmin(password, next) {
    if (isAuth()) {
        alert(`Anda sudah login sebagai ${myRole()}`)
        return;
    }

    const result = await connectAsAdmin(password);
    if (result.status === 200) {
        localStorage.setItem('auth', JSON.stringify({
            login: true,
            role: "admin",
            token: "Bearer " + result.data.jwtToken
        }));
        next();
        return;
    } else if (result.status === 401) {
        alert("Wrong password");
        return;
    } else {
        alert("Something Happened");
        return;
    }
}

export async function loginParticipant(token, next) {
    if (isAuth()) {
        alert(`Anda sudah login sebagai ${myRole()}`)
        return;
    }

    const result = await connectAsParticipant(token);
    if (result.status === 200) {
        localStorage.setItem('auth', JSON.stringify({
            login: true,
            role: "participant",
            token: "Bearer yes"
        }));
        next();
        return;
    } else if (result.status === 401) {
        alert("Invalid Token");
        return;
    } else {
        alert("Something Happened");
        return;
    }
}

//------------------------------------------ Logouts
export function logout(next) {
    localStorage.removeItem('auth');
    next()
}