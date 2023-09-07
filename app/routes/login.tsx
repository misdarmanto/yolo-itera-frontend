import Button from "~/components/buttom";
import { API } from "~/services/api";
import { CONFIG } from "~/config";
import { ActionFunction, LoaderFunction } from "@remix-run/router";
import { Form, useActionData, useSubmit, useTransition } from "@remix-run/react";
import { createSession } from "~/services/session";

export const action: ActionFunction = async ({ request }) => {
	const formData = await request.formData();
	try {
		if (request.method == "POST") {
			const payload: any = {
				adminEmail: formData.get("email"),
				adminPassword: formData.get("password"),
			};

			const user = await API.post({
				session: request,
				url: `${CONFIG.base_url_api}/admin/login`,
				body: payload,
			});

			return createSession({
				adminId: user.data.adminId,
				adminName: user.data.adminName,
				role: user.data.adminRole,
				email: user.data.adminEmail,
				photo: user.data.aminPhoto,
				redirectTo: "/",
			});
		}
	} catch (error: any) {
		console.log(error);
		return error;
	}
};

export default function Index() {
	const submit = useSubmit();
	const actionData = useActionData();

	const transition = useTransition();
	const handleSubmit = (event: any) => {
		submit(event.currentTarge, { method: "post", action: "/login" });
	};

	return (
		<Form method="post" onSubmit={handleSubmit}>
			<div className="flex items-center justify-center bg-gray-50">
				<div className="w-full sm:w-1/2 m-2 mx-5 sm:m-10 bg-white rounded-md shadow-md p-5 sm:p-10">
					<h1 className="text-3xl font-semibold text-teal-500 text-center mb-10">
						Login
					</h1>
					<div className="mb-6">
						<label className="block mb-2 text-sm font-medium text-gray-900">
							Email
						</label>
						<input
							type="email"
							name="email"
							className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-teal-500 focus:border-teal-500 block w-full p-2.5"
							placeholder="nama@gmail.com"
							required
						/>
					</div>
					<div className="mb-6">
						<label className="block mb-2 text-sm font-medium text-gray-900">
							Password
						</label>
						<input
							type="password"
							name="password"
							className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-teal-500 focus:border-teal-500 block w-full p-2.5"
							placeholder="password"
							required
						/>
					</div>

					<Button
						className="w-full my-5"
						type="submit"
						title={
							transition.state === "submitting" ? "Loading..." : "Submit"
						}
					/>
					{actionData && (
						<small className="text-sm text-red-500 mt-5">
							{actionData.message}
						</small>
					)}
				</div>
			</div>
		</Form>
	);
}
