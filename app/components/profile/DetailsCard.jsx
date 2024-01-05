import React from "react";
import S from "underscore.string";

export default function DetailsCard({ title, value }) {
	return (
		<div className="flex flex-col bg-gray-100 py-2 px-4 rounded-lg gap-1">
			<h1 className="text-sm text-slate-400">{title}</h1>
			<h1 className="">{S(value).capitalize().value()}</h1>
		</div>
	);
}
