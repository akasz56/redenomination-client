export async function responseSuccessHandler(res: any) {
  res = await res.json();
  if (res.status < 300) {
    if (typeof res.data === "object") {
      return res.data;
    } else if (
      typeof res.status === "number" &&
      typeof res.message === "string"
    ) {
      return responseErrorHandler("(" + res.status + ") " + res.message);
    }
    return responseErrorHandler("Error occurred during fetching");
  }
  return responseErrorHandler("Error status " + res.status);
}

export function responseErrorHandler(reason: string) {
  console.error(reason);
  alert(reason);
}
