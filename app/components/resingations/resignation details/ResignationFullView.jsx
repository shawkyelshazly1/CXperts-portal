import moment from "moment";
import React from "react";
import S from "underscore.string";
import EmployeeDetaisSection from "./EmployeeDetaisSection";
import ResignationDetailsSecion from "./ResignationDetailsSecion";
import ResignationFeedbackSection from "./ResignationFeedbackSection";

export default function ResignationFullView({ resignation }) {
	return (
		<div className="w-full h-full flex flex-row justify-evenly">
			<div className="flex flex-col w-full">
				<EmployeeDetaisSection resignation={resignation} />
			</div>
			<div className="flex flex-col w-full h-[calc(100vh-48vh)]">
				<ResignationDetailsSecion resignation={resignation} />
				<h1 className="text-2xl font-bold pl-6  text-primary mb-4">
					Resignation Feedback
				</h1>
				<ResignationFeedbackSection resignation={resignation} />
			</div>
		</div>
	);
}
