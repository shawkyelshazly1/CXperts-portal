import prisma from "@/prisma/index";
import exportFromJSON from "export-from-json";
import moment from "moment";

// Load employees resignations
export const loadEmployeesResignations = async (
	skip,
	take,
	departments,
	positions,
	employeeId,
	resignationStatuses
) => {
	try {
		let departmentsIds = await getDepartmentsIds(departments);
		let positionsIds = await getPositionsIds(positions);

		let resignations = await prisma.resignation.findMany({
			where: {
				employee: {
					departmentId:
						departmentsIds.length > 0 ? { in: departmentsIds } : undefined,
					positionId:
						positionsIds.length > 0 ? { in: positionsIds } : undefined,
					employeeId: employeeId?.toLowerCase().trim() || undefined,
				},
				status:
					resignationStatuses.length > 0
						? { in: resignationStatuses }
						: undefined,
			},
			select: {
				id: true,
				employee: {
					select: {
						employeeId: true,
						firstName: true,
						lastName: true,
						department: {
							select: {
								name: true,
							},
						},
						position: {
							select: {
								title: true,
							},
						},
					},
				},
				submissionDate: true,
				lastWorkingDate: true,
				status: true,
				comment: true,
				resolution: true,
				hrAssigned: {
					select: {
						firstName: true,
						lastName: true,
					},
				},
				reason: true,
			},
			orderBy: {
				submissionDate: "asc",
			},
			skip,
			take,
		});

		return resignations;
	} catch (error) {
		console.error(error);
	} finally {
		await prisma.$disconnect();
	}
};

// load employees resignations count
export const loadEmployeesResignationsCount = async (
	departments,
	positions,
	employeeId,
	resignationStatuses
) => {
	try {
		let departmentsIds = await getDepartmentsIds(departments);
		let positionsIds = await getPositionsIds(positions);

		let resignationsCount = await prisma.resignation.count({
			where: {
				employee: {
					departmentId:
						departmentsIds.length > 0 ? { in: departmentsIds } : undefined,
					positionId:
						positionsIds.length > 0 ? { in: positionsIds } : undefined,
					employeeId: employeeId?.toLowerCase().trim() || undefined,
				},
				status:
					resignationStatuses.length > 0
						? { in: resignationStatuses }
						: undefined,
			},
		});

		return resignationsCount;
	} catch (error) {
		console.error(error);
	} finally {
		await prisma.$disconnect();
	}
};

export const exportEmployeesResignations = async (
	departments,
	positions,
	employeeId,
	resignationStatuses
) => {
	try {
		let departmentsIds = await getDepartmentsIds(departments);
		let positionsIds = await getPositionsIds(positions);

		let resignations = await prisma.resignation.findMany({
			where: {
				employee: {
					departmentId:
						departmentsIds.length > 0 ? { in: departmentsIds } : undefined,
					positionId:
						positionsIds.length > 0 ? { in: positionsIds } : undefined,
					employeeId: employeeId?.toLowerCase().trim() || undefined,
				},
				status:
					resignationStatuses.length > 0
						? { in: resignationStatuses }
						: undefined,
			},
			select: {
				id: true,
				employee: {
					select: {
						employeeId: true,
						firstName: true,
						lastName: true,
						department: {
							select: {
								name: true,
							},
						},
						position: {
							select: {
								title: true,
							},
						},
					},
				},
				submissionDate: true,
				lastWorkingDate: true,
				status: true,
				comment: true,
				resolution: true,
				hrAssigned: {
					select: {
						firstName: true,
						lastName: true,
					},
				},
				reason: true,
			},
			orderBy: {
				submissionDate: "asc",
			},
		});

		return resignations;
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
	let fileName = "Resignations";
	let exportType = exportFromJSON.types.csv;
	data = data.map((resignation) => {
		return {
			resignationId: resignation.id,
			submissionDate: moment(resignation.submissionDate).format("MM/DD/yyy"),
			employeeId: resignation.employee.employeeId,
			employee: `${resignation.employee?.firstName} ${resignation.employee?.lastName}`,
			department: resignation.employee.department.name.split("_").join(" "),
			position: resignation.employee.position.title.split("_").join(" "),
			reason: resignation.reason.split("_").join(" "),
			lastWorkingDate: moment(resignation.lastWorkingDate).format("MM/DD/yyy"),
			comment: resignation.comment,
			status: resignation.status,
			hrAssigned: !resignation.hrAssigned
				? ""
				: `${resignation.hrAssigned?.firstName} ${resignation.hrAssigned?.lastName}`,
			resolution: resignation.resolution,
		};
	});
	exportFromJSON({ data, fileName, exportType });
};

// Load employees pending resignations
export const loadEmployeesPendingResignations = async (skip, take) => {
	try {
		let resignations = await prisma.resignation.findMany({
			where: {
				status: "pending",
			},
			select: {
				id: true,
				employee: {
					select: {
						employeeId: true,
						firstName: true,
						lastName: true,
						department: {
							select: {
								name: true,
							},
						},
						position: {
							select: {
								title: true,
							},
						},
					},
				},
				submissionDate: true,
				lastWorkingDate: true,
				status: true,
				comment: true,
				resolution: true,
				hrAssigned: {
					select: {
						firstName: true,
						lastName: true,
					},
				},
				reason: true,
			},
			orderBy: {
				submissionDate: "asc",
			},
			skip,
			take,
		});

		return resignations;
	} catch (error) {
		console.error(error);
	} finally {
		await prisma.$disconnect();
	}
};

// load employees pending resignations count
export const loadEmployeesPendingResignationsCount = async () => {
	try {
		let resignationsCount = await prisma.resignation.count({
			where: {
				status: "pending",
			},
		});

		return resignationsCount;
	} catch (error) {
		console.error(error);
	} finally {
		await prisma.$disconnect();
	}
};

// Load employees resignations
export const loadResignation = async (resignationId) => {
	try {
		let resignation = await prisma.resignation.findFirst({
			where: {
				id: parseInt(resignationId),
			},
			select: {
				id: true,
				employee: {
					select: {
						employeeId: true,
						firstName: true,
						lastName: true,
						department: {
							select: {
								name: true,
							},
						},
						position: {
							select: {
								title: true,
							},
						},
					},
				},
				submissionDate: true,
				lastWorkingDate: true,
				status: true,
				comment: true,
				resolution: true,
				hrAssigned: {
					select: {
						firstName: true,
						lastName: true,
					},
				},
				reason: true,
			},
		});

		return resignation;
	} catch (error) {
		console.error(error);
	} finally {
		await prisma.$disconnect();
	}
};

export const claimResignation = async (resignationId, hrId) => {
	try {
		const resignation = await prisma.resignation.findUnique({
			where: {
				id: parseInt(resignationId),
			},
		});

		if (!resignation) {
			throw new Error("Resignation not found!");
		}

		if (resignation.status !== "pending") {
			throw new Error("Resignation already assigned");
		}

		const claimedResignation = await prisma.resignation.update({
			where: {
				id: resignationId,
			},
			data: {
				hrAssignedId: hrId,
				status: "processing",
			},
		});

		console.log(claimedResignation);

		return claimedResignation;
	} catch (error) {
		console.error(error);
		return { error: error.message };
	}
};

// Load employees resignations
export const loadResignationFullDetails = async (resignationId) => {
	try {
		let resignation = await prisma.resignation.findFirst({
			where: {
				id: parseInt(resignationId),
			},
			select: {
				id: true,
				employee: {
					select: {
						employeeId: true,
						firstName: true,
						lastName: true,
						email: true,
						department: {
							select: {
								name: true,
							},
						},
						position: {
							select: {
								title: true,
							},
						},
						manager: {
							select: {
								firstName: true,
								lastName: true,
							},
						},
						hiringDate: true,
						accountStatus: true,
						phoneNumber: true,
						project: true,
					},
				},
				submissionDate: true,
				lastWorkingDate: true,
				status: true,
				comment: true,
				resolution: true,
				hrAssigned: {
					select: {
						firstName: true,
						lastName: true,
					},
				},
				reason: true,
			},
		});

		return resignation;
	} catch (error) {
		console.error(error);
	} finally {
		await prisma.$disconnect();
	}
};
