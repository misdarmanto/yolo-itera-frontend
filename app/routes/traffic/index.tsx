import { useLoaderData, useSubmit } from "@remix-run/react";
import { LoaderFunction } from "@remix-run/router";
import Table from "~/components/table";
import Button from "~/components/buttom";
import { useState } from "react";
import { CONFIG } from "~/config";
import { API } from "~/services/api";

export let loader: LoaderFunction = async ({ request }) => {
	try {
		const url = new URL(request.url);
		const search = url.searchParams.get("search") || "";
		const vehicles = await API.get({
			session: request,
			url: `${CONFIG.base_url_api.default}/traffic/list?search=${search}`,
		});
		const header = ["Owner", "Name", "Type", "Plate", "RFID", "Color", "CheckIn", "CheckOut", "Action"];

		const body = vehicles.items.map((item: any) => {
			return {
				owner: item.user.name,
				name: item.vehicle.name,
				type: item.vehicle.type,
				plate: item.vehicle.plateNumber,
				rfid: item.user.rfid,
				color: item.vehicle.color,
				checkIn: item.checkIn,
				checkOut: item.checkOut,
				more: { ...item },
			};
		});
		const table = { header, body };
		return { table, vehicles, search, isError: false };
	} catch (error: any) {
		console.error(error);
		return { ...error, isError: true };
	}
};

export default function Index() {
	const loader = useLoaderData();
	console.log(loader);
	if (loader.isError) {
		return (
			<h1 className="text-center font-bold text-xl text-red-600">
				{loader.message || `Error ${loader.code || ""}!`}
			</h1>
		);
	}

	const submit = useSubmit();
	let [isOpenModal, setIsOpenModal] = useState(false);
	return (
		<div>
			<Table
				search={loader.search}
				onSearch={(e: any) => submit(e.currentTarget, { action: "/traffics" })}
				header={loader.table.header}
				body={loader.table.body}
				showAddButton={false}
				actionComponent={(item: any) => {
					console.log(item);
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
										<div className="relative flex justify-between w-full max-w-xl p-8 mx-auto bg-white rounded-md shadow-lg">
											<img
												className="max-w-xs h-auto rounded-md"
												src={item.more.photo}
												alt="image vehecle"
											/>
											<ul className="p-2">
												<li>name: {item.more.name}</li>
												<li>owner: {item.more.user.name}</li>
												<li>rfid: {item.rfid}</li>
												<li>plate: {item.plate}</li>
											</ul>
										</div>
									</div>
								</div>
							)}
						</>
					);
				}}
			/>
		</div>
	);
}
