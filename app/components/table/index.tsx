import Button from "../buttom";
import DropDown from "../dropdown";
import Search from "../form/search";
import Pagination from "../pagination";
import { useCallback, useState } from "react";
import moment from "moment";
import * as XLSX from "xlsx";
import { Form, Link, useLocation, useSubmit } from "@remix-run/react";

const TableHeader = ({ headers }: any) => {
    return (
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
                {headers.map((header: any, index: number) => (
                    <th key={index} scope="col" className="py-3 px-6">
                        {header}
                    </th>
                ))}
            </tr>
        </thead>
    );
};

let indexSelected = 0;
const TableBody = ({ body, actionComponent = () => null }: any) => {
    return (
        <tbody>
            {body.map((item: any, index: number) => {
                const keys = Object.keys(item);
                const more = body[indexSelected];
                const isUsingActionComponent = actionComponent(more, index);

                return (
                    <tr
                        key={index}
                        className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                    >
                        {keys.map((name) => {
                            if (name !== "more") {
                                return (
                                    <td key={name} className="py-4 px-6">
                                        {item[name]}
                                    </td>
                                );
                            }
                        })}
                        {isUsingActionComponent && (
                            <td onClick={() => (indexSelected = index)} className="py-4 px-6">
                                {actionComponent(more, index)}
                            </td>
                        )}
                    </tr>
                );
            })}
        </tbody>
    );
};

export default function Table({ header, body, search, onSearch, actionComponent, showAddButton = true }: any) {
    const currentNavigation = useLocation();
    const download = () => {
        try {
            let xlsRows: any[] = body.map((data: any) => {
                const newRows: any = [];
                const objKey = Object.keys(data);
                objKey.forEach((key) => {
                    if (key !== "more") {
                        newRows.push(data[key]);
                    }
                });
                return newRows;
            });
            const xlsHeader = header.filter((item: string) => item.toUpperCase() !== "ACTION");
            const createXLSLFormatObj = [xlsHeader, ...xlsRows];
            const filename = `user_${moment().format("DD-MM-YYYY")}.xlsx`;

            const worksheetName = "Sheet1";
            if (typeof console !== "undefined") console.log(new Date());
            const workbook = XLSX.utils.book_new();
            const worksheet = XLSX.utils.aoa_to_sheet(createXLSLFormatObj);

            XLSX.utils.book_append_sheet(workbook, worksheet, worksheetName);
            XLSX.writeFile(workbook, filename);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="overflow-x-auto relative shadow-md sm:rounded-lg my-5">
            <div className="flex justify-between items-center p-4 bg-white">
                <div className="flex items-center">
                    {showAddButton && (
                        <Link to={`${currentNavigation.pathname}/create`}>
                            <Button className="mx-2" title="Tambah" />
                        </Link>
                    )}
                    <Button className="mx-2" onClick={download} title="Download" />
                </div>
                <Form onChange={onSearch} method="get">
                    <div className="relative">
                        <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                            <svg
                                className="w-5 h-5 text-gray-500 dark:text-gray-400"
                                aria-hidden="true"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                                    clipRule="evenodd"
                                ></path>
                            </svg>
                        </div>
                        <input
                            type="text"
                            id="table-search"
                            defaultValue={search}
                            name="search"
                            className="block p-2 pl-10 w-80 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-teal-500 focus:border-teal-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-teal-500 dark:focus:border-teal-500"
                            placeholder="Search..."
                        />
                    </div>
                </Form>
            </div>
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <TableHeader headers={header} />
                <TableBody body={body} actionComponent={actionComponent} />
            </table>
            <Pagination />
        </div>
    );
}
