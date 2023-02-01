import { createCookieSessionStorage, redirect } from "@remix-run/node";
import { CONFIG } from "~/config";
import { CONSOLE } from "~/utilities/log";

export let storage = createCookieSessionStorage({
	cookie: {
		name: "Itera Cookie",
		secure: CONFIG.env === "production",
		secrets: ["hello"],
		sameSite: "lax",
		path: "/",
		maxAge: 60 * 60 * 12,
		httpOnly: true,
	},
});

interface CreateSessionTypes {
	adminId: number;
	adminName: string;
	role: string;
	photo: string;
	email: string;
	redirectTo: string;
}

export async function createSession(props: CreateSessionTypes) {
	const { adminId, adminName, role, photo, email, redirectTo } = props;

	try {
		let session = await storage.getSession();
		session.set("adminId", adminId);
		session.set("adminName", adminName);
		session.set("role", role);
		session.set("photo", photo);
		session.set("email", email);
		return redirect(redirectTo, {
			headers: { "Set-Cookie": await storage.commitSession(session) },
		});
	} catch (error) {
		CONSOLE.log(error);
	}
}

export async function logout(request: Request) {
	let session = await storage.getSession(request.headers.get("Cookie"));
	return redirect("/login", {
		headers: {
			"Set-Cookie": await storage.destroySession(session),
		},
	});
}

export const checkSession = async (request: Request) => {
	const session = await storage.getSession(request.headers.get("Cookie"));
	const isLogedIn = session.has("adminId");
	if (!isLogedIn) return false;

	return {
		adminId: session.get("adminId"),
		adminName: session.get("adminName"),
		role: session.get("role"),
		photo: session.get("photo"),
		email: session.get("email"),
	};
};
