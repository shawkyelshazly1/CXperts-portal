import prisma from "@/prisma/index";

import { actionsFlow } from "@/util/disciplinaryActionsFlow.json";
import moment from "moment";

import _ from "lodash";
// get next action applicable
export const getNextApplicableAction = async (
	actionCategory,
	employeeId,
	incidentDate
) => {
	try {
		let lastAction = await prisma.disciplinaryActions.findFirst({
			where: {
				actionCategory: actionCategory,
				actionedEmployeeId: employeeId,
			},
			orderBy: {
				submissionDate: "desc",
			},
		});

		if (!lastAction) {
			// Refactor the code to pull the first action from the disciplinary actions flow
			const actionFlowEntry = _.find(actionsFlow, {
				actionCategory: actionCategory,
			});
			if (
				actionFlowEntry &&
				actionFlowEntry.actionsSuquence &&
				actionFlowEntry.actionsSuquence.length > 0
			) {
				return actionFlowEntry.actionsSuquence[0];
			} else {
				throw new Error(
					`No actions sequence found for the action category: ${actionCategory}`
				);
			}
		} else {
			const currentDate = moment(incidentDate);
			const lastActionDate = moment(lastAction.incidentDate);
			const differenceInDays = currentDate.diff(lastActionDate, "days");

			const actionFlowEntry = _.find(actionsFlow, {
				actionCategory: actionCategory,
			});

			if (!actionFlowEntry) {
				throw new Error(
					`No action flow entry found for the action category: ${actionCategory}`
				);
			}

			const resetDuration =
				actionFlowEntry.resetDuration !== ""
					? parseInt(actionFlowEntry.resetDuration, 10)
					: Infinity;

			if (differenceInDays > resetDuration) {
				return actionFlowEntry.actionsSuquence[0];
			} else {
				const lastActionIndex = actionFlowEntry.actionsSuquence.indexOf(
					lastAction.actionType
				);
				// Check if last action approvalStatus is rejected then get same action again else get the next action in the sequence
				if (lastAction.approvalStatus === "rejected") {
					return actionFlowEntry.actionsSuquence[lastActionIndex];
				}

				const nextActionIndex = lastActionIndex + 1;

				if (nextActionIndex >= actionFlowEntry.actionsSuquence.length) {
					throw new Error("No further actions available in the sequence.");
				}

				return actionFlowEntry.actionsSuquence[nextActionIndex];
			}
		}
	} catch (error) {
		console.error(error);
		return { error: error.message };
	} finally {
		await prisma.$disconnect();
	}
};

// check if previous action in actionCategory is pending approval and within the resetDuration
export const isPreviousActionPendingApproval = async (
	actionCategory,
	employeeId,
	incidentDate
) => {
	try {
		let lastAction = await prisma.disciplinaryActions.findFirst({
			where: {
				actionCategory: actionCategory,
				actionedEmployeeId: employeeId,
			},
			orderBy: {
				submissionDate: "desc",
			},
		});

		if (!lastAction) {
			return false;
		}

		const currentDate = moment(incidentDate);
		const lastActionDate = moment(lastAction.incidentDate);
		const differenceInDays = currentDate.diff(lastActionDate, "days");

		const actionFlowEntry = actionsFlow.find(
			(entry) => entry.actionCategory === actionCategory
		);

		if (!actionFlowEntry) {
			throw new Error(
				`No action flow entry found for the action category: ${actionCategory}`
			);
		}

		const resetDuration =
			actionFlowEntry.resetDuration !== ""
				? parseInt(actionFlowEntry.resetDuration, 10)
				: Infinity;

		if (differenceInDays > resetDuration) {
			return false;
		}

		if (!lastAction.requiresApproval) {
			return false;
		} else if (lastAction.approverId) {
			return false;
		} else {
			return true;
		}
	} catch (error) {
		console.error(error);
		return { error: error.message };
	} finally {
		await prisma.$disconnect();
	}
};

// apply action
export const applyAction = async (
	employeeId,
	incidentDate,
	actionCategory,
	submittorId
) => {
	try {
		const actionType = await getNextApplicableAction(
			actionCategory,
			employeeId,
			incidentDate
		);

		const isPending = await isPreviousActionPendingApproval(
			actionCategory,
			employeeId,
			incidentDate
		);

		if (isPending) {
			throw new Error("There is a previous action still pending approval.");
		}

		const action = await prisma.disciplinaryActions.create({
			data: {
				actionCategory: actionCategory,
				actionType: actionType,
				actionedEmployeeId: employeeId,
				incidentDate: new Date(incidentDate),
				submittorId: submittorId,
				requiresApproval: [
					"1 Day",
					"2 Days",
					"3 Days",
					"HR Investigation",
					"Termintaion",
				].includes(actionType),
			},
		});

		return action;
	} catch (error) {
		console.error(error);
		return { error: error.message };
	} finally {
		await prisma.$disconnect();
	}
};

// approve action  if "1 Day" then title must be supervisor greater must be operations manager, if HR Investigation or Termination must be from department human_resources
export const approveAction = async (actionId, approverId) => {
	try {
		const action = await prisma.disciplinaryActions.findUnique({
			where: {
				id: parseInt(actionId),
			},
		});

		if (!action) {
			throw new Error("Action not found");
		}

		if (action.approverId) {
			throw new Error("Action already approved");
		}

		const employee = await prisma.employee.findUnique({
			where: { employeeId: approverId },
			include: {
				position: {
					select: {
						title: true,
					},
				},
				department: {
					select: {
						name: true,
					},
				},
			},
		});

		if (!employee) {
			throw new Error("Employee not found");
		}

		if (
			["HR Investigation", "Termintaion"].includes(action.actionType) &&
			employee.department.name !== "human_resources"
		) {
			throw new Error(`Only HR can approve ${action.actionType}`);
		} else if (
			action.actionType === "1 Day" &&
			employee.position.title !== "supervisor" &&
			employee.position.title !== "operations_manager"
		) {
			throw new Error(
				`Only supervisor or operations manager can approve 1 Day action`
			);
		} else if (
			["2 Days", "3 Days"].includes(action.actionType) &&
			employee.position.title !== "operations_manager"
		) {
			throw new Error(
				`Only operations manager can approve 2 Days or 3 Days action`
			);
		} else {
			const action = await prisma.disciplinaryActions.update({
				where: {
					id: parseInt(actionId),
				},
				data: {
					approverId: approverId,
					approvedOn: new Date(),
					approvalStatus: "approved",
				},
			});
			return action;
		}
	} catch (error) {
		console.error(error);
		return { error: error.message };
	} finally {
		await prisma.$disconnect();
	}
};

// reject action  if "1 Day" then title must be supervisor greater must be operations manager, if HR Investigation or Termination must be from department human_resources
export const rejectAction = async (actionId, approverId) => {
	try {
		const action = await prisma.disciplinaryActions.findUnique({
			where: {
				id: parseInt(actionId),
			},
		});

		if (!action) {
			throw new Error("Action not found");
		}

		if (action.approverId) {
			throw new Error("Action already approved/rejected");
		}

		const employee = await prisma.employee.findUnique({
			where: { employeeId: approverId },
			include: {
				position: {
					select: {
						title: true,
					},
				},
				department: {
					select: {
						name: true,
					},
				},
			},
		});

		if (!employee) {
			throw new Error("Employee not found");
		}

		if (
			["HR Investigation", "Termintaion"].includes(action.actionType) &&
			employee.department.name !== "human_resources"
		) {
			throw new Error(`Only HR can reject ${action.actionType}`);
		} else if (
			action.actionType === "1 Day" &&
			employee.position.title !== "supervisor" &&
			employee.position.title !== "operations_manager"
		) {
			throw new Error(
				`Only supervisor or operations manager can reject 1 Day action`
			);
		} else if (
			["2 Days", "3 Days"].includes(action.actionType) &&
			employee.position.title !== "operations_manager"
		) {
			throw new Error(
				`Only operations manager can reject 2 Days or 3 Days action`
			);
		} else {
			const action = await prisma.disciplinaryActions.update({
				where: {
					id: parseInt(actionId),
				},
				data: {
					approverId: approverId,
					approvedOn: new Date(),
					approvalStatus: "rejected",
				},
			});
			return action;
		}
	} catch (error) {
		console.error(error);
		return { error: error.message };
	} finally {
		await prisma.$disconnect();
	}
};

// load employee actions based on employeeId sorted by incidentDate and categorized by actionCategory
export const getEmployeeActions = async (employeeId) => {
	try {
		const actions = await prisma.disciplinaryActions.findMany({
			where: {
				actionedEmployeeId: employeeId,
			},
			orderBy: {
				incidentDate: "desc",
			},
			include: {
				actionCategory: true,
			},
		});

		return actions.reduce((acc, action) => {
			const category = action.actionCategory;
			if (!acc[category]) {
				acc[category] = { count: 0, actions: [] };
			}
			acc[category].count++;
			acc[category].actions.push(action);
			return acc;
		}, {});
	} catch (error) {
		console.error(error);
		return { error: error.message };
	} finally {
		await prisma.$disconnect();
	}
};

// get pending approval actions for supervisor within project or all if project ""
export const getSupervisorPendingActions = async (employeeId) => {
	try {
		let employee = await prisma.employee.findFirst({
			where: {
				employeeId: employeeId,
			},
			select: {
				position: {
					select: {
						title: true,
					},
				},
				project: {
					select: {
						name: true,
						id: true,
					},
				},
			},
		});

		if (employee.position.title !== "supervisor") {
			throw new Error("available only for supervisors");
		}

		let project = employee.project ? employee.project.id : "";

		let actions = await prisma.disciplinaryActions.findMany({
			where: {
				approvalStatus: { notIn: ["approved", "rejected"] },
				actionedEmployee: {
					projectId: project ? project : undefined,
				},
				actionType: "1 Day",
			},
			orderBy: {
				incidentDate: "desc",
			},
			include: {
				actionCategory: true,
				actionedEmployee: {
					include: {
						project: true,
					},
				},
			},
		});

		return actions;
	} catch (error) {
		console.error(error);
		return { error: error.message };
	} finally {
		await prisma.$disconnect();
	}
};

// get pending approval actions for operations manager within project or all if project ""
export const getOperationsManagerPendingActions = async (employeeId) => {
	try {
		let employee = await prisma.employee.findFirst({
			where: {
				employeeId: employeeId,
			},
			select: {
				position: {
					select: {
						title: true,
					},
				},
				project: {
					select: {
						name: true,
						id: true,
					},
				},
			},
		});

		if (employee.position.title !== "operations_manager") {
			throw new Error("available only for operations manager");
		}

		let project = employee.project ? employee.project.id : "";

		let actions = await prisma.disciplinaryActions.findMany({
			where: {
				approvalStatus: { notIn: ["approved", "rejected"] },
				actionedEmployee: {
					projectId: project ? project : undefined,
				},
				actionType: { in: ["2 Days", "3 Days"] },
			},
			orderBy: {
				incidentDate: "desc",
			},
			include: {
				actionCategory: true,
				actionedEmployee: {
					include: {
						project: true,
					},
				},
			},
		});

		return actions;
	} catch (error) {
		console.error(error);
		return { error: error.message };
	} finally {
		await prisma.$disconnect();
	}
};

// get pending approval actions for HR
export const getHrPendingActions = async (employeeId) => {
	try {
		let employee = await prisma.employee.findFirst({
			where: {
				employeeId: employeeId,
			},
			select: {
				position: {
					select: {
						title: true,
					},
				},
				project: {
					select: {
						name: true,
						id: true,
					},
				},
			},
		});

		if (employee.department.name !== "human_resources") {
			throw new Error("available only for HR department");
		}

		let actions = await prisma.disciplinaryActions.findMany({
			where: {
				approvalStatus: { notIn: ["approved", "rejected"] },
				actionType: { in: ["HR Investigation", "Termination"] },
			},
			orderBy: {
				incidentDate: "desc",
			},
			include: {
				actionCategory: true,
			},
		});

		return actions;
	} catch (error) {
		console.error(error);
		return { error: error.message };
	} finally {
		await prisma.$disconnect();
	}
};

// load all actions with all feilds filtered by date from and to passed in params or all if not passed based on submissionDate
export const loadActions = async (from, to) => {
	try {
		let actions = await prisma.disciplinaryActions.findMany({
			where: {
				submissionDate: {
					gte: from ? new Date(from) : undefined,
					lte: to ? new Date(to) : undefined,
				},
			},
			include: {
				actionCategory: true,
				actionedEmployee: {
					include: {
						project: true,
					},
				},
			},
		});

		return actions;
	} catch (error) {
		console.error(error);
		return { error: error.message };
	} finally {
		await prisma.$disconnect();
	}
};
