export function myRole() {
    const jwt = JSON.parse(localStorage.getItem('login'));
    if (jwt) { return jwt.role; }
}
export function isAdmin() { return myRole() === "admin"; }
export function isParticipant() { return myRole() === "participant"; }
export function isAuth() { return (isAdmin() || isParticipant()); }

export function loginAdmin(password, next) {
    if (isAuth()) {
        alert(`Anda sudah login sebagai ${myRole()}`)
        next();
        return;
    }

    if (password === "admin") {
        localStorage.setItem('login', JSON.stringify({
            login: true,
            role: "admin",
            token: "Bearer yes"
        }));
        next();
        return;
    } else {
        alert("Wrong password");
    }
}

export function loginParticipant(token, next) {
    if (isAuth()) {
        alert(`Anda sudah login sebagai ${myRole()}`)
        next();
        return;
    }

    if (token.toUpperCase() === "TOKEN") {
        localStorage.setItem('login', JSON.stringify({
            login: true,
            role: "participant",
            token: "Bearer yes"
        }));
        next();
        return;
    } else {
        alert("Invalid Token");
    }
}

export function logout(next) {
    localStorage.removeItem('login');
    next()
}