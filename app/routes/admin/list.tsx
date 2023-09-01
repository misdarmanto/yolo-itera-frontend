import { Form, Link, useActionData, useLoaderData, useSubmit } from "@remix-run/react";
import { LoaderFunction, redirect } from "@remix-run/router";
import { useState } from "react";
import Button from "~/components/buttom";
import { API } from "~/services/api";
import { CONFIG } from "~/config";
import { checkSession } from "~/services/session";

export let loader: LoaderFunction = async ({ request }) => {
	const session: any = await checkSession(request);
	if (!session) return redirect("/login");

	try {
		const admin = await API.get({
			session: session,
			url: `${CONFIG.base_url_api.default}/admin/list`,
		});

		return { ...admin, isError: false };
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

	const submit = useSubmit();

	const [isOpenModal, setIsOpenModal] = useState(false);
	const [modalData, setModalData] = useState<any>();

	console.log(modalData);

	const handleModal = () => {
		setIsOpenModal(!isOpenModal);
	};

	const handleDeleteVehicle = async (e: React.FormEvent<HTMLFormElement>) => {
		submit(e.currentTarget, { method: "delete", action: `/users` });
		setIsOpenModal(!isOpenModal);
	};

	return (
		<div className="bg-white w-full sm:w-2/5 m-2 h-96 p-5 overflow-y-auto rounded-md shadow-md">
			<h1 className="text-center">User Access</h1>

			<ul className="max-w-md divide-y divide-gray-200 dark:divide-gray-700">
				{loader.items.map((item: any, index: number) => (
					<li key={index} className="py-3 sm:py-4">
						<div className="flex items-center space-x-4">
							<div className="flex-shrink-0">
								<img
									className="w-8 h-8 rounded-full"
									src={item.photo}
									alt="admin photo"
								/>
							</div>
							<div className="flex-1 min-w-0">
								<p className="text-sm font-medium text-gray-900 truncate dark:text-white">
									{item.name}
								</p>
								<p className="text-sm text-gray-500 truncate dark:text-gray-400">
									{item.role}
								</p>
							</div>
							<Button
								title="detail"
								className="p-2"
								onClick={() => {
									handleModal();
									setModalData(item);
								}}
							/>
						</div>
					</li>
				))}
			</ul>

			{isOpenModal && (
				<div className="fixed inset-0 z-10 overflow-y-auto">
					<div
						className="fixed inset-0 w-full h-full bg-black opacity-10"
						onClick={handleModal}
					></div>
					<div className="flex items-center min-h-screen px-4 py-8">
						<div className="relative w-full max-w-xl p-8 mx-auto bg-white rounded-md shadow-lg">
							<Form method="post">
								<div className="flex">
									<div className="mx-2">
										<label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
											Nama
										</label>
										<input
											type="text"
											name="name"
											defaultValue={modalData.name}
											className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
											placeholder="nama"
											required
										/>
									</div>

									<div className="mx-2">
										<label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
											E-mail
										</label>
										<input
											type="email"
											name="email"
											className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
											placeholder="email"
											defaultValue={modalData.email}
											required
										/>
									</div>
								</div>

								<div className="flex mt-5">
									<div className="mx-2">
										<label className="block text-sm font-medium text-gray-900 dark:text-white">
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

									<div className="mx-2">
										<label className="block text-sm font-medium text-gray-900 dark:text-white">
											Role
										</label>
										<select
											name="role"
											className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
										>
											<option value="admin" selected>
												Admin
											</option>
											<option value="superAdmin">
												Super Admin
											</option>
										</select>
									</div>
								</div>
							</Form>

							<div className="mt-10 flex justify-end">
								<Form method="delete" onSubmit={handleDeleteVehicle}>
									<input className="hidden" name="id"></input>
									<Button
										title="Delete"
										type="submit"
										className="border-red-500 mx-5 hover:bg-red-300 hover:text-white text-red-500"
									/>
								</Form>

								<Form method="delete" onSubmit={handleDeleteVehicle}>
									<input className="hidden" name="id"></input>
									<Button title="Update" />
								</Form>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
