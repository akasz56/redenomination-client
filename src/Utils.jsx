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

export function checkIfLoggedIn() {
    const auth = JSON.parse(localStorage.getItem('auth'));

    if (auth) { return { token: auth.id.token, username: auth.id.username } }
    return undefined;
}

export function logout(next = () => { }) {
    localStorage.removeItem('auth');
    next();
}

export function sortPhases(phases) {
    const phase0 = phases.find((item) => { return item.phaseType === "preRedenomPrice" })
    const phase1 = phases.find((item) => { return item.phaseType === "transitionPrice" })
    const phase2 = phases.find((item) => { return item.phaseType === "postRedenomPrice" })
    return [phase0, phase1, phase2];
}

export function displayPrice(price, phaseType = "preRedenomPrice") {
    switch (phaseType) {
        case "preRedenomPrice":
            return "Rp. " + priceMask(price)

        case "transitionPrice":
            return "Rp. " + priceMask(price) + " / Rp. " + priceMask(parseInt(price) / 1000)

        case "postRedenomPrice":
            return "Rp. " + priceMask(parseInt(price) / 1000)

        default:
            break;
    }
}

export function adjustPrice(price, phaseType = "preRedenomPrice") {
    switch (phaseType) {
        case "preRedenomPrice":
        case "transitionPrice":
            return parseInt(price)

        case "postRedenomPrice":
            return parseInt(price) / 1000;

        default:
            break;
    }
}

export function getRandomColor() {
    return "#" + Math.floor(Math.random() * 16777215).toString(16);
}

export function printLog(msg) {
    console.log(msg)
}

export function priceMask(num) {
    if (isNaN(num)) {
        return 0;
    } else {
        let [part1, part2] = num.toString().split(".", 2);
        return ((part2 !== undefined) ?
            part1.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "." + part2
            :
            part1.replace(/\B(?=(\d{3})+(?!\d))/g, ","));
    }
}

function priceUnMask(str) {
    let parts = (1234.5).toLocaleString().match(/(\D+)/g);
    let unformatted = str;

    unformatted = unformatted.split(parts[0]).join("");
    unformatted = unformatted.split(parts[1]).join(".");

    return unformatted;
}

export function numberInputFormat(e, str) {
    const value = priceUnMask(str);
    const maskedValue = priceMask(value);
    e.target.value = maskedValue;
    return parseFloat(value)
}

export function sumByUsername(ungrouped) {
    const grouped = ungrouped.reduce((grouppedUsername, item) => {
        const username = (grouppedUsername[item.username] || 0);
        grouppedUsername[item.username] = username + item.price;
        return grouppedUsername;
    }, {});

    let returnable = [];

    for (let item in grouped) {
        returnable.push({
            username: item,
            profit: grouped[item]
        });
    }

    return returnable;
}

export function sessionProfitsToArray(sessions) {
    const sessionProfits = sessions.map(item => item.profits)
    return sessionProfits.reduce((concated, item) => concated.concat(item), [])
}

export function alertUser(res) {
    printLog(res)
    const msg = "(" + res.status + ") " + res.message;
    window.alert(msg);
}
