import { mainURL } from "../config";
import { getToken } from "../utils/authHandler";
import {
  responseErrorHandler,
  responseSuccessHandler,
} from "../utils/responseHandler";

const token = getToken();

export function readAllSimulations() {
  return fetch(mainURL + "simulations/", {
    headers: {
      Authorization: token,
    },
  })
    .then((res) => responseSuccessHandler(res))
    .catch((err) => responseErrorHandler(err));
}

export function readSimulation(id: string) {
  return fetch(mainURL + "simulations/" + id, {
    headers: {
      Authorization: token,
    },
  })
    .then((res) => responseSuccessHandler(res))
    .catch((err) => responseErrorHandler(err));
}

export function createSimulation(body: string) {}

export function updateSimulation(id: string, body: object) {
  return fetch(mainURL + "simulations/" + id, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: token,
    },
    body: JSON.stringify(body),
  })
    .then((res) => responseSuccessHandler(res))
    .catch((err) => responseErrorHandler(err));
}

export function deleteSimulation(id: string) {
  return fetch(mainURL + "simulations/" + id, {
    method: "DELETE",
    headers: {
      Authorization: token,
    },
  })
    .then((res) => responseSuccessHandler(res))
    .catch((err) => responseErrorHandler(err));
}

export function uploadPicture(id: string, formData: FormData) {
  return fetch(mainURL + "simulations/" + id + "/pictures", {
    method: "POST",
    headers: {
      Authorization: token,
    },
    body: formData,
  })
    .then((res) => responseSuccessHandler(res))
    .catch((err) => responseErrorHandler(err));
}
