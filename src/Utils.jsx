export function capitalize(string) {
    const words = string.split(" ");
    for (let i = 0; i < words.length; i++) {
        words[i] = words[i][0].toUpperCase() + words[i].substr(1);
    }
    return words.join(" ")
}

export function myRole() {
    const jwt = JSON.parse(localStorage.getItem('auth'));
    if (jwt) { return jwt.role; }
}

export function myToken() {
    const jwt = JSON.parse(localStorage.getItem('auth'));
    if (jwt) { return jwt.token; }
}

export function saveAuth(role, idtoken) {
    if (localStorage.getItem("auth") === null) {
        switch (role) {
            case "participant":
                localStorage.setItem('auth', JSON.stringify({
                    login: true,
                    role: role,
                    id: idtoken,
                }));
                break;
            case "admin":
                localStorage.setItem('auth', JSON.stringify({
                    login: true,
                    role: role,
                    token: idtoken,
                }));
                break;

            default:
                break;
        }
    }
}

export function getParticipantId() {
    let savedAuth = JSON.parse(localStorage.getItem("auth"));
    return savedAuth.id;
}

export function logout(next) {
    localStorage.removeItem('auth');
    next()
}

export function displayPrice(price, phaseType = "preRedenomPrice") {
    switch (phaseType) {
        case "preRedenomPrice":
            return "Rp. " + Number(price)

        case "transitionPrice":
            return "Rp. " + Number(price) + " / Rp. " + (Number(price) / 1000)

        case "postRedenomPrice":
            return "Rp. " + Number(price) / 1000;

        default:
            break;
    }
}

export function adjustPrice(price, phaseType = "preRedenomPrice") {
    switch (phaseType) {
        case "preRedenomPrice":
        case "transitionPrice":
            return Number(price)

        case "postRedenomPrice":
            return Number(price) / 1000;

        default:
            break;
    }
}

export function getRandomColor() {
    return "#" + Math.floor(Math.random() * 16777215).toString(16);
}