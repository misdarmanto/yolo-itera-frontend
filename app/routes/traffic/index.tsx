import { Form, Link, useActionData, useLoaderData, useSubmit } from "@remix-run/react";
import { LoaderFunction, ActionFunction, json, redirect } from "@remix-run/router";
import { ReactElement, useEffect, useState } from "react";
import { API } from "~/services/api";
import { CONFIG } from "~/config";
import { checkSession } from "~/services/session";
import { TableHeader, TableStyle } from "~/components/Table";
import { IVehicleModel } from "~/models/vehicle";
import { Breadcrumb } from "~/components/breadcrumb";
import { Modal } from "~/components/Modal";
import { CONSOLE } from "~/utilities/log";
import { ITrafficModel } from "~/models/traffic";

export let loader: LoaderFunction = async ({ request }) => {
	const session: any = await checkSession(request);
	if (!session) return redirect("/login");

	let url = new URL(request.url);
	let search = url.searchParams.get("search") || "";
	let size = url.searchParams.get("size") || 10;
	let page = url.searchParams.get("page") || 0;
	let range = url.searchParams.get("range") || "all";

	try {
		const result = await API.getTableData({
			session: session,
			url: CONFIG.base_url_api + "/traffic/list",
			pagination: true,
			page: +page || 0,
			size: +size || 10,
			filters: {
				search: search || "",
				range: range,
			},
		});
		return {
			table: {
				link: "traffic",
				data: result,
				page: page,
				size: size,
				filter: {
					search: search,
					range: range,
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

	const [mobileActionDropDown, setMobileActionDropdown] = useState<number | null>();

	useEffect(() => {
		setMobileActionDropdown(null);
	}, []);

	const navigation = [{ title: "Traffic Kendaraan", href: "", active: true }];

	const submit = useSubmit();

	const header: TableHeader[] = [
		{
			title: "Pemilik",
			data: (data: ITrafficModel, index: number): ReactElement => {
				if (!data.trafficUserName) {
					return (
						<td
							key={index + "owner"}
							className="md:px-6 md:py-3 mb-4 md:mb-0"
						>
							<span className="bg-red-100 text-red-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded">
								Gagal
							</span>
						</td>
					);
				}
				return (
					<td key={index + "owner"} className="md:px-6 md:py-3 mb-4 md:mb-0">
						{data.trafficUserName}
					</td>
				);
			},
		},
		{
			title: "Nama Kendaraan",
			data: (data: ITrafficModel, index: number): ReactElement => {
				if (!data.trafficVehicleName) {
					return (
						<td
							key={index + "vehicle name"}
							className="md:px-6 md:py-3 mb-4 md:mb-0"
						>
							<span className="bg-red-100 text-red-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded">
								Gagal
							</span>
						</td>
					);
				}
				return (
					<td
						key={index + "vehicle name"}
						className="md:px-6 md:py-3 mb-4 md:mb-0"
					>
						{data.trafficVehicleName}
					</td>
				);
			},
		},
		{
			title: "Nomor Kendaraan",
			data: (data: ITrafficModel, index: number): ReactElement => {
				if (!data.trafficVehiclePlateNumber) {
					return (
						<td
							key={index + "plate number"}
							className="md:px-6 md:py-3 mb-4 md:mb-0"
						>
							<span className="bg-red-100 text-red-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded">
								Gagal
							</span>
						</td>
					);
				}
				return (
					<td
						key={index + "plate number"}
						className="md:px-6 md:py-3 mb-4 md:mb-0"
					>
						{data.trafficVehiclePlateNumber}
					</td>
				);
			},
		},
		{
			title: "Rfid Kendaraan",
			data: (data: ITrafficModel, index: number): ReactElement => {
				if (!data.trafficVehicleRfid) {
					return (
						<td
							key={index + "vehicle-rfid"}
							className="md:px-6 md:py-3 mb-4 md:mb-0"
						>
							<span className="bg-red-100 text-red-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded">
								Gagal
							</span>
						</td>
					);
				}
				return (
					<td
						key={index + "vehicle name"}
						className="md:px-6 md:py-3 mb-4 md:mb-0"
					>
						{data.trafficVehicleRfid}
					</td>
				);
			},
		},
		{
			title: "Rfid Pengguna",
			data: (data: ITrafficModel, index: number): ReactElement => {
				if (!data.trafficUserRfidCard) {
					return (
						<td
							key={index + "rfid card"}
							className="md:px-6 md:py-3 mb-4 md:mb-0"
						>
							<span className="bg-red-100 text-red-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded">
								Gagal
							</span>
						</td>
					);
				}
				return (
					<td
						key={index + "vehicle name"}
						className="md:px-6 md:py-3 mb-4 md:mb-0"
					>
						{data.trafficUserRfidCard}
					</td>
				);
			},
		},
		{
			title: "Status",
			data: (data: ITrafficModel, index: number): ReactElement => {
				if (data.trafficStatus === "checkIn") {
					return (
						<td
							key={index + "status"}
							className="md:px-6 md:py-3 mb-4 md:mb-0"
						>
							<span className="bg-teal-100 text-teal-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded">
								Masuk
							</span>
						</td>
					);
				} else {
					return (
						<td
							key={index + "status"}
							className="md:px-6 md:py-3 mb-4 md:mb-0"
						>
							<span className="bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded">
								Keluar
							</span>
						</td>
					);
				}
			},
		},
		{
			title: "Waktu",
			data: (data: ITrafficModel, index: number): ReactElement => {
				if (data.trafficStatus === "checkIn") {
					return (
						<td
							key={index + "status"}
							className="md:px-6 md:py-3 mb-4 md:mb-0"
						>
							{data.trafficVehicleCheckIn}
						</td>
					);
				} else {
					return (
						<td
							key={index + "status"}
							className="md:px-6 md:py-3 mb-4 md:mb-0"
						>
							{data.trafficVehicleCheckOut}
						</td>
					);
				}
			},
		},

		{
			title: "Aksi",
			action: true,
			data: (data: ITrafficModel, index: number): ReactElement => (
				<td key={index + "action"} className="md:px-6 md:py-3 mb-4 md:mb-0">
					{/* Desktop only  */}
					<div className="hidden md:block">
						<Link to={`/traffic/detail/${data.trafficId}`}>
							<button className="bg-transparent  m-1 hover:bg-teal-500 text-teal-700 hover:text-white py-1 px-2 border border-teal-500 hover:border-transparent rounded">
								Detail
							</button>
						</Link>
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
									<Link
										to={`/user-data/detail/${data.trafficId}`}
										className="block py-2 px-4 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-800 dark:hover:text-white"
									>
										Detail
									</Link>
								</li>
							</ul>
						</div>
					</div>
				</td>
			),
		},
	];

	return (
		<div className="bg-white rounded p-5">
			<Breadcrumb title="Traffic" navigation={navigation} />
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

						<select
							name="range"
							defaultValue={loader?.table?.filter.range}
							className="block w-32 px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
						>
							<option value="all">Semua</option>
							<option value="today">Hari ini</option>
							<option value="yesterday">Kemarin</option>
							<option value="week">Minggu ini</option>
							<option value="month">Bulan ini</option>
							<option value="year">Tahun ini</option>
						</select>

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
		</div>
	);
}
