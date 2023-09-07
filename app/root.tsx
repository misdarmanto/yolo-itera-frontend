import {
	Links,
	LiveReload,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
	useLoaderData,
	useLocation,
} from "@remix-run/react";

import { LoaderFunction, redirect } from "@remix-run/router";
import type { MetaFunction, LinksFunction } from "@remix-run/node";
import rootStyles from "~/styles/tailwind.css";
import globalStyle from "~/styles/global.css";
import Layout from "./layout/Layout";
import { checkSession } from "./services/session";

export const links: LinksFunction = () => {
	return [
		{
			rel: "icon",
			href: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/Logo_ITERA.png/600px-Logo_ITERA.png",
			type: "image/png",
		},
		{ rel: "stylesheet", href: rootStyles },
		{ rel: "stylesheet", href: globalStyle },
	];
};

export const meta: MetaFunction = () => {
	return { title: "Itera" };
};

export let loader: LoaderFunction = async ({ request }) => {
	try {
		const session: any = await checkSession(request);
		return { session };
	} catch (error) {
		console.log(error);
		return null;
	}
};
export default function App() {
	let location = useLocation();
	const loader = useLoaderData();

	if (!loader)
		return <h1 className="text-3xl text-red fomt-bold text-center">Error</h1>;

	return (
		<html lang="en">
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width,initial-scale=1" />
				<Meta />
				<Links />
			</head>
			<body>
				{location.pathname.includes("login") ? (
					<Outlet />
				) : (
					<Layout session={loader.session}>
						<Outlet />
					</Layout>
				)}
				<Scripts />
				<ScrollRestoration />
				<LiveReload />
			</body>
		</html>
	);
}
