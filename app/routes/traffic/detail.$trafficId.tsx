import { useLoaderData } from "@remix-run/react";
import { LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/router";
import { API } from "~/services/api";
import { checkSession } from "~/services/session";
import { Breadcrumb } from "~/components/breadcrumb";
import { CONFIG } from "~/config";
import { ITrafficModel } from "~/models/traffic";

export let loader: LoaderFunction = async ({ request, params }) => {
	const session: any = await checkSession(request);
	if (!session) return redirect("/login");
	try {
		const result = await API.get({
			session,
			url: CONFIG.base_url_api + `/traffic/detail/${params.trafficId}`,
		});
		return {
			traffic: result,
			session: session,
			isError: false,
		};
	} catch (error: any) {
		console.log(error);
		return { ...error, isError: true };
	}
};

export default function Index() {
	const navigation = [{ title: "Detail", href: "", active: true }];
	const loader = useLoaderData();
	const detailTraffic: ITrafficModel = loader.traffic;

	console.log(loader);
	if (loader.isError) {
		return (
			<h1 className="text-center font-bold text-3xl text-red-600">
				{loader.error?.messsage || "error"}
			</h1>
		);
	}

	return (
		<div className="">
			<Breadcrumb title="Traffic" navigation={navigation} />

			<div className="ml-0 mt-4 md:mt-0 bg-white rounded-xl p-5 sm:p-10 w-full">
				<div className="flex gap-5 items-center my-5">
					<h3 className="text-lg font-semibold">Nama Pemilik : </h3>
					<p className="text-gray-800">{detailTraffic.trafficUserName}</p>
				</div>
				<div className="flex gap-5 items-center my-5">
					<h3 className="text-lg font-semibold">Nama Kendaraan : </h3>
					<p className="text-gray-800">{detailTraffic.trafficVehicleName}</p>
				</div>
				<div className="flex gap-5 items-center my-5">
					<h3 className="text-lg font-semibold">Jenis Kendaraan : </h3>
					<p className="text-gray-800">{detailTraffic.trafficVehicleType}</p>
				</div>
				<div className="flex gap-5 items-center my-5">
					<h3 className="text-lg font-semibold">Warna Kendaraan : </h3>
					<p className="text-gray-800">{detailTraffic.trafficVehicleColor}</p>
				</div>
				<div className="flex gap-5 items-center my-5">
					<h3 className="text-lg font-semibold">Foto Kendaraan : </h3>
					<img src={detailTraffic.trafficVehicleImage} />
				</div>
			</div>
		</div>
	);
}
