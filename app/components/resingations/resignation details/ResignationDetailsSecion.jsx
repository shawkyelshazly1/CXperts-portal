import moment from "moment";
import React from "react";

import S from "underscore.string";

export default function ResignationDetailsSecion({ resignation }) {
	return (
		<div className="flex flex-col bg-white rounded-lg p-6 w-full ">
			<h1 className="text-2xl font-bold  text-primary mb-4">
				Resignation Details
			</h1>

			<div className="grid grid-cols-2 w-fit gap-y-2">
				<p className="text-gray-500">
					<strong>Submission Date:</strong>
				</p>
				<p>{moment(resignation.submissionDate).format("DD-MMM-YYYY")}</p>
				<p className="text-gray-500">
					<strong>Resignation Reason:</strong>
				</p>
				<p>
					{resignation.reason
						?.split("_")
						.map((word) => S(word).capitalize().value())
						.join(" ")}
				</p>
				<p className="text-gray-500">
					<strong>Last Working Date:</strong>
				</p>
				<p className="flex xl:flex-row flex-col gap-1">
					{moment(resignation.lastWorkingDate).format("DD-MMM-YYYY")}{" "}
					<span className="font-bold text-gray-600">
						{moment(resignation.lastWorkingDate).diff(
							resignation.lastWorkingDate,
							"days"
						) >= 0 &&
							"( " +
								moment(resignation.lastWorkingDate).diff(Date.now(), "days") +
								" days remaining" +
								" )"}
					</span>
				</p>
				<p className="text-gray-500">
					<strong>HR Assigned:</strong>
				</p>
				<p>
					{S(resignation?.hrAssigned?.firstName).capitalize().value() +
						" " +
						S(resignation?.hrAssigned?.lastName).capitalize().value()}
					{}
				</p>
			</div>
		</div>
	);
}
