import { Form, Link, useActionData, useLoaderData, useSubmit } from "@remix-run/react";
import { LoaderFunction, ActionFunction, json, redirect } from "@remix-run/router";
import { useState } from "react";
import Button from "~/components/buttom";
import Table from "~/components/table";
import { API } from "~/services/api";
import { CONFIG } from "~/config";
import { checkSession } from "~/services/session";

export let loader: LoaderFunction = async ({ request }) => {
	const session: any = await checkSession(request);
	if (!session) return redirect("/login");

	try {
		const url = new URL(request.url);
		const search = url.searchParams.get("search") || "";
		const vehicles = await API.get({
			session: request,
			url: `${CONFIG.base_url_api.default}/vehicles/list?search=${search}`,
		});
		const header = ["name", "type", "plate", "rfid", "color", "owner", "action"];

		const body = vehicles.items.map((item: any) => {
			return {
				name: item.name,
				type: item.type,
				plate: item.plateNumber,
				rfid: item.user.rfid,
				color: item.color,
				owner: item.user.name,
				more: { ...item },
			};
		});
		const table = { header, body };
		return { table, vehicles, isError: false };
	} catch (error: any) {
		console.error(error);
		return { ...error, isError: true };
	}
};

export let action: ActionFunction = async ({ request }) => {
	const session: any = await checkSession(request);
	if (!session) return redirect("/login");

	const formData = await request.formData();
	try {
		if (request.method == "DELETE") {
			await API.delete({
				session: request,
				url: `${CONFIG.base_url_api.default}/vehicles?id=${formData.get("id")}`,
			});
		}
		return json({ status: "success", message: "berhasil dihapus" });
	} catch (errors: any) {
		return { errors };
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

	const actionData = useActionData();
	console.log(actionData);

	const submit = useSubmit();
	const [isOpenModal, setIsOpenModal] = useState(false);

	const handleDeleteVehicle = async (e: React.FormEvent<HTMLFormElement>) => {
		submit(e.currentTarget, { method: "delete", action: `vehicles` });
		setIsOpenModal(!isOpenModal);
	};

	const ActionTable = ({ item }: any) => {
		const [vehicleName, setVehicleName] = useState<string>("");
		return (
			<>
				<Button title="More" onClick={() => setIsOpenModal(!isOpenModal)} />

				{isOpenModal && (
					<div className="fixed inset-0 z-10 overflow-y-auto">
						<div
							className="fixed inset-0 w-full h-full bg-black opacity-10"
							onClick={() => setIsOpenModal(false)}
						></div>
						<div className="flex items-center min-h-screen px-4 py-8">
							<div className="relative w-full max-w-xl p-8 mx-auto bg-white rounded-md shadow-lg">
								<div className="flex ">
									<img
										className="w-64 h-48 rounded-sm"
										src={item.more.photo}
										alt="image vehecle"
									/>

									<div className="mx-5">
										<h2 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
											Detail:
										</h2>
										<ul className="space-y-1 max-w-md list-disc list-inside text-gray-500 dark:text-gray-400">
											<li>owner: {item.more.user.name}</li>
											<li>name: {item.more.name}</li>
											<li>type: {item.more.type}</li>
											<li>plate: {item.more.plateNumber}</li>
											<li>color: {item.more.color}</li>
											<li>registered at: {item.more.createdOn}</li>
										</ul>
									</div>
								</div>
								<div className="mt-5 flex">
									<Link to={`${item.more.id}/update`}>
										<Button title="Update" className="mr-5" />
									</Link>
									<input
										type="text"
										name="color"
										className="bg-gray-50 h-9 mx-2 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-teal-500 focus:border-teal-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-teal-500 dark:focus:border-teal-500"
										placeholder="masukan nama kendaraan"
										value={vehicleName}
										onChange={(e: any) => setVehicleName(e.target.value)}
										required
									/>
									<Form method="delete" onSubmit={handleDeleteVehicle}>
										<input
											className="hidden"
											name="id"
											defaultValue={item.more.id}
										></input>
										<Button
											title="Delete"
											type="submit"
											className="border-red-500 hover:bg-red-300 hover:text-white text-red-500"
											disabled={vehicleName !== item.more.name}
										/>
									</Form>
								</div>
							</div>
						</div>
					</div>
				)}
			</>
		);
	};

	return (
		<Table
			search={loader.search}
			onSearch={(e: any) => submit(e.currentTarget, { action: "/vehicles" })}
			actionComponent={(item: any) => <ActionTable item={item} />}
			header={loader.table.header}
			body={loader.table.body}
		/>
	);
}
