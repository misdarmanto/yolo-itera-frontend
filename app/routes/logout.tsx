import { ActionFunction, LoaderFunction, redirect } from "@remix-run/node";
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
