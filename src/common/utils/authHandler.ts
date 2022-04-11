export enum ROLE {
  ADMIN = "ADMIN",
  PARTICIPANT = "PARTICIPANT",
}

const KEY = "auth";

export const getAuth = () => {
  const auth = window.localStorage.getItem(KEY);
  return auth ? JSON.parse(auth) : null;
};

export const getToken = () => {
  const auth = getAuth();
  return auth ? auth.token : undefined;
};

export const setAuth = (role: ROLE, token: string) => {
  window.localStorage.setItem(
    KEY,
    JSON.stringify({
      role: role,
      token: "Bearer " + token,
    })
  );
};

export const clearAuth = () => {
  window.localStorage.removeItem(KEY);
};

export const getCurrentRole = () => {
  const auth = getAuth();
  return auth ? auth.role : null;
};

export const logout = () => {
  clearAuth();
  window.location.href = "/";
};
