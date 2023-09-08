import { Form, Link, useActionData, useLoaderData, useSubmit } from "@remix-run/react";
import { LoaderFunction, ActionFunction, json, redirect } from "@remix-run/router";
import { ReactElement, useEffect, useState } from "react";
import { API } from "~/services/api";
import { CONFIG } from "~/config";
import { checkSession } from "~/services/session";
import { TableHeader, TableStyle } from "~/components/Table";
import { Breadcrumb } from "~/components/breadcrumb";
import { Modal } from "~/components/Modal";
import { IUserModel } from "~/models/user";

export let loader: LoaderFunction = async ({ request }) => {
	const session: any = await checkSession(request);
	if (!session) return redirect("/login");

	let url = new URL(request.url);
	let search = url.searchParams.get("search") || "";
	let size = url.searchParams.get("size") || 10;
	let page = url.searchParams.get("page") || 0;

	try {
		const result = await API.getTableData({
			session: session,
			url: CONFIG.base_url_api + "/users/list",
			pagination: true,
			page: +page || 0,
			size: +size || 10,
			filters: {
				search: search || "",
			},
		});
		return {
			table: {
				link: "users",
				data: result,
				page: page,
				size: size,
				filter: {
					search: search,
				},
			},
			session: session,
			isError: false,
		};
	} catch (error: any) {
		//CONSOLE.log(error);
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
				session: session,
				url: `${CONFIG.base_url_api}/vehicles?vehicleId=${formData.get(
					"vehicleId"
				)}`,
			});
		}
		return json({ status: "success", message: "berhasil dihapus" });
	} catch (errors: any) {
		return { errors };
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

	const actionData = useActionData();
	console.log(actionData);

	const navigation = [{ title: "Daftar Kendaraan", href: "", active: true }];

	const submit = useSubmit();
	const [mobileActionDropDown, setMobileActionDropdown] = useState<number | null>();

	useEffect(() => {
		setMobileActionDropdown(null);
	}, []);

	const header: TableHeader[] = [
		{
			title: "No",
			data: (data: IUserModel, index: number): ReactElement => (
				<td key={index + "-photo"} className="md:px-6 md:py-3 mb-4 md:mb-0">
					{index + 1}
				</td>
			),
		},
		{
			title: "Nama",
			data: (data: IUserModel, index: number): ReactElement => (
				<td key={index + "owner"} className="md:px-6 md:py-3 mb-4 md:mb-0">
					{data.userName}
				</td>
			),
		},
		{
			title: "email",
			data: (data: IUserModel, index: number): ReactElement => (
				<td key={index + "-rfid"} className="md:px-6 md:py-3 mb-4 md:mb-0">
					{data.userEmail}
				</td>
			),
		},
		{
			title: "Telepon",
			data: (data: IUserModel, index: number): ReactElement => (
				<td key={index + "-color"} className="md:px-6 md:py-3 mb-4 md:mb-0">
					{data.userPhoneNumber}
				</td>
			),
		},
		{
			title: "RFID",
			data: (data: IUserModel, index: number): ReactElement => (
				<td key={index + "-s"} className="md:px-6 md:py-3 mb-4 md:mb-0">
					{data.userRfidCard}
				</td>
			),
		},
		{
			title: "Terdaftar Sebagai",
			data: (data: IUserModel, index: number): ReactElement => (
				<td key={index + "-type"} className="md:px-6 md:py-3 mb-4 md:mb-0">
					{data.userRegisterAs}
				</td>
			),
		},
		{
			title: "Aksi",
			action: true,
			data: (data: IUserModel, index: number): ReactElement => (
				<td key={index + "action"} className="md:px-2 md:py-3">
					{/* Desktop only  */}
					<div className="hidden md:block w-64">
						<button
							onClick={() => {
								setModalData(data);
								setModalDelete(true);
							}}
							className="bg-transparent m-1 hover:bg-red-500 text-red-700 hover:text-white py-1 px-2 border border-red-500 hover:border-transparent rounded"
						>
							Hapus
						</button>
					</div>
					{/* Mobile only  */}
					<div className="block md:hidden relative">
						<button
							id={`dropdownButton-${index}`}
							onClick={() => {
								if (index == mobileActionDropDown) {
									setMobileActionDropdown(null);
								} else {
									setMobileActionDropdown(index);
								}
							}}
							data-dropdown-toggle={`dropdown-${index}`}
							type="button"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-6 w-6"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								strokeWidth="2"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
								/>
							</svg>
						</button>
						<div
							id={`dropdown-${index}`}
							className={`${
								mobileActionDropDown == index
									? "absolute right-0"
									: "hidden"
							} z-10 w-44 text-base list-none bg-white rounded divide-y divide-gray-100 shadow dark:bg-white`}
						>
							<ul
								className="py-1"
								aria-labelledby={`dropdownButton-${index}`}
							>
								<li>
									<button
										onClick={() => {
											setModalData(data);
											setModalDelete(true);
										}}
										className="block w-full text-left py-2 px-4 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-800 dark:hover:text-white"
									>
										Hapus
									</button>
								</li>
							</ul>
						</div>
					</div>
				</td>
			),
		},
	];

	const [modalDelete, setModalDelete] = useState(false);
	const [modalData, setModalData] = useState<IUserModel>();
	const submitDeleteData = async (e: React.FormEvent<HTMLFormElement>) => {
		submit(e.currentTarget, { method: "delete", action: `/admin` });
		setModalDelete(false);
	};

	return (
		<div className="bg-white rounded p-5">
			<Breadcrumb title="Kendaraan" navigation={navigation} />
			{actionData?.isError && (
				<div
					className="p-4 my-5 text-sm text-red-800 rounded-lg bg-red-50"
					role="alert"
				>
					<span className="font-medium">Error</span> {actionData.message}
				</div>
			)}

			<Form
				onChange={(e: any) =>
					submit(e.currentTarget, { action: `${loader?.table?.link}` })
				}
				method="get"
			>
				<div className="flex flex-col md:flex-row justify-between mb-2 md:px-0">
					<div className="px-1 w-full mb-2 flex flex-row gap-2 justify-between md:justify-start">
						<select
							name="size"
							defaultValue={loader?.table?.size}
							className="block w-32 px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
						>
							<option value="2">2</option>
							<option value="5">5</option>
							<option value="10">10</option>
							<option value="50">50</option>
							<option value="100">100</option>
						</select>
						&nbsp;
						<Link to={`create`}>
							<button
								type="button"
								className="bg-transparent hover:bg-teal-300 text-teal-500 font-semibold hover:text-white py-2 px-4 border border-teal-500 hover:border-transparent rounded"
							>
								Tambah Data
							</button>
						</Link>
						<button
							type="button"
							// onClick={download}
							className="bg-transparent hover:bg-teal-300 text-teal-500 font-semibold hover:text-white py-2 px-4 border border-teal-500 hover:border-transparent rounded"
						>
							Export
						</button>
					</div>
					<div className="w-full  md:w-1/5">
						<input
							defaultValue={loader?.table?.filter.search}
							name="search"
							className={`block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm`}
							placeholder="Cari data"
							type="text"
						/>
					</div>
				</div>
			</Form>

			<TableStyle header={header} table={loader.table} />

			<Modal
				open={modalDelete}
				setOpen={() => {
					setModalDelete(false);
				}}
			>
				<Form method="delete" onSubmit={submitDeleteData}>
					<input
						className="hidden"
						name="vehicleId"
						value={modalData?.userId}
					></input>
					Apakah anda yakin akan menghapus{" "}
					<strong>{modalData?.userName}</strong>
					<div className="flex flex-col md:flex-row mt-4">
						<button
							type="submit"
							className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-teal-600 text-base font-medium text-white hover:bg-teal-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 sm:text-sm"
						>
							Hapus
						</button>
						<button
							type="button"
							className="inline-flex ml-0 md:ml-2 justify-center w-full rounded-md border border-gray shadow-sm px-4 py-2 bg-white text-base font-medium text-gray hover:bg-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray sm:text-sm"
							onClick={() => {
								setModalDelete(false);
							}}
						>
							Batalkan
						</button>
					</div>
				</Form>
			</Modal>
		</div>
	);
}
