import React from "react";
import S from "underscore.string";

export default function EmployeeDocuments({ employee }) {
	console.log(typeof employee?.documents);
	return (
		<div className="flex flex-col">
			<h1 className="text-2xl font-semibold text-gray-400">Documents</h1>
			<div className="flex flex-row my-4 border-2">
				{Object.entries(employee.documents)
					.filter(
						([key]) =>
							key.toLowerCase() !== "id" && key.toLowerCase() !== "employeeid"
					)
					.map(([key, value], index) => (
						<div
							key={index}
							className="flex flex-col items-center justify-center border-[1px]"
						>
							<h1 className="bg-primary text-white font-medium w-full text-center  py-2 px-4">
								{key
									.split("_")
									.map((word) => S(word).capitalize().value())
									.join(" ")}
							</h1>
							<div className="text-center w-full py-2 px-4 ">
								{value ? (
									<a
										href={value}
										target="_blank"
										rel="noopener noreferrer"
										className="cursor-pointer text-blue-500 hover:text-blue-700 font-medium underline"
									>
										View Document
									</a>
								) : (
									<span className="text-red-300">Not Submitted</span>
								)}
							</div>
						</div>
					))}
			</div>
		</div>
	);
}
