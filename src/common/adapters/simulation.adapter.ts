import { apiURL } from "../config";
import { getToken } from "../utils/authHandler";
import {
  responseErrorHandler,
  fetchResponseHandler,
} from "../utils/responseHandler";
const token = getToken();

export function createSimulation(body: any) {
  return fetch(apiURL + "simulations/", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: token,
    },
    body: JSON.stringify(body),
  })
    .then((res) => fetchResponseHandler(res))
    .catch((err) => responseErrorHandler(err));
}

export function readAllSimulations() {
  return fetch(apiURL + "simulations/", {
    headers: {
      Authorization: token,
    },
  })
    .then((res) => fetchResponseHandler(res))
    .catch((err) => responseErrorHandler(err, true));
}

export function readSimulation(id: string) {
  return fetch(apiURL + "simulations/" + id, {
    headers: {
      Authorization: token,
    },
  })
    .then((res) => fetchResponseHandler(res))
    .catch((err) => responseErrorHandler(err));
}

export function updateSimulation(id: string, body: object) {
  return fetch(apiURL + "simulations/" + id, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: token,
    },
    body: JSON.stringify(body),
  })
    .then((res) => fetchResponseHandler(res))
    .catch((err) => responseErrorHandler(err));
}

export function deleteSimulation(id: string) {
  return fetch(apiURL + "simulations/" + id, {
    method: "DELETE",
    headers: {
      Authorization: token,
    },
  })
    .then((res) => fetchResponseHandler(res))
    .catch((err) => responseErrorHandler(err));
}

export function uploadPicture(id: string, formData: FormData) {
  return fetch(apiURL + "simulations/" + id + "/pictures", {
    method: "POST",
    headers: {
      Authorization: token,
    },
    body: formData,
  })
    .then((res) => fetchResponseHandler(res))
    .catch((err) => responseErrorHandler(err));
}
