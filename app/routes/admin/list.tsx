import { Form, Link, useActionData, useLoaderData, useSubmit } from "@remix-run/react";
import { LoaderFunction, ActionFunction, json } from "@remix-run/router";
import { useState } from "react";
import Button from "~/components/buttom";
import { API } from "~/services/api";
import { CONFIG } from "~/config";

export let loader: LoaderFunction = async ({ request }) => {
	try {
		const admin = await API.get({
			session: request,
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
	return (
		<div className="bg-white w-full sm:w-2/5 m-2 h-96 p-5 overflow-y-auto rounded-md shadow-md">
			<h1 className="text-center">User Access</h1>

			<ul className="max-w-md divide-y divide-gray-200 dark:divide-gray-700">
				{loader.items.map((item: any, index: number) => (
					<li key={index} className="py-3 sm:py-4">
						<div className="flex items-center space-x-4">
							<div className="flex-shrink-0">
								<img className="w-8 h-8 rounded-full" src={item.photo} alt="admin photo" />
							</div>
							<div className="flex-1 min-w-0">
								<p className="text-sm font-medium text-gray-900 truncate dark:text-white">
									{item.name}
								</p>
								<p className="text-sm text-gray-500 truncate dark:text-gray-400">
									{item.role}
								</p>
							</div>
							<Button title="edite" className="p-2" />
						</div>
					</li>
				))}
			</ul>
		</div>
	);
}
