import { useLoaderData } from "@remix-run/react";
import { LoaderFunction, redirect } from "@remix-run/router";
import {
	AreaChart,
	Area,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	PieChart,
	Pie,
	Cell,
} from "recharts";
import { FaUsers, FaCarSide, FaMotorcycle } from "react-icons/fa";
import { CONFIG } from "~/config";
import { API } from "~/services/api";
import { checkSession } from "~/services/session";

export let loader: LoaderFunction = async ({ request }) => {
	const session: any = await checkSession(request);
	if (!session) return redirect("/login");

	try {
		const statistic = await API.get({
			session: request,
			url: `${CONFIG.base_url_api}/statistic`,
		});
		return { statistic, session, isError: false };
	} catch (error: any) {
		console.log(error);
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

	const pieChartData = [
		{ name: "Motor", value: loader.statistic.motor },
		{ name: "Mobil", value: loader.statistic.mobil },
	];

	const COLORS = ["#0088FE", "#00C49F"];

	const RADIAN = Math.PI / 180;
	const renderCustomizedLabel = ({
		cx,
		cy,
		midAngle,
		innerRadius,
		outerRadius,
		percent,
		index,
	}: any) => {
		const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
		const x = cx + radius * Math.cos(-midAngle * RADIAN);
		const y = cy + radius * Math.sin(-midAngle * RADIAN);

		return (
			<text
				x={x}
				y={y}
				fill="white"
				textAnchor={x > cx ? "start" : "end"}
				dominantBaseline="central"
			>
				{`${(percent * 100).toFixed(0)}%`}
			</text>
		);
	};

	const lineChartData = [
		{
			name: "07/12/2022",
			motor: 400,
			mobil: 240,
		},
		{
			name: "07/12/2022",
			motor: 300,
			mobil: 138,
		},
		{
			name: "08/12/2022",
			motor: 200,
			mobil: 980,
		},
		{
			name: "08/12/2022",
			motor: 270,
			mobil: 398,
		},
		{
			name: "08/12/2022",
			motor: 180,
			mobil: 480,
		},
		{
			name: "09/12/2022",
			motor: 230,
			mobil: 380,
		},
		{
			name: "09/12/2022",
			motor: 340,
			mobil: 430,
		},
	];

	return (
		<div className="flex flex-wrap gap-5">
			<div className="bg-white rounded-md shadow-md h-72 p-8 ">
				<h1 className="text-xl font-semibold ml-10">Jumlah Kendaraan</h1>

				<div className="flex ">
					<PieChart width={300} height={200}>
						<Pie
							data={pieChartData}
							cx="50%"
							cy="50%"
							labelLine={false}
							label={renderCustomizedLabel}
							outerRadius={80}
							fill="#0088FE"
							dataKey="value"
						>
							{pieChartData.map((entry, index) => (
								<Cell
									key={`cell-${index}`}
									fill={COLORS[index % COLORS.length]}
								/>
							))}
						</Pie>
					</PieChart>
					<div className="ml-5">
						<div className="flex items-center mb-5">
							<div
								style={{ backgroundColor: "#0088FE" }}
								className="h-5 w-5 mx-2 rounded-full"
							></div>
							<h1 className="text-md font-semibold text-gray-500">Motor</h1>
						</div>
						<div className="flex items-center mb-5">
							<div
								style={{ backgroundColor: "#00C49F" }}
								className="h-5 w-5 mx-2 rounded-full"
							></div>
							<h1 className="text-md font-semibold text-gray-500">Mobil</h1>
						</div>
					</div>
				</div>
			</div>

			<div className="p-2 bg-white shadow-md rounded-md h-72">
				<div className="flex items-center text-gray-500 mb-5">
					<div className="flex items-center">
						<div
							style={{ backgroundColor: "#0088FE" }}
							className="h-5 w-5 mx-2 rounded-sm"
						></div>
						<h1>Motor</h1>
					</div>
					<div className="flex items-center">
						<div
							style={{ backgroundColor: "#00C49F" }}
							className="h-5 w-5 mx-2 rounded-sm"
						></div>
						<h1>Mobil</h1>
					</div>
					<h1 className="text-xl font-semibold ml-10">Traffics</h1>
				</div>
				<AreaChart
					width={500}
					height={230}
					data={lineChartData}
					margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
				>
					<defs>
						<linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
							<stop offset="5%" stopColor="#0088FE" stopOpacity={0.8} />
							<stop offset="95%" stopColor="#0088FE" stopOpacity={0} />
						</linearGradient>
						<linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
							<stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
							<stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
						</linearGradient>
					</defs>
					<XAxis dataKey="name" />
					<YAxis />
					<CartesianGrid strokeDasharray="3 3" />
					<Tooltip />
					<Area
						type="monotone"
						dataKey="motor"
						stroke="#0088FE"
						fillOpacity={1}
						fill="url(#colorUv)"
					/>
					<Area
						type="monotone"
						dataKey="mobil"
						stroke="#82ca9d"
						fillOpacity={1}
						fill="url(#colorPv)"
					/>
				</AreaChart>
			</div>

			<div className="flex flex-col justify-between gap-5">
				<div className="flex items-center bg-white rounded-md shadow-md p-5 my-1 sm:w-96">
					<FaUsers className="text-3xl mr-5 text-gray-500" />
					<h1 className="text-md text-gray-500">
						{loader.statistic.users} Pengguna Terdaftar
					</h1>
				</div>
				<div className="flex items-center bg-white rounded-md shadow-md p-5 my-2 sm:w-96">
					<FaCarSide className="text-3xl mr-5 text-gray-500" />
					<h1 className="text-md text-gray-500">
						{loader.statistic.mobil} Mobil Terdaftar
					</h1>
				</div>
				<div className="flex items-center bg-white rounded-md shadow-md p-5 my-2 sm:w-96">
					<FaMotorcycle className="text-3xl mr-5 text-gray-500" />
					<h1 className="text-md text-gray-500">
						{loader.statistic.motor} Motor Terdaftar
					</h1>
				</div>
			</div>
		</div>
	);
}
