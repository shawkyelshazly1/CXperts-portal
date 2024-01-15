import DetailsCard from "@/components/profile/DetailsCard";
import { authOptions } from "@/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import Image from "next/image";
import React from "react";
import S from "underscore.string";
import prisma from "../../../prisma";
import EmployeeCard from "@/components/profile/Employee Card";
import SubordinateCard from "@/components/profile/SubordinateCard";
import DateDetailsCard from "@/components/hr/employees/DateDetailsCard";
export default async function Page() {
	const { user } = await getServerSession(authOptions);

	let subordinates = await prisma.employee.findUnique({
		where: { employeeId: user.employeeId },
		include: {
			subordinates: {
				select: {
					firstName: true,
					lastName: true,
					position: true,
					department: true,
					employeeId: true,
				},
			},
		},
	});

	subordinates = subordinates.subordinates;

	return (
		<div className="w-full h-full container grid grid-cols-1  xl:grid-cols-4 gap-8 md:gap-20  py-6 px-6">
			{" "}
			<div className="flex flex-col">
				{" "}
				<Image
					src={"/profile_image.png"}
					className="rounded-full border-[4px] border-[#fbb919]"
					width={250}
					height={250}
					alt="profile_image"
				/>
				<div className="flex flex-col gap-4 mt-12">
					<h1 className="font-medium text-xl text-slate-400">
						Employee Details
					</h1>
					<DetailsCard title={"First Name"} value={user.firstName} />
					<DetailsCard title={"Last Name"} value={user.lastName} />{" "}
					<DetailsCard title={"EmployeeId"} value={user.employeeId} />
					<DetailsCard title={"Email Address"} value={user.email} />
					{user.manager ? (
						<DetailsCard
							title={"Manager"}
							value={
								S(user.manager.firstName).capitalize().value() +
								" " +
								S(user.manager.lastName).capitalize().value()
							}
						/>
					) : (
						<></>
					)}
					<DetailsCard
						title={"Position"}
						value={user.position.title
							.split("_")
							.map((word) => S(word).capitalize().value())
							.join(" ")}
					/>
				</div>
			</div>
			<div className="flex flex-col gap-6">
				<div className="flex flex-col gap-4">
					<h1 className="font-medium text-xl text-slate-400">Department</h1>
					<DetailsCard
						title={"Department"}
						value={user.department.name
							.split("_")
							.map((word) => S(word).capitalize().value())
							.join(" ")}
					/>
					{user.project && (
						<DetailsCard
							title={"Project"}
							value={user.project?.name
								.split("_")
								.map((word) => S(word).capitalize().value())
								.join(" ")}
						/>
					)}
				</div>
				<div className="flex flex-col gap-4">
					<h1 className="font-medium text-xl text-slate-400">
						Employee Information
					</h1>
					<DateDetailsCard title={"Date Of Birth"} value={user.dateOfBirth} />
					<DateDetailsCard title={"Hiring Date"} value={user.hiringDate} />
					<DetailsCard
						title={"Phone Number"}
						value={user.phoneNumber
							?.split("_")
							.map((word) => S(word).capitalize().value())
							.join(" ")}
					/>
					<DetailsCard
						title={"Nationality"}
						value={user.nationality
							?.split("_")
							.map((word) => S(word).capitalize().value())
							.join(" ")}
					/>
					<DetailsCard
						title={"National ID"}
						value={user.nationalId
							?.split("_")
							.map((word) => S(word).capitalize().value())
							.join(" ")}
					/>
				</div>
			</div>
			<div className="flex flex-col col-span-1 xl:col-span-2 gap-4">
				<h1 className="font-medium text-xl text-slate-400">Team</h1>
				<div className="grid grid-cols-2 gap-4 ">
					{subordinates.length > 0 ? (
						<>
							{subordinates?.map((subordinate) => (
								<SubordinateCard
									employee={subordinate}
									key={subordinate.employeeId}
								/>
							))}
						</>
					) : (
						<></>
					)}
				</div>
			</div>
		</div>
	);
}
