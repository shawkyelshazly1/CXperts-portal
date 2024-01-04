import prisma from "@/prisma/index";

// load filters
export const loadFilters = async () => {
	try {
		let departments = await prisma.department.findMany({});

		let operations = departments.filter(
			(department) => department.name === "operations"
		)[0];

		let projects = await prisma.department.findMany({
			where: {
				parentId: parseInt(operations.id),
			},
		});

		return { projects };
	} catch (error) {
		console.error("Error searching for projects", error);
	} finally {
		await prisma.$disconnect();
	}
};

export const loadProjectRequestsCount = async (projects) => {
	try {
		let projectsIds = await getProjectsIds(projects);

		let teamVacationRequestsCount = await prisma.vacationRequest.count({
			where: {
				approvalStatus: "pending",
				reason: { in: ["annual", "casual"] },
				employee: {
					departmentId:
						projectsIds.length > 0 ? { in: projectsIds } : undefined,
				},
			},
		});

		return teamVacationRequestsCount;
	} catch (error) {
		console.error(error);
	} finally {
		await prisma.$disconnect();
	}
};

// Load Manager pending Team requests
export const loadProjectVacationRequests = async (skip, take, projects) => {
	try {
		let projectsIds = await getProjectsIds(projects);

		let vacationRequests = await prisma.vacationRequest.findMany({
			where: {
				approvalStatus: "pending",
				reason: { in: ["annual", "casual"] },
				employee: {
					departmentId:
						projectsIds.length > 0 ? { in: projectsIds } : undefined,
				},
			},
			select: {
				id: true,
				createdAt: true,
				employee: {
					select: {
						id: true,
						firstName: true,
						lastName: true,
					},
				},
				reason: true,
				from: true,
				to: true,
			},
			orderBy: {
				createdAt: "desc",
			},
			skip,
			take,
		});

		return vacationRequests;
	} catch (error) {
		console.error(error);
	} finally {
		await prisma.$disconnect();
	}
};

const getProjectId = async (projectName) => {
	let project = await prisma.department.findFirst({
		where: { name: projectName },
	});

	return project.id;
};
const getProjectsIds = async (projects) => {
	const projectsIds = await Promise.all(projects.map(getProjectId));
	return projectsIds;
};

// update request status as manager
export const updateRequestStatus = async (data, user) => {
	try {
		if (user?.department.name !== "workforce") {
			return null;
		}

		let request = await prisma.vacationRequest.findUnique({
			where: { id: parseInt(data.requestId) },
			select: {
				employee: {
					select: {
						id: true,
					},
				},
			},
		});

		let updatedRequest = await prisma.vacationRequest.update({
			where: {
				id: data.requestId,
			},
			data: {
				approvalStatus: data.status,
				approvedBy: user?.id,
			},
		});

		if (!updatedRequest) {
			return null;
		}

		if (data.status === "approved") {
			// update employee Balance
			let result = await updateEmployeeVacationBalance(
				request.employee.id,
				data.days
			);

			if (!result) {
				throw new Error("Something went wrong!");
			}
		}

		return updatedRequest;
	} catch (error) {
		console.error(error);
	} finally {
		await prisma.$disconnect();
	}
};

// update employee Balance count by -1
const updateEmployeeVacationBalance = async (employeeId, days) => {
	let employee = await prisma.employee.findUnique({
		where: { id: parseInt(employeeId) },
		select: { vacationBalance: true },
	});

	if (!employee) {
		throw new Error("Something went wrong!");
	}

	let updatedVacationBalance = employee.vacationBalance - days;

	let updatedEmployee = await prisma.employee.update({
		where: { id: parseInt(employeeId) },
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
