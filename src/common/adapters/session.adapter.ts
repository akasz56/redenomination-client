import { apiURL } from "../config";
import { getToken } from "../utils/authHandler";
import {
  responseErrorHandler,
  fetchResponseHandler,
} from "../utils/responseHandler";
const JWToken = getToken();
const sessionURL = apiURL + "sessions/";

export async function createSession(body: any) {
  return await fetch(sessionURL, {
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

export async function readSession(id: string) {
  return await fetch(sessionURL + id, {
    headers: {
      Authorization: JWToken,
    },
  })
    .then((res) => fetchResponseHandler(res))
    .catch((err) => responseErrorHandler(err));
}

export async function updateSession(id: string, body: object) {
  return await fetch(sessionURL + id, {
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

export async function deleteSession(id: string) {
  return await fetch(sessionURL + id, {
    method: "DELETE",
    headers: {
      Authorization: JWToken,
    },
  })
    .then((res) => fetchResponseHandler(res))
    .catch((err) => responseErrorHandler(err));
}

export async function startSession(id: string) {
  return await fetch(sessionURL + id + "/start", {
    headers: {
      Authorization: JWToken,
    },
  })
    .then((res) => fetchResponseHandler(res))
    .catch((err) => responseErrorHandler(err));
}

export async function stopSession(id: string) {
  return await fetch(sessionURL + id + "/stop", {
    headers: {
      Authorization: JWToken,
    },
  })
    .then((res) => fetchResponseHandler(res))
    .catch((err) => responseErrorHandler(err));
}
