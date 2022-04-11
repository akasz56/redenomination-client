import { apiURL } from "../config";
import { getToken } from "../utils/authHandler";
import {
  responseErrorHandler,
  fetchResponseHandler,
} from "../utils/responseHandler";
const token = getToken();

export async function createSession(body: any) {
  return await fetch(apiURL + "sessions/", {
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

export async function readSession(id: string) {
  return await fetch(apiURL + "sessions/" + id, {
    headers: {
      Authorization: token,
    },
  })
    .then((res) => fetchResponseHandler(res))
    .catch((err) => responseErrorHandler(err));
}

export async function updateSession(id: string, body: object) {
  return await fetch(apiURL + "sessions/" + id, {
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

export async function deleteSession(id: string) {
  return await fetch(apiURL + "sessions/" + id, {
    method: "DELETE",
    headers: {
      Authorization: token,
    },
  })
    .then((res) => fetchResponseHandler(res))
    .catch((err) => responseErrorHandler(err));
}

export async function runSession(id: string) {
  return await fetch(apiURL + "sessions/" + id + "/runs", {
    method: "POST",
    headers: {
      Authorization: token,
    },
  })
    .then((res) => fetchResponseHandler(res))
    .catch((err) => responseErrorHandler(err));
}

export async function finishSession(id: string) {
  return await fetch(apiURL + "sessions/" + id + "/finishes", {
    method: "POST",
    headers: {
      Authorization: token,
    },
  })
    .then((res) => fetchResponseHandler(res))
    .catch((err) => responseErrorHandler(err));
}
