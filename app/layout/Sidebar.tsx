import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

import { AiFillPieChart, AiTwotoneSetting } from "react-icons/ai";
import { BiMenu } from "react-icons/bi";
import { FaCarSide, FaUsers } from "react-icons/fa";
import { RiCloseLine } from "react-icons/ri";
import { FiActivity } from "react-icons/fi";
import { MdVpnKey } from "react-icons/md";

const Sidebar = ({ session }: any) => {
	const [open, setOpen] = useState(false);
	const location = useLocation();

	const Menus = [
		{ title: "Statistic", path: "/", icon: <AiFillPieChart /> },
		{ title: "Traffic", path: "/traffic", icon: <FiActivity /> },
		{ title: "Users", path: "/users", icon: <FaUsers /> },
		{ title: "Vehicles", path: "/vehicles", icon: <FaCarSide /> },
	];

	if (session.role === "super admin") {
		Menus.push({ title: "Admin", path: "/admin", icon: <MdVpnKey /> });
		Menus.push({ title: "Settings", path: "/settings", icon: <AiTwotoneSetting /> });
	}
	return (
		<>
			<div
				className={`${
					open ? "w-60" : "w-fit"
				} sm:block relative h-screen duration-100 border-r border-gray-200 dark:border-gray-600 p-5 dark:bg-slate-800`}
			>
				<li
					className={`flex items-center gap-x-6 p-2 my-1 text-base font-normal rounded-lg cursor-pointer dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700`}
				>
					{open ? (
						<>
							<RiCloseLine className="text-3xl text-gray-500" onClick={() => setOpen(!open)} />
							<small>Close</small>
						</>
					) : (
						<BiMenu onClick={() => setOpen(!open)} className="text-3xl text-gray-500" />
					)}
				</li>

				<ul className="pt-1">
					{Menus.map((menu, index) => {
						const currentPath = menu.path;
						const isActive = location.pathname === currentPath;
						return (
							<Link to={menu.path} key={index}>
								<li
									className={`flex items-center text-gray-500 gap-x-6 p-3 my-1 text-base font-normal rounded-lg cursor-pointer dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700
                        ${isActive && "bg-gray-100 dark:bg-gray-700 text-teal-500"}`}
								>
									<span className="text-2xl">{menu.icon}</span>
									<span
										className={`${
											!open && "hidden"
										} origin-left duration-100 hover:block`}
									>
										{menu.title}
									</span>
								</li>
							</Link>
						);
					})}
				</ul>
			</div>
		</>
	);
};

export default Sidebar;
