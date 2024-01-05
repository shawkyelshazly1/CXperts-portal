import prisma from "@/prisma/index";

// load filters values
export const loadFilters = async () => {
	try {
		let departments = await prisma.department.findMany({});
		let positions = await prisma.position.findMany({});

		return { departments, positions };
	} catch (error) {
		console.error("Error searching for employees:", error);
	} finally {
		await prisma.$disconnect();
	}
};

// load vacation requests
export const loadHRVacationRequests = async (searchParams) => {
	try {
		if (Object.values(searchParams).every((value) => value === "")) {
			return;
		}

		let vacationRequests = await prisma.vacationRequest.findMany({
			where: {
				AND: [
					{
						from:
							searchParams.from === undefined || searchParams.from === ""
								? {}
								: {
										gte: new Date(searchParams?.from),
								  },
					},
					{
						to:
							searchParams.to === undefined || searchParams.to === ""
								? {}
								: {
										lte: new Date(searchParams?.to),
								  },
					},
					{
						employee: {
							department:
								searchParams.department === undefined
									? {}
									: { name: { in: searchParams.department?.split(",") } },
						},
					},
					{
						employee: {
							position:
								searchParams.position === undefined
									? {}
									: { title: { in: searchParams.position?.split(",") } },
						},
					},
				],
			},
		});

		return vacationRequests;
	} catch (error) {
		console.error("Error searching for employees:", error);
	} finally {
		await prisma.$disconnect();
	}
};
