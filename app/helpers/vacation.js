import exportFromJSON from "export-from-json";
import prisma from "../../prisma";
import moment from "moment";
import { saveFile } from "./util";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "app/util/firebase";
import { toString } from "lodash";

// load user vacation balance
export const loadUserVacationBalance = async (userId, vacationBalance) => {
	let currentYear = new Date().getFullYear();
	try {
		let usedBalance = await prisma.vacationRequest.findMany({
			where: {
				employeeId: userId,
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
				employeeId: userId,
			},
			select: {
				vacationBalance: true,
				position: true,
			},
		});

		if (employee.position.title === "representative") {
			const today = moment();

			const isBeforeFriday = today.isoWeekday() < 5;

			const weeksToAdd = isBeforeFriday ? 2 : 3;

			const nextApplicableMonday = today
				.clone()
				.add(weeksToAdd, "weeks")
				.startOf("isoWeek");

			if (moment(vacationData.from).isBefore(nextApplicableMonday)) {
				throw new Error("Invalid Dates");
			}
		}

		const today = moment();

		if (
			employee.position.title !== "representative" &&
			vacationData.reason === "annual"
		) {
			const variance = days;
			const from = moment(vacationData.from);

			if (variance >= 1 && variance <= 2 && from.diff(today, "days") < 2) {
				throw new Error(
					"Requested vacation must be submitted at least 2 days in advance."
				);
			} else if (
				variance >= 3 &&
				variance <= 5 &&
				from.diff(today, "days") < 7
			) {
				throw new Error(
					"requested vacation must be submitted at least 7 days in advance."
				);
			} else if (variance > 5 && from.diff(today, "days") < 14) {
				throw new Error(
					"Requested vacation must be submitted at least 14 days in advance."
				);
			}
		}

		if (vacationData.reason !== "casual") {
			if (
				vacationData.reason === "annual" &&
				employee.vacationBalance - 6 < days
			) {
				throw new Error("Insufficient Balance!");
			}
		} else {
			let currentYear = new Date().getFullYear();
			let usedBalance = await prisma.vacationRequest.findMany({
				where: {
					employeeId: userId,
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
			} else if (days > employee.vacationBalance) {
				throw new Error("Insufficient Balance!");
			}
		}

		if (vacationData.reason === "sick") {
			if (
				!vacationData.file ||
				vacationData.file === null ||
				vacationData.file === ""
			) {
				throw new Error("Please upload a sick note!");
			}

			let vacationRequest = await prisma.vacationRequest.create({
				data: {
					reason: vacationData.reason,
					from: vacationData.from,
					to: vacationData.to,
					employeeId: userId,
					approvalStatus: "pending",
					document: vacationData.file,
				},
			});
			return vacationRequest;
		} else {
			let vacationRequest = await prisma.vacationRequest.create({
				data: {
					reason: vacationData.reason,
					from: vacationData.from,
					to: vacationData.to,
					employeeId: userId,
					approvalStatus: "pending",
				},
			});
			return vacationRequest;
		}
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
				document: true,
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
		let teamVacationRequestsCount = await prisma.vacationRequest.findMany({
			where: {
				approvalStatus: "pending",
				reason: { not: "sick" },
				employee: {
					managerId: userId,
					position: {
						title: { not: "representative" },
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
						managerId: true,
					},
				},
				approvalStatus: true,
				reason: true,
			},
		});

		return teamVacationRequestsCount.length;
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
				reason: { not: "sick" },
				employee: {
					managerId: userId,
					position: {
						title: { not: "representative" },
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

// update request status as manager
export const updateRequestStatus = async (data, managerId) => {
	try {
		let request = await prisma.vacationRequest.findUnique({
			where: { id: parseInt(data.requestId) },
			select: {
				employee: {
					select: {
						managerId: true,
						employeeId: true,
					},
				},
				reason: true,
			},
		});

		if (request.employee.managerId !== managerId) {
			return null;
		}

		// validate employee balance for annual and casual
		if (
			(request.reason === "annual" || request.reason === "casual") &&
			data.status === "approved"
		) {
			let employee = await prisma.employee.findUnique({
				where: {
					employeeId: request.employee.employeeId,
				},
				select: {
					vacationBalance: true,
				},
			});

			if (employee.vacationBalance < data.days) {
				throw new Error("Insufficient Balance!");
			}
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

		if (
			data.status === "approved" &&
			["annual", "casual"].includes(request.reason)
		) {
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

export const uploadSickNotes = async (file, employeeId) => {
	return new Promise(async (resolve, reject) => {
		if (!file) {
			reject(new Error("No file provided"));
			return;
		}
		const imageName = `sicknote-${employeeId}-${moment().format(
			"MM-DD-YYYY"
		)}-${Math.floor(Math.random() * 100)}`;
		const imageRef = ref(storage, `sicknotes/${imageName}`);

		try {
			const snapshot = await uploadBytes(imageRef, file);
			const url = await getDownloadURL(snapshot.ref);
			if (url) {
				console.log(url);
				resolve(url);
			} else {
				reject(new Error("Failed to get download URL"));
			}
		} catch (error) {
			console.error("Error uploading or getting download URL:", error);
			reject(error);
		}
	});
};
