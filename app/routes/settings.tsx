import { useLoaderData, Link, Outlet } from "@remix-run/react";
import { LoaderFunction, redirect } from "@remix-run/node";
import { BsFillCameraFill } from "react-icons/bs";
import { checkSession } from "~/services/session";

export let loader: LoaderFunction = async ({ request }) => {
	const session: any = await checkSession(request);
	if (!session) return redirect("/login");

	try {
		return { isError: false };
	} catch (error: any) {
		console.error(error);
		return { ...error, isError: true };
	}
};

export default function Index() {
	const loader = useLoaderData();
	if (loader.isError) {
		return (
			<h1 className="text-center font-bold text-xl text-red-600">
				{loader.message || `Error ${loader.code || ""}!`}
			</h1>
		);
	}
	return (
		<div className="flex flex-wrap">
			<div className="w-full sm:w-2/5 m-2 mr-10 h-96 max-w-sm p-4 bg-white border rounded-lg shadow-md sm:p-6 dark:bg-gray-800 dark:border-gray-700">
				<h5 className="mb-3 text-base font-semibold text-gray-900 md:text-xl dark:text-white">
					Settings
				</h5>
				<ul className="my-4 space-y-3">
					<li>
						<Link
							to="/settings/camera"
							className="flex items-center p-3 text-base font-bold text-gray-900 rounded-lg bg-gray-50 hover:bg-gray-100 group hover:shadow dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white"
						>
							<BsFillCameraFill className="text-3xl mr-5 text-gray-500" />
							<span className="flex-1 ml-3 whitespace-nowrap">Camera</span>
						</Link>
					</li>
				</ul>
			</div>
			<Outlet />
		</div>
	);
}
