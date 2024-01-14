import Image from "next/image";
import React from "react";
import S from "underscore.string";

export default function SubordinateCard({ employee }) {
	return (
		<div className="flex flex-row bg-gray-100 py-2 px-4 rounded-lg gap-3">
			<Image
				src={"/profile_image.png"}
				className="rounded-full border-[2px] border-[#fbb919]"
				width={70}
				height={50}
				alt="profile_image"
			/>
			<div className="flex flex-col gap-0">
				<h1 className="font-semibold">
					{S(employee?.firstName).capitalize().value() +
						" " +
						S(employee?.lastName).capitalize().value()}
				</h1>
				<h1>{S(employee?.employeeId).capitalize().value()}</h1>
				<h1 className="text-gray-500">
					{employee?.position?.title
						.split("_")
						.map((word) => S(word).capitalize().value())
						.join(" ")}
				</h1>
			</div>
		</div>
	);
}
