import { createServerFn } from "@tanstack/react-start";
import { getHeaders } from "@tanstack/react-start/server";
import { authClient } from "../auth-client";

export const getAuthUser = createServerFn({
  method: "GET",
}).handler(async () => {
  const res = await authClient.getSession({
    fetchOptions: {
      headers: getHeaders() as HeadersInit,
    },
  });

  return res.data;
});
