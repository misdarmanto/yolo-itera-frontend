import { createCookie } from "@remix-run/node"; // or cloudflare/deno

export const createUserCookie = () => {
    return createCookie("itera-cookie", { maxAge: 604_800});
};
