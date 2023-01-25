import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/router";
import { logout } from "~/services/session";

export let action: ActionFunction = async ({ request }) => {
    return logout(request);
};

export let loader: LoaderFunction = async () => {
    return redirect("/login");
};

export default function Logout() {
    return <div />;
}
