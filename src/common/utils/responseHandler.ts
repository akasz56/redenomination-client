import { logout } from "./authHandler";

export async function fetchResponseHandler(res: any) {
  res = await res.json();
  if (res.status < 300) {
    return responseSuccessHandler(res);
  } else if (res.status === 401) {
    return logout();
  } else if (res.status === 404) {
    throw new Error("Data tidak ditemukan");
  }
  console.log(res);
  throw new Error("Terjadi kesalahan");
}

export function responseSuccessHandler(res: any) {
  if (typeof res.data === "object") {
    return res.data;
  } else if (
    typeof res.status === "number" &&
    typeof res.message === "string"
  ) {
    throw new Error("(" + res.status + ") " + res.message);
  }
  throw new Error("Error occurred during fetching");
}

export function responseErrorHandler(reason: string, skipAlert = false) {
  console.error(reason);
  if (!skipAlert) {
    alert(reason);
  }
}
