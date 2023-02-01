import Button from "~/components/buttom";
import { Form, useActionData, useSubmit, useTransition } from "@remix-run/react";
import { ActionFunction, redirect } from "@remix-run/router";
import { CONFIG } from "~/config";
import { API } from "~/services/api";
import { checkSession } from "~/services/session";

export const action: ActionFunction = async ({ request }) => {
	const session: any = await checkSession(request);
	if (!session) return redirect("/login");

	const formData = await request.formData();
	try {
		if (request.method == "POST") {
			const payload: any = {
				name: formData.get("name"),
				email: formData.get("email"),
				password: formData.get("password"),
				role: formData.getAll("role")[0],
				photo:
					formData.get("photo") ||
					"https://cdn.pixabay.com/photo/2013/07/13/12/07/avatar-159236__340.png",
			};

			const user = await API.post({
				session: request,
				url: `${CONFIG.base_url_api.default}/admin/register`,
				body: payload,
			});
			return redirect("/admin/list");
		}
	} catch (error: any) {
		console.log(error);
		return error;
	}
};

export default function Index() {
	const actionData = useActionData();

	const transition = useTransition();
	const submit = useSubmit();
	const handleSubmit = (event: any) => {
		submit(event.currentTarge, { method: "post", action: "/admin/add" });
	};

	return (
		<div className="bg-white w-full sm:w-2/5 m-2  p-5 rounded-md shadow-md">
			<h1 className="text-2xl font-semibold text-center sm:my-2">Add User</h1>
			<Form method="post" onSubmit={handleSubmit}>
				<div className="mb-2">
					<label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
						Nama
					</label>
					<input
						type="text"
						name="name"
						className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
						placeholder="nama"
						required
					/>
				</div>
				<div className="mb-2">
					<label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
						E-mail
					</label>
					<input
						type="email"
						name="email"
						className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
						placeholder="email"
						required
					/>
				</div>
				<div className="mb-2">
					<label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
						password
					</label>
					<input
						type="password"
						name="password"
						placeholder="password"
						className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
						required
					/>
				</div>
				<div className="mb-5">
					<label className="block text-sm font-medium text-gray-900 dark:text-white">Access</label>
					<select
						name="role"
						className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
					>
						<option value="admin" selected>
							Admin
						</option>
						<option value="superAdmin">Super Admin</option>
					</select>
				</div>
				<Button
					className="w-full my-5"
					type="submit"
					title={transition.state === "submitting" ? "Loading..." : "Submit"}
				/>
			</Form>
			{actionData && <small className="text-sm text-red-500 mt-5">{actionData.message}</small>}
		</div>
	);
}
