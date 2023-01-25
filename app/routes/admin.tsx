import { Link, Outlet, useLoaderData } from "@remix-run/react";
import { LoaderFunction } from "@remix-run/router";
import { FaUserCog } from "react-icons/fa";
import { BiMessageAdd } from "react-icons/bi";
import { FiUserPlus } from "react-icons/fi";

export default function Index() {
    return (
        <div className="flex flex-wrap">
            <div className="w-full sm:w-2/5 m-2 mr-10 h-96 max-w-sm p-4 bg-white border rounded-lg shadow-md sm:p-6 dark:bg-gray-800 dark:border-gray-700">
                <h5 className="mb-3 text-base font-semibold text-gray-900 md:text-xl dark:text-white">Admin</h5>
                <ul className="my-4 space-y-3">
                    <li>
                        <Link
                            to="/admin/add"
                            className="flex items-center p-3 text-base font-bold text-gray-900 rounded-lg bg-gray-50 hover:bg-gray-100 group hover:shadow dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white"
                        >
                            <FiUserPlus className="text-3xl mr-5 text-gray-500" />
                            <span className="flex-1 ml-3 whitespace-nowrap">add admin</span>
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/admin/list"
                            className="flex items-center p-3 text-base font-bold text-gray-900 rounded-lg bg-gray-50 hover:bg-gray-100 group hover:shadow dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white"
                        >
                            <FaUserCog className="text-3xl mr-5 text-gray-500" />
                            <span className="flex-1 ml-3 whitespace-nowrap">Admin Member</span>
                        </Link>
                    </li>
                </ul>
            </div>
            <Outlet />
        </div>
    );
}
