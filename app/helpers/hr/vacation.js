import prisma from "@/prisma/index";
import exportFromJSON from "export-from-json";
import moment from "moment";

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

// load employees Vacation Requests count
export const loadEmployeesVacationRequestsCount = async (
	departments,
	positions,
	from,
	to,
	employeeId,
	approvalStatuses,
	vacationTypes
) => {
	try {
		let departmentsIds = await getDepartmentsIds(departments);
		let positionsIds = await getPositionsIds(positions);

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

		let teamVacationRequestsCount = await prisma.vacationRequest.count({
			where: {
				employee: {
					departmentId:
						departmentsIds.length > 0 ? { in: departmentsIds } : undefined,
					positionId:
						positionsIds.length > 0 ? { in: positionsIds } : undefined,
					employeeId: employeeId?.toLowerCase().trim() || undefined,
				},
				approvalStatus:
					approvalStatuses.length > 0 ? { in: approvalStatuses } : undefined,
				reason: vacationTypes.length > 0 ? { in: vacationTypes } : undefined,

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
		});

		return teamVacationRequestsCount;
	} catch (error) {
		console.error(error);
	} finally {
		await prisma.$disconnect();
	}
};

// Load employees Vacation Requests
export const loadEmployeesVacationRequests = async (
	skip,
	take,
	departments,
	positions,
	from,
	to,
	employeeId,
	approvalStatuses,
	vacationTypes
) => {
	try {
		let departmentsIds = await getDepartmentsIds(departments);
		let positionsIds = await getPositionsIds(positions);

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
					positionId:
						positionsIds.length > 0 ? { in: positionsIds } : undefined,
					employeeId: employeeId?.toLowerCase().trim() || undefined,
				},
				approvalStatus:
					approvalStatuses.length > 0 ? { in: approvalStatuses } : undefined,
				reason: vacationTypes.length > 0 ? { in: vacationTypes } : undefined,

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

export const exportEmployeesVacationRequests = async (
	departments,
	positions,
	from,
	to,
	employeeId,
	approvalStatuses,
	vacationTypes
) => {
	try {
		let departmentsIds = await getDepartmentsIds(departments);
		let positionsIds = await getPositionsIds(positions);

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
					positionId:
						positionsIds.length > 0 ? { in: positionsIds } : undefined,
					employeeId: employeeId?.toLowerCase().trim() || undefined,
				},
				approvalStatus:
					approvalStatuses.length > 0 ? { in: approvalStatuses } : undefined,
				reason: vacationTypes.length > 0 ? { in: vacationTypes } : undefined,

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

const getPositionId = async (positionName) => {
	let position = await prisma.position.findFirst({
		where: { title: positionName },
	});

	return position.id;
};
const getPositionsIds = async (positions) => {
	const positionIds = await Promise.all(positions.map(getPositionId));
	return positionIds;
};

// export data to csv
export const exportToCsv = (data) => {
	let fileName = "VacationRequestsHistory";
	let exportType = exportFromJSON.types.csv;
	data = data.map((request) => {
		return {
			requestId: request.id,
			createdAt: moment(request.createdAt).format("MM/DD/yyy"),
			employeeId: request.employee.employeeId,
			employee: `${request.employee?.firstName} ${request.employee?.lastName}`,
			reason: request.reason.split("_").join(" "),
			from: moment(request.from).format("MM/DD/yyy"),
			to: moment(request.to).format("MM/DD/yyy"),
			status: request.approvalStatus,
			approvedByManager:
				request.approvalStatus === "pending"
					? ""
					: `${request.approvedByManager?.firstName} ${request.approvedByManager?.lastName}`,
		};
	});
	exportFromJSON({ data, fileName, exportType });
};
