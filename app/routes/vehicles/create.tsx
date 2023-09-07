import { useState } from "react";
import { TrashIcon, PlusCircleIcon } from "@heroicons/react/outline";
import Button from "~/components/buttom";
import {
	Form,
	useActionData,
	useLoaderData,
	useSubmit,
	useTransition,
} from "@remix-run/react";
import { redirect, ActionFunction, LoaderFunction } from "@remix-run/router";
import { API } from "~/services/api";
import { CONFIG } from "~/config";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "~/utilities/firebase";
import { checkSession } from "~/services/session";
import { IVehicleModel } from "~/models/vehicle";

export let loader: LoaderFunction = async ({ request }) => {
	const session: any = await checkSession(request);
	if (!session) return redirect("/login");

	try {
		let url = new URL(request.url);
		let search = url.searchParams.get("search");
		let users = { items: [] };
		if (search !== "" && search !== null) {
			users = await API.get({
				session: request,
				url: `${CONFIG.base_url_api}/users/list?search=${search}`,
			});
		}
		return { users, search, isError: false };
	} catch (error: any) {
		console.error(error);
		return { ...error, isError: true };
	}
};

export const action = async ({ request }: any) => {
	const session: any = await checkSession(request);
	if (!session) return redirect("/login");

	const formData = await request.formData();
	try {
		if (request.method == "POST") {
			const payload: IVehicleModel = {
				vehicleUserId: formData.get("user_id"),
				vehicleName: formData.get("vehicle_name"),
				vehicleRfid: formData.get("vehicleRfid"),
				vehiclePhoto:
					formData.get("vehicleImage") ||
					"https://pousses.fr/sites/default/files/2022-01/no-image.png",
				vehiclePlateNumber: formData.get("plate_number"),
				vehicleColor: formData.get("color"),
				vehicleType: formData.getAll("vehicle_types")[0],
			};

			await API.post({
				session: "",
				url: `${CONFIG.base_url_api}/vehicles`,
				body: payload,
			});
			return redirect("/vehicles");
		}
	} catch (err: any) {
		console.log(err);
		return err;
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

	const transition = useTransition();

	const submit = useSubmit();
	const handleSubmit = (event: any) => {
		submit(event.currentTarge, { method: "post", action: "/vehicle" });
	};

	const [imgeVehicle, setImageVehicle] = useState<string>();
	const [isOpenModal, setIsOpenModal] = useState(false);
	const [userOwner, setUserOwner] = useState<any>();

	const uploadImageToFirebase = async ({ imageRef, file }: any) => {
		const snapshot = await uploadBytesResumable(imageRef, file);
		const url = await getDownloadURL(snapshot.ref);
		return url;
	};

	const handleUploadImageVehicle = async (event: any) => {
		const file = event.target.files[0];
		const imageRef = ref(storage, "vehicleImage/" + file.name);
		try {
			const imageUrl = await uploadImageToFirebase({ imageRef, file });
			setImageVehicle(imageUrl);
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<Form method="post" onSubmit={handleSubmit}>
			<div className="flex items-center justify-center bg-white rounded-md shadow-md">
				<div className="w-full  m-2 mx-5 sm:m-10   p-5 sm:p-10">
					<h1 className="text-3xl font-semibold text-teal-500 text-center mb-10">
						Registrasi Kendaraan
					</h1>
					<div className="grid gap-6 mb-6 md:grid-cols-2 ">
						<div>
							<label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
								Nama Pemilik
							</label>
							<input
								onFocus={() => setIsOpenModal(true)}
								type="text"
								value={userOwner?.userName || ""}
								name="owner_name"
								className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-teal-500 focus:border-teal-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-teal-500 dark:focus:border-teal-500"
								placeholder="Jack"
								required
							/>
							<input
								type="hidden"
								value={userOwner?.userId || null}
								name="user_id"
							/>

							{isOpenModal && (
								<Modal
									isOpenModal={isOpenModal}
									setIsOpenModal={setIsOpenModal}
									loader={loader}
									onUserSelected={setUserOwner}
									submit={submit}
								/>
							)}
						</div>
						<div>
							<label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
								Nama Kendaraan
							</label>
							<input
								type="text"
								name="vehicle_name"
								className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-teal-500 focus:border-teal-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-teal-500 dark:focus:border-teal-500"
								placeholder="Nissan GT-R50"
								required
							/>
						</div>
						<div>
							<label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
								Nomor Pelat
							</label>
							<input
								type="text"
								name="plate_number"
								className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-teal-500 focus:border-teal-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-teal-500 dark:focus:border-teal-500"
								placeholder="contoh: BE1234XX"
								required
							/>
						</div>
						<div>
							<label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
								Warna Kendaraan
							</label>
							<input
								type="text"
								name="color"
								className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-teal-500 focus:border-teal-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-teal-500 dark:focus:border-teal-500"
								placeholder="ex: hitam"
								required
							/>
						</div>
						<div>
							<label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
								RFID Kendaraan
							</label>
							<input
								type="text"
								name="vehicleRfid"
								className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-teal-500 focus:border-teal-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-teal-500 dark:focus:border-teal-500"
								placeholder="ex: 4234234234"
								required
							/>
						</div>
						<div>
							<label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
								Jenis Kendaraan
							</label>
							<select
								name="vehicle_types"
								className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
							>
								<option value="Motor" selected>
									Motor
								</option>
								<option value="Mobil">Mobil</option>
							</select>
						</div>
					</div>

					<div className="grid gap-6 mb-6 md:grid-cols-2">
						<div className="w-full md:mr-2">
							<label className="mt-2 block text-sm font-medium text-gray-700">
								Foto kendaraan
								<span className="text-xs text-purple-500">
									{" "}
									Pastikan ukuran gambar 1:1
								</span>
							</label>
							<div className="mt-2">
								<input
									onChange={handleUploadImageVehicle}
									className={`block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm`}
									type="file"
								/>
							</div>
							<div className="mt-2 relative p-2 bg-white border-dashed border-2 border-gray-400 h-32 w-full rounded-lg image-cover flex flex-row justify-center">
								{imgeVehicle && (
									<TrashIcon
										className="absolute p-1 bottom-0 right-0 text-xs h-8 w-8 text-red-500 rounded-full bg-white hover:bg-red-200"
										onClick={() => setImageVehicle("")}
									/>
								)}
								<img
									src={imgeVehicle}
									className="h-30 image-cover flex-center"
								></img>
								<input
									type="hidden"
									defaultValue={imgeVehicle}
									name="vehicleImage"
								/>
							</div>
						</div>
					</div>

					<div className="mt-5 flex justify-end">
						<button
							className="w-64 text-white bg-teal-500 hover:text-teal-200 focus:outline-none hover:bg-teal-500 focus:ring-4 focus:ring-teal-200 font-medium rounded-lg text-sm px-5 py-1.5"
							type="submit"
						>
							{transition.state === "submitting" ? "Loading..." : "Buat"}
						</button>
						{actionData && (
							<small className="text-sm text-red-500">
								{actionData.message}
							</small>
						)}
					</div>
				</div>
			</div>
		</Form>
	);
}

interface ModalTypes {
	isOpenModal: any;
	setIsOpenModal: any;
	submit: any;
	loader: any;
	onUserSelected: any;
}

const Modal = ({
	isOpenModal,
	setIsOpenModal,
	submit,
	onUserSelected,
	loader,
}: ModalTypes) => {
	return (
		<div className="fixed inset-0 z-10">
			<div
				className="fixed inset-0 w-full h-full bg-black opacity-10"
				onClick={() => setIsOpenModal(!isOpenModal)}
			></div>
			<div className="flex items-center min-h-screen px-4 py-8">
				<div className="relative h-64 flex max-w-xl p-8 mx-auto bg-white rounded-md shadow-lg">
					<div className="w-96 overflow-y-scroll">
						<Form
							onChange={(e: any) =>
								submit(e.currentTarget, { action: "/vehicles/create" })
							}
							method="get"
						>
							<div className="flex flex-row ">
								<input
									type="email"
									name="search"
									defaultValue={loader.search}
									className="bg-gray-50 border border-gray-300 mx-5 h-10 text-gray-900 text-sm rounded-lg focus:ring-teal-500 focus:border-teal-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-teal-500 dark:focus:border-teal-500"
									placeholder="masukan e-mail"
									required
								/>
							</div>
						</Form>
						<ul className="max-w-md  mx-5 divide-y divide-gray-200 mt-5 dark:divide-gray-700">
							{loader.users &&
								loader.users?.items.map((user: any, index: number) => (
									<li
										key={index}
										onClick={() => {
											onUserSelected(user);
											setIsOpenModal(!isOpenModal);
										}}
										className="pb-3 p-2 sm:pb-4 rounded-lg hover:bg-gray-100"
									>
										<div className="flex items-center space-x-4">
											<div className="flex-shrink-0">
												<img
													className="w-8 h-8 rounded-full"
													src={user?.userPhoto}
													alt="Neil image"
												/>
											</div>
											<div className="flex-1 min-w-0">
												<p className="text-sm font-medium text-gray-900 truncate dark:text-white">
													{user.UserName}
												</p>
												<p className="text-sm text-gray-500 truncate dark:text-gray-400">
													{user.userEmail}
												</p>
											</div>
										</div>
									</li>
								))}
						</ul>
					</div>
				</div>
			</div>
		</div>
	);
};
