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

// Load Sick pending  requests
export const loadSickVacationRequests = async (skip, take) => {
	try {
		let sickVacationRequests = await prisma.vacationRequest.findMany({
			where: {
				approvalStatus: "pending",
				reason: "sick",
			},
			select: {
				id: true,
				createdAt: true,
				employee: {
					select: {
						employeeId: true,
						firstName: true,
						lastName: true,
					},
				},
				reason: true,
				from: true,
				to: true,
				document: true,
			},
			orderBy: {
				createdAt: "desc",
			},
			skip,
			take,
		});

		return sickVacationRequests;
	} catch (error) {
		console.error(error);
	} finally {
		await prisma.$disconnect();
	}
};

// Load sick pending  requests count
export const loadSickRequestsCount = async () => {
	try {
		let sickVacationRequestsCount = await prisma.vacationRequest.count({
			where: {
				approvalStatus: "pending",
				reason: "sick",
			},
		});

		return sickVacationRequestsCount;
	} catch (error) {
		console.error(error);
	} finally {
		await prisma.$disconnect();
	}
};

// update request status as HR
export const updateSickRequestStatus = async (data, managerId) => {
	try {
		let request = await prisma.vacationRequest.findUnique({
			where: { id: parseInt(data.requestId) },
			select: {
				employee: {
					select: {
						employeeId: true,
					},
				},
				reason: true,
			},
		});

		if (request.reason !== "sick") {
			return null;
		}

		// validate employee balance for annual and casual

		let updatedRequest = await prisma.vacationRequest.update({
			where: {
				id: data.requestId,
			},
			data: {
				approvalStatus: data.status,
				approvedBy: managerId,
			},
		});

		if (!updatedRequest) {
			return null;
		}

		return updatedRequest;
	} catch (error) {
		console.error(error);
		return { error: error.message };
	} finally {
		await prisma.$disconnect();
	}
};

// update employee Balance count by -1
const updateEmployeeVacationBalance = async (employeeId, days) => {
	let employee = await prisma.employee.findUnique({
		where: { employeeId: employeeId },
		select: { vacationBalance: true },
	});

	if (!employee) {
		throw new Error("Something went wrong!");
	}

	let updatedVacationBalance = employee.vacationBalance - days;

	let updatedEmployee = await prisma.employee.update({
		where: { employeeId: employeeId },
		data: {
			vacationBalance: updatedVacationBalance,
		},
	});

	if (updatedEmployee) {
		return true;
	} else {
		return false;
	}
};
