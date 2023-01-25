import { useState } from "react";
import { TrashIcon } from "@heroicons/react/outline";
import Button from "~/components/buttom";
import { Form, useActionData, useLoaderData, useSubmit, useTransition } from "@remix-run/react";
import { redirect, ActionFunction, LoaderFunction } from "@remix-run/router";
import { API } from "~/services/api";
import { CONFIG } from "~/config";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "~/utilities/firebase";

export let loader: LoaderFunction = async ({ params, request }) => {
	try {
		const vehicle = await API.get({
			session: request,
			url: `${CONFIG.base_url_api.default}/vehicles/?id=${params.id}`,
		});
		const url = new URL(request.url);
		const search = url.searchParams.get("search");
		let users = { items: [] };
		if (search !== "" && search !== null) {
			users = await API.get({
				session: request,
				url: `${CONFIG.base_url_api.default}/users/list?search=${search}`,
			});
		}

		const currentUser = await API.get({
			session: request,
			url: `${CONFIG.base_url_api.default}/users?id=${vehicle.userId}`,
		});

		return { vehicle, currentUser, users, search, isError: false };
	} catch (error: any) {
		console.error(error);
		return { ...error, isError: true };
	}
};

export const action = async ({ request }: any) => {
	const formData = await request.formData();
	try {
		if (request.method == "POST") {
			const payload = {
				id: formData.get("id"),
				userId: formData.get("user_id"),
				name: formData.get("vehicle_name"),
				photo:
					formData.get("vehicle_image") ||
					"https://pousses.fr/sites/default/files/2022-01/no-image.png",
				stnk:
					formData.get("stnk_image") ||
					"https://pousses.fr/sites/default/files/2022-01/no-image.png",
				plateNumber: formData.get("plate_number"),
				color: formData.get("color"),
				type: formData.getAll("vehicle_types")[0],
			};

			await API.patch({ session: "", url: `${CONFIG.base_url_api.default}/vehicles`, body: payload });
			return redirect("/vehicles");
		}
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

	const actionData = useActionData();
	console.log(actionData);

	const currentUser = loader.currentUser;
	const currentVehicle = loader.vehicle;

	const transition = useTransition();
	const submit = useSubmit();
	const handleSubmit = (event: any) => {
		submit(event.currentTarge, { method: "post", action: "/vehicle" });
	};

	const [imgeVehicle, setImageVehicle] = useState<string>(loader.vehicle.photo);
	const [stnkPhoto, setStnkPhoto] = useState<string>(loader.vehicle.stnk);
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

	const handleUploadImageStnk = async (event: any) => {
		const file = event.target.files[0];
		const imageRef = ref(storage, "STNKImage/" + file.name);
		try {
			const imageUrl = await uploadImageToFirebase({ imageRef, file });
			setStnkPhoto(imageUrl);
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<Form method="post" onSubmit={handleSubmit}>
			<div className="flex items-center justify-center bg-white rounded-md shadow-md">
				<div className="w-full  m-2 mx-5 sm:m-10   p-5 sm:p-10">
					<h1 className="text-3xl font-semibold text-teal-500 text-center mb-10">
						Update Kendaraan
					</h1>
					<div className="grid gap-6 mb-6 md:grid-cols-2 ">
						<div>
							<label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
								Nama Pemilik
							</label>
							<input
								onFocus={() => setIsOpenModal(true)}
								type="text"
								value={userOwner?.name || currentUser.name}
								name="owner_name"
								className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-teal-500 focus:border-teal-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-teal-500 dark:focus:border-teal-500"
								placeholder="Jack"
								required
							/>
							<input
								type="hidden"
								defaultValue={userOwner?.id || currentUser.id}
								name="user_id"
							/>

							{isOpenModal && (
								<Modal
									isOpenModal={isOpenModal}
									setIsOpenModal={setIsOpenModal}
									loader={loader}
									onUserSelected={setUserOwner}
									onSearch={(e: any) =>
										submit(e.currentTarget, {
											action: `/vehicles/${loader.vehicle.id}/update`,
										})
									}
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
								defaultValue={currentVehicle.name}
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
								defaultValue={currentVehicle.plateNumber}
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
								defaultValue={currentVehicle.color}
								className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-teal-500 focus:border-teal-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-teal-500 dark:focus:border-teal-500"
								placeholder="ex: hitam"
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
								<option defaultValue="Motor" selected={currentVehicle.type === "Motor"}>
									Motor
								</option>
								<option defaultValue="Mobil" selected={currentVehicle.type === "Mobil"}>
									Mobil
								</option>
							</select>
						</div>
					</div>

					<div className="grid gap-6 mb-6 md:grid-cols-2">
						<div className="w-full md:mr-2">
							<label className="mt-2 block text-sm font-medium text-gray-700">
								Foto kendaraan
								<span className="text-xs text-purple-500"> Pastikan ukuran gambar 1:1</span>
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
								<img src={imgeVehicle} className="h-30 image-cover flex-center"></img>
								<input type="hidden" defaultValue={imgeVehicle} name="vehicle_image" />
							</div>
						</div>
						<div className="w-full md:mr-2">
							<label className="mt-2 block text-sm font-medium text-gray-700">
								Foto STNK
								<span className="text-xs text-purple-500"> Pastikan ukuran gambar 1:1</span>
							</label>
							<div className="mt-2">
								<input
									onChange={handleUploadImageStnk}
									className={`block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm`}
									type="file"
								/>
							</div>
							<div className="mt-2 relative p-2 bg-white border-dashed border-2 border-gray-400 h-32 w-full rounded-lg image-cover flex flex-row justify-center">
								{stnkPhoto && (
									<TrashIcon
										className="absolute p-1 bottom-0 right-0 text-xs h-8 w-8 text-red-500 rounded-full bg-white hover:bg-red-200"
										onClick={() => setStnkPhoto("")}
									/>
								)}
								<img src={stnkPhoto} className="h-30 image-cover flex-center"></img>
								<input type="hidden" defaultValue={stnkPhoto} name="stnk_image" />
							</div>
						</div>
					</div>

					<Button
						className="w-full my-5"
						type="submit"
						title={transition.state === "submitting" ? "Loading..." : "Submit"}
					/>
					{actionData && <small className="text-sm text-red-500">{actionData.message}</small>}
				</div>
			</div>
			<input type="hidden" defaultValue={currentVehicle.id} name="id" />
		</Form>
	);
}

interface ModalTypes {
	isOpenModal: any;
	setIsOpenModal: any;
	onSearch: any;
	loader: any;
	onUserSelected: any;
}

const Modal = ({ isOpenModal, setIsOpenModal, onSearch, onUserSelected, loader }: ModalTypes) => {
	interface ListTypes {
		name: string;
		email: string;
		photo: string;
		onClick: any;
	}
	const List = ({ photo, name, email, onClick }: ListTypes) => {
		return (
			<li onClick={onClick} className="pb-3 p-2 sm:pb-4 rounded-lg hover:bg-gray-100">
				<div className="flex items-center space-x-4">
					<div className="flex-shrink-0">
						<img className="w-8 h-8 rounded-full" src={photo} alt="Neil image" />
					</div>
					<div className="flex-1 min-w-0">
						<p className="text-sm font-medium text-gray-900 truncate dark:text-white">{name}</p>
						<p className="text-sm text-gray-500 truncate dark:text-gray-400">{email}</p>
					</div>
				</div>
			</li>
		);
	};
	return (
		<div className="fixed inset-0 z-10 overflow-y-auto">
			<div
				className="fixed inset-0 w-full h-full bg-black opacity-10"
				onClick={() => setIsOpenModal(!isOpenModal)}
			></div>
			<div className="flex items-center min-h-screen px-4 py-8">
				<div className="relative h-64 flex w-full max-w-xl p-8 mx-auto bg-white rounded-md shadow-lg">
					<div className="w-full">
						<Form onChange={onSearch} method="get">
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
						<ul className="overfllow-y-auto max-w-md  mx-5 divide-y divide-gray-200 mt-5 dark:divide-gray-700">
							{loader.users &&
								loader.users?.items.map((user: any, index: number) => (
									<List
										email={user.email}
										name={user.name}
										photo={user.photo}
										onClick={() => {
											onUserSelected(user);
											setIsOpenModal(!isOpenModal);
										}}
									/>
								))}
						</ul>
					</div>
				</div>
			</div>
		</div>
	);
};
