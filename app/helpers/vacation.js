import exportFromJSON from "export-from-json";
import prisma from "../../prisma";
import moment from "moment";

// load user vacation balance
export const loadUserVacationBalance = async (userId, vacationBalance) => {
	let currentYear = new Date().getFullYear();
	try {
		let usedBalance = await prisma.vacationRequest.findMany({
			where: {
				employeeId: parseInt(userId),
				approvalStatus: "approved",
				from: { gte: new Date(currentYear, 0, 1) },
				to: { lte: new Date(currentYear, 11, 31) },
			},
			select: {
				reason: true,
				from: true,
				to: true,
			},
		});

		// Calculate the total days for each reason
		const daysByReason = usedBalance.reduce((result, request) => {
			const reason = request.reason;
			const days = Math.ceil(
				(request.to - request.from + 1) / (1000 * 60 * 60 * 24)
			); // Calculate the number of days
			result[reason] = (result[reason] || 0) + days;
			return result;
		}, {});

		return daysByReason;
	} catch (error) {
		console.error(error);
	} finally {
		await prisma.$disconnect();
	}
};

// submit vacation request
export const submitVacationRequest = async (vacationData, userId) => {
	try {
		let days = parseInt(
			moment(vacationData.to).diff(moment(vacationData.from), "days") + 1
		);

		let employee = await prisma.employee.findUnique({
			where: {
				id: userId,
			},
			select: {
				vacationBalance: true,
			},
		});

		if (vacationData.reason !== "casual") {
			if (vacationData.reason === "annual" && employee.vacationBalance < days) {
				throw new Error("Insufficient Balance!");
			}
		} else {
			let currentYear = new Date().getFullYear();
			let usedBalance = await prisma.vacationRequest.findMany({
				where: {
					employeeId: parseInt(userId),
					approvalStatus: "approved",
					from: { gte: new Date(currentYear, 0, 1) },
					to: { lte: new Date(currentYear, 11, 31) },
				},
				select: {
					reason: true,
					from: true,
					to: true,
				},
			});

			// Calculate the total days for each reason
			const daysByReason = usedBalance.reduce((result, request) => {
				const reason = request.reason;
				const days = Math.ceil(
					(request.to - request.from + 1) / (1000 * 60 * 60 * 24)
				); // Calculate the number of days
				result[reason] = (result[reason] || 0) + days;
				return result;
			}, {});

			

			if (
				6 - parseInt(daysByReason["casual"]) < days ||
				6 - parseInt(daysByReason["casual"]) <= 0
			) {
				throw new Error("Insufficient Casual Balance!");
			} else if (isNaN(parseInt(daysByReason["casual"])) && days > 6) {
				throw new Error("Insufficient Casual Balance!");
			}
		}

		let vacationRequest = await prisma.vacationRequest.create({
			data: {
				...vacationData,
				employeeId: userId,
				approvalStatus:
					vacationData.reason === "casual" ? "approved" : "pending",
			},
		});

		// update user balance
		if (["casual"].includes(vacationData.reason)) {
			let result = await updateEmployeeVacationBalance(userId, days);

			if (!result) {
				throw new Error("Something went wrong!");
			}
		}

		return vacationRequest;
	} catch (error) {
		console.error(error);
		return { error: error.message };
	} finally {
		await prisma.$disconnect();
	}
};

// Load user vacation requests history
export const loadVacationRequests = async (userId, skip, take) => {
	try {
		let vacationRequests = await prisma.vacationRequest.findMany({
			where: { employeeId: userId },
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
				approvalStatus: true,
				approvedByManager: {
					select: {
						id: true,
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

// load all user requests
export const loadAllUserRequests = async (userId) => {
	try {
		let vacationRequests = await prisma.vacationRequest.findMany({
			where: { employeeId: userId },
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
				approvalStatus: true,
				approvedByManager: {
					select: {
						id: true,
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
// Load user vacation requests history
export const loadVacationRequestsCount = async (userId) => {
	try {
		let vacationRequestsCount = await prisma.vacationRequest.count({
			where: { employeeId: userId },
		});

		return vacationRequestsCount;
	} catch (error) {
		console.error(error);
	} finally {
		await prisma.$disconnect();
	}
};

// Load manager pending team requests
export const loadTeamRequestsCount = async (userId) => {
	try {
		let teamVacationRequestsCount = await prisma.vacationRequest.count({
			where: {
				approvalStatus: "pending",
				reason: "annual",
				employee: {
					managerId: parseInt(userId),
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
export const loadTeamVacationRequests = async (userId, skip, take) => {
	try {
		let vacationRequests = await prisma.vacationRequest.findMany({
			where: {
				approvalStatus: "pending",
				reason: "annual",
				employee: {
					managerId: parseInt(userId),
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

// update request status as manager
export const updateRequestStatus = async (data, managerId) => {
	try {
		let request = await prisma.vacationRequest.findUnique({
			where: { id: parseInt(data.requestId) },
			select: {
				employee: {
					select: {
						managerId: true,
						id: true,
					},
				},
			},
		});

		if (parseInt(request.employee.managerId) !== parseInt(managerId)) {
			return null;
		}

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

// export data to csv
export const exportToCsv = (data) => {
	let fileName = "VacationRequestsHistory";
	let exportType = exportFromJSON.types.csv;
	data = data.map((request) => {
		return {
			...request,
			createdAt: moment(request.createdAt).format("MM/DD/yyy"),
			from: moment(request.from).format("MM/DD/yyy"),
			to: moment(request.to).format("MM/DD/yyy"),
			employee: `${request.employee?.firstName} ${request.employee?.lastName}`,
			approvedByManager:
				request.approvalStatus === "pending"
					? ""
					: `${request.approvedByManager?.firstName} ${request.approvedByManager?.lastName}`,
		};
	});
	exportFromJSON({ data, fileName, exportType });
};
