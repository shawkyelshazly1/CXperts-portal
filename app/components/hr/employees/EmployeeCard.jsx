import Image from "next/image";
import S from "underscore.string";

export default function EmployeeCard({ employee, openModal }) {
	return (
		<div
			className="bg-gray-100 py-4 px-4 rounded-3xl flex flex-row gap-2 cursor-pointer"
			onClick={openModal}
		>
			<Image
				src={"/profile_image.png"}
				className="rounded-full border-[2px] border-[#fbb919]"
				width={75}
				height={60}
				alt="profile_image"
			/>
			<div className="flex flex-col justify-center">
				<h1 className="font-medium text-xl">
					{S(employee.firstName).capitalize().value() +
						" " +
						S(employee.lastName).capitalize().value()}
				</h1>
				<h1>{employee.id}</h1>
				<div className="flex flex-row gap-1">
					<h1>
						{employee.position.title
							.split("_")
							.map((word) => S(word).capitalize().value())
							.join(" ")}
					</h1>
					<h1>-</h1>
					<h1>
						{employee.department.name
							.split("_")
							.map((word) => S(word).capitalize().value())
							.join(" ")}
					</h1>
				</div>
			</div>
		</div>
	);
}
