import { useState } from "react";
import { TrashIcon } from "@heroicons/react/outline";
import Button from "~/components/buttom";
import { Form, useActionData, useLoaderData, useSubmit, useTransition } from "@remix-run/react";
import { redirect, ActionFunction, LoaderFunction } from "@remix-run/router";
import { CONFIG } from "~/config";
import { API } from "~/services/api";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "~/utilities/firebase";

export const action: ActionFunction = async ({ request }: any) => {
	const formData = await request.formData();
	const defaultImage = "https://cdn.pixabay.com/image/2013/07/13/12/07/avatar-159236__340.png";
	try {
		if (request.method == "POST") {
			const payload = {
				name: formData.get("name"),
				email: formData.get("email"),
				phone: formData.get("phone_number"),
				photo: formData.get("user_image") || defaultImage,
				photoIdentity: formData.get("image_identity") || defaultImage,
				registerAs: formData.getAll("register_as")[0],
			};
			await API.post({ session: "", url: `${CONFIG.base_url_api.default}/users`, body: payload });
			return redirect("/users");
		}
	} catch (error: any) {
		console.error(error);
		return error;
	}
};

export default function Index() {
	const actionData = useActionData();

	const transition = useTransition();
	const submit = useSubmit();
	const handleSubmit = (event: any) => {
		submit(event.currentTarge, { method: "post", action: "/users/create" });
	};

	const [userImage, setUserImage] = useState<string>();
	const [imageIdentity, setImageIdentity] = useState<string>();

	const uploadImageToFirebase = async ({ imageRef, file }: any) => {
		const snapshot = await uploadBytesResumable(imageRef, file);
		const url = await getDownloadURL(snapshot.ref);
		return url;
	};

	const handleUploadUserImage = async (event: any) => {
		const file = event.target.files[0];
		const imageRef = ref(storage, "userImage/" + file.name);
		try {
			const imageUrl = await uploadImageToFirebase({ imageRef, file });
			setUserImage(imageUrl);
		} catch (error) {
			console.log(error);
		}
	};

	const handleUploadIdentityImage = async (event: any) => {
		const file = event.target.files[0];
		const imageRef = ref(storage, "userImageIdentity/" + file.name);
		try {
			const imageUrl = await uploadImageToFirebase({ imageRef, file });
			setImageIdentity(imageUrl);
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<Form method="post" onSubmit={handleSubmit}>
			<div className="flex items-center justify-center bg-white rounded-md shadow-md">
				<div className="w-full  m-2 mx-5 sm:m-10   p-5 sm:p-10">
					<h1 className="text-3xl font-semibold text-teal-500 text-center mb-10">
						Registrasi Pengguna
					</h1>
					<div className="grid gap-6 mb-6 md:grid-cols-2 ">
						<div>
							<label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
								Nama
							</label>
							<input
								type="text"
								name="name"
								className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-teal-500 focus:border-teal-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-teal-500 dark:focus:border-teal-500"
								placeholder="nama"
								required
							/>
						</div>
						<div>
							<label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
								e-mail
							</label>
							<input
								className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-teal-500 focus:border-teal-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-teal-500 dark:focus:border-teal-500"
								placeholder="example@mail.com"
								name="email"
								required
							/>
						</div>
						<div>
							<label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
								Nomor Telephon
							</label>
							<input
								type="tel"
								id="phone"
								name="phone_number"
								className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
								placeholder="0812-2233-1222"
								// pattern="[0-9]{3}-[0-9]{2}-[0-9]{3}"
								required
							/>
						</div>
						<div>
							<label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
								Registrasi Sebagai
							</label>
							<select
								name="register_as"
								className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
								defaultValue="mahasiswa"
							>
								<option value="mahasiswa">Mahasiswa</option>
								<option value="pegawai">Pegawai</option>
								<option value="tamu">Tamu</option>
							</select>
						</div>
						<div className="w-full md:mr-2">
							<label className="mt-2 block text-sm font-medium text-gray-700">
								Foto
								<span className="text-xs text-purple-500"> Pastikan ukuran gambar 1:1</span>
							</label>
							<div className="mt-2">
								<input
									onChange={handleUploadUserImage}
									className={`block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm`}
									type="file"
								/>
							</div>
							<div className="mt-2 relative p-2 bg-white border-dashed border-2 border-gray-400 h-32 w-full rounded-lg image-cover flex flex-row justify-center">
								{userImage && (
									<TrashIcon
										className="absolute p-1 bottom-0 right-0 text-xs h-8 w-8 text-red-500 rounded-full bg-white hover:bg-red-200"
										onClick={() => setUserImage("")}
									/>
								)}
								<img src={userImage} className="h-30 image-cover flex-center"></img>
								<input type="hidden" defaultValue={userImage} name="user_image" />
							</div>
						</div>
						<div className="w-full md:mr-2">
							<label className="mt-2 block text-sm font-medium text-gray-700">
								Foto KTP/SIM/KTM
								<span className="text-xs text-purple-500"> Pastikan ukuran gambar 1:1</span>
							</label>
							<div className="mt-2">
								<input
									onChange={handleUploadIdentityImage}
									className={`block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm`}
									type="file"
								/>
							</div>
							<div className="mt-2 relative p-2 bg-white border-dashed border-2 border-gray-400 h-32 w-full rounded-lg image-cover flex flex-row justify-center">
								{imageIdentity && (
									<TrashIcon
										className="absolute p-1 bottom-0 right-0 text-xs h-8 w-8 text-red-500 rounded-full bg-white hover:bg-red-200"
										onClick={() => setImageIdentity("")}
									/>
								)}
								<img src={imageIdentity} className="h-30 image-cover flex-center"></img>
								<input type="hidden" defaultValue={imageIdentity} name="image_identity" />
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
		</Form>
	);
}
