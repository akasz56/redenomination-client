import { mainURL } from "../config";
import {
  responseErrorHandler,
  responseSuccessHandler,
} from "../utils/responseHandler";

export function connectAdmin(password: string) {
  return fetch(mainURL + "/login", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ password: password }),
  })
    .then((res) => responseSuccessHandler(res.json()))
    .catch((err) => responseErrorHandler(err));
}
