import { apiURL } from "../config";
import { getToken } from "../utils/authHandler";
import {
  responseErrorHandler,
  fetchResponseHandler,
} from "../utils/responseHandler";
const JWToken = getToken();
const simulationURL = apiURL + "simulations/";

export function createSimulation(body: any) {
  return fetch(simulationURL, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: JWToken,
    },
    body: JSON.stringify(body),
  })
    .then((res) => fetchResponseHandler(res))
    .catch((err) => responseErrorHandler(err));
}

export function readAllSimulations() {
  return fetch(simulationURL, {
    headers: {
      Authorization: JWToken,
    },
  })
    .then((res) => fetchResponseHandler(res))
    .catch((err) => responseErrorHandler(err, true));
}

export function readSimulation(id: string) {
  return fetch(simulationURL + id, {
    headers: {
      Authorization: JWToken,
    },
  })
    .then((res) => fetchResponseHandler(res))
    .catch((err) => responseErrorHandler(err));
}

export function readSimulationByToken(token: string) {
  return fetch(simulationURL + "token/" + token, {
    headers: {
      Authorization: JWToken,
    },
  })
    .then((res) => fetchResponseHandler(res))
    .catch((err) => responseErrorHandler(err));
}

export function updateSimulation(id: string, body: object) {
  return fetch(simulationURL + id, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: JWToken,
    },
    body: JSON.stringify(body),
  })
    .then((res) => fetchResponseHandler(res))
    .catch((err) => responseErrorHandler(err));
}

export function deleteSimulation(id: string) {
  return fetch(simulationURL + id, {
    method: "DELETE",
    headers: {
      Authorization: JWToken,
    },
  })
    .then((res) => fetchResponseHandler(res))
    .catch((err) => responseErrorHandler(err));
}

export function uploadPicture(id: string, formData: FormData) {
  return fetch(simulationURL + id + "/pictures", {
    method: "POST",
    headers: {
      Authorization: JWToken,
    },
    body: formData,
  })
    .then((res) => fetchResponseHandler(res))
    .catch((err) => responseErrorHandler(err));
}
