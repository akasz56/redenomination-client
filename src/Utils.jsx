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

export function logout(next) {
    localStorage.removeItem('auth');
    next()
}