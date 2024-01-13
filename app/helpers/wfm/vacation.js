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
				parentId: parseInt(operations?.id),
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

		let teamVacationRequestsCount = await prisma.vacationRequest.findMany({
			where: {
				approvalStatus: "pending",
				reason: { in: ["annual"] },
				employee: {
					departmentId:
						projectsIds.length > 0 ? { in: projectsIds } : undefined,
					position: {
						title: "representative",
					},
				},
			},
			select: {
				employee: {
					select: {
						position: {
							select: {
								title: true,
							},
						},
					},
				},
			},
		});

		return teamVacationRequestsCount.length;
	} catch (error) {
		console.error(error);
	} finally {
		await prisma.$disconnect();
	}
};

// Load project agents pending Team requests
export const loadProjectVacationRequests = async (skip, take, projects) => {
	try {
		let projectsIds = await getProjectsIds(projects);

		let vacationRequests = await prisma.vacationRequest.findMany({
			where: {
				approvalStatus: "pending",
				reason: { in: ["annual"] },
				employee: {
					departmentId:
						projectsIds.length > 0 ? { in: projectsIds } : undefined,
					position: {
						title: "representative",
					},
				},
			},
			select: {
				id: true,
				createdAt: true,
				employee: {
					select: {
						employeeId: true,
						firstName: true,
						lastName: true,
						position: {
							select: {
								title: true,
							},
						},
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
		if (user?.department.name !== "workforce_management") {
			throw new Error("Unauthorized");
		}

		let request = await prisma.vacationRequest.findUnique({
			where: { id: parseInt(data.requestId) },
			select: {
				employee: {
					select: {
						employeeId: true,
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
				approvedBy: user?.employeeId,
			},
		});

		if (!updatedRequest) {
			return null;
		}

		if (data.status === "approved" && request.reason === "annual") {
			// update employee Balance
			let result = await updateEmployeeVacationBalance(
				request.employee.employeeId,
				data.days
			);

			if (!result) {
				throw new Error("Something went wrong!");
			}
		}

		return updatedRequest;
	} catch (error) {
		console.error(error);
		return error;
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

// load employees Vacation Requests count
export const loadAgentsVacationRequestsCount = async (
	departments,
	from,
	to,
	employeeId,
	approvalStatuses
) => {
	try {
		let departmentsIds = await getDepartmentsIds(departments);

		let fromDate = from === undefined || from === "" ? undefined : from;
		let toDate = to === undefined || to === "" ? undefined : to;

		// Check if fromDate and toDate are valid dates
		if (fromDate) {
			const parsedFromDate = new Date(fromDate);
			if (!isNaN(parsedFromDate.getTime())) {
				fromDate = parsedFromDate;
			} else {
				fromDate = undefined;
			}
		}

		if (toDate) {
			const parsedToDate = new Date(toDate);
			if (!isNaN(parsedToDate.getTime())) {
				toDate = parsedToDate;
			} else {
				toDate = undefined;
			}
		}

		let teamVacationRequestsCount = await prisma.vacationRequest.findMany({
			where: {
				employee: {
					departmentId:
						departmentsIds.length > 0 ? { in: departmentsIds } : undefined,
					position: { title: "representative" },
					employeeId: employeeId?.toLowerCase().trim() || undefined,
				},
				approvalStatus:
					approvalStatuses.length > 0 ? { in: approvalStatuses } : undefined,

				OR: [
					{
						from:
							toDate !== undefined
								? {
										lte: toDate,
								  }
								: {
										lte: new Date(3000, 1, 1),
								  },
						to:
							fromDate !== undefined
								? {
										gte: fromDate,
								  }
								: {
										gte: new Date(1900, 1, 1),
								  },
					},
					{
						from:
							fromDate !== undefined
								? {
										gte: fromDate,
								  }
								: {
										gte: new Date(1900, 1, 1),
								  },
						to:
							toDate !== undefined
								? { lte: toDate }
								: { lte: new Date(3000, 1, 1) },
					},
				],
			},
			select: {
				employee: {
					select: {
						position: {
							select: {
								title: true,
							},
						},
					},
				},
			},
		});

		return teamVacationRequestsCount.length;
	} catch (error) {
		console.error(error);
	} finally {
		await prisma.$disconnect();
	}
};

// Load employees Vacation Requests
export const loadAgentsVacationRequests = async (
	skip,
	take,
	departments,
	from,
	to,
	employeeId,
	approvalStatuses
) => {
	try {
		let departmentsIds = await getDepartmentsIds(departments);

		let fromDate = from === undefined || from === "" ? undefined : from;
		let toDate = to === undefined || to === "" ? undefined : to;

		// Check if fromDate and toDate are valid dates
		if (fromDate) {
			const parsedFromDate = new Date(fromDate);

			if (!isNaN(parsedFromDate.getTime())) {
				fromDate = parsedFromDate;
			} else {
				fromDate = undefined;
			}
		}

		if (toDate) {
			const parsedToDate = new Date(toDate);
			if (!isNaN(parsedToDate.getTime())) {
				toDate = parsedToDate;
			} else {
				toDate = undefined;
			}
		}

		let vacationRequests = await prisma.vacationRequest.findMany({
			where: {
				employee: {
					departmentId:
						departmentsIds.length > 0 ? { in: departmentsIds } : undefined,
					position: { title: "representative" },
					employeeId: employeeId?.toLowerCase().trim() || undefined,
				},
				approvalStatus:
					approvalStatuses.length > 0 ? { in: approvalStatuses } : undefined,

				OR: [
					{
						from:
							toDate !== undefined
								? {
										lte: toDate,
								  }
								: {
										lte: new Date(3000, 1, 1),
								  },
						to:
							fromDate !== undefined
								? {
										gte: fromDate,
								  }
								: {
										gte: new Date(1900, 1, 1),
								  },
					},
					{
						from:
							fromDate !== undefined
								? {
										gte: fromDate,
								  }
								: {
										gte: new Date(1900, 1, 1),
								  },
						to:
							toDate !== undefined
								? { lte: toDate }
								: { lte: new Date(3000, 1, 1) },
					},
				],
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
				approvalStatus: true,
				approvedByManager: {
					select: {
						employeeId: true,
						firstName: true,
						lastName: true,
					},
				},
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

// export vacation requests

export const exportAgentsVacationRequests = async (
	departments,
	from,
	to,
	employeeId,
	approvalStatuses
) => {
	try {
		let departmentsIds = await getDepartmentsIds(departments);

		let fromDate = from === undefined || from === "" ? undefined : from;
		let toDate = to === undefined || to === "" ? undefined : to;

		// Check if fromDate and toDate are valid dates
		if (fromDate) {
			const parsedFromDate = new Date(fromDate);

			if (!isNaN(parsedFromDate.getTime())) {
				fromDate = parsedFromDate;
			} else {
				fromDate = undefined;
			}
		}

		if (toDate) {
			const parsedToDate = new Date(toDate);
			if (!isNaN(parsedToDate.getTime())) {
				toDate = parsedToDate;
			} else {
				toDate = undefined;
			}
		}

		let vacationRequests = await prisma.vacationRequest.findMany({
			where: {
				employee: {
					departmentId:
						departmentsIds.length > 0 ? { in: departmentsIds } : undefined,
					position: { title: "representative" },
					employeeId: employeeId?.toLowerCase().trim() || undefined,
				},
				approvalStatus:
					approvalStatuses.length > 0 ? { in: approvalStatuses } : undefined,

				OR: [
					{
						from:
							toDate !== undefined
								? {
										lte: toDate,
								  }
								: {
										lte: new Date(3000, 1, 1),
								  },
						to:
							fromDate !== undefined
								? {
										gte: fromDate,
								  }
								: {
										gte: new Date(1900, 1, 1),
								  },
					},
					{
						from:
							fromDate !== undefined
								? {
										gte: fromDate,
								  }
								: {
										gte: new Date(1900, 1, 1),
								  },
						to:
							toDate !== undefined
								? { lte: toDate }
								: { lte: new Date(3000, 1, 1) },
					},
				],
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
				approvalStatus: true,
				approvedByManager: {
					select: {
						employeeId: true,
						firstName: true,
						lastName: true,
					},
				},
			},
			orderBy: {
				createdAt: "desc",
			},
		});

		return vacationRequests;
	} catch (error) {
		console.error(error);
	} finally {
		await prisma.$disconnect();
	}
};

const getDepartmentId = async (departmentName) => {
	let department = await prisma.department.findFirst({
		where: { name: departmentName },
	});

	return department.id;
};
const getDepartmentsIds = async (departments) => {
	const departmentIds = await Promise.all(departments.map(getDepartmentId));
	return departmentIds;
};
