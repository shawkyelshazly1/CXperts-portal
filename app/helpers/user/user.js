import prisma from "../../../prisma";
import bcryptjs from "bcryptjs";

export const resetUserPassword = async (data) => {
	try {
		let existingUser = await prisma.loginDetails.findUnique({
			where: {
				employeeId: data.userId,
			},
		});

		if (!existingUser) {
			throw new Error("User not found!");
		}

		if (!(await bcryptjs.compare(data.old_password, existingUser.password))) {
			throw new Error("Wrong password!");
		}

		let passwordChanged = await prisma.loginDetails.update({
			where: {
				employeeId: data.userId,
			},
			data: {
				password: await bcryptjs.hash(data.new_password, 10),
			},
		});

		if (passwordChanged) {
			let loginDetails = await prisma.loginDetails.update({
				where: {
					employeeId: data.userId,
				},
				data: {
					reset_required: false,
				},
			});

			if (!loginDetails) {
				throw new Error("Something went wrong!");
			}

			return true;
		} else {
			throw new Error("Something went wrong!");
		}
	} catch (error) {
		console.error(error);
		return { error: error.message };
	} finally {
		await prisma.$disconnect();
	}
};

export const submitResignation = async (employeeId, data) => {
	try {
		let existingUser = await prisma.employee.findUnique({
			where: {
				employeeId: employeeId,
			},
		});

		if (!existingUser) {
			throw new Error("Employee not found!");
		}

		let resignation = await prisma.resignation.create({
			data: {
				employeeId: employeeId,
				lastWorkingDate: new Date(data.lastWorkingDate),
				reason: data.reason,
				comment: data.comment,
			},
		});

		return resignation;
	} catch (error) {
		console.error(error);
		return { error: error.message };
	}
};

export const getUserResignation = async (employeeId) => {
	try {
		let resignation = await prisma.resignation.findFirst({
			where: {
				employeeId: employeeId,
				status: { not: "recalled" },
			},
			select: {
				lastWorkingDate: true,
				reason: true,
				comment: true,
				status: true,
				submissionDate: true,
				id: true,
				employee: {
					select: {
						employeeId: true,
						position: {
							select: {
								title: true,
							},
						},
					},
				},
			},
		});

		return resignation;
	} catch (error) {
		console.error(error);
		return { error: error.message };
	}
};

export const recallResignation = async (resignationId, employeeId) => {
	try {
		let resignation = await prisma.resignation.update({
			where: {
				employeeId: employeeId,
				id: parseInt(resignationId),
			},
			data: {
				status: "recalled",
			},
		});

		return resignation;
	} catch (error) {
		console.error(error);
		return { error: error.message };
	}
};

export const updateResignationLastWorkingDate = async (
	resignationId,
	employeeId,
	updatedLastWorkingDate
) => {
	const user = await prisma.employee.findUnique({
		where: {
			employeeId: employeeId,
		},
		include: {
			position: true,
		},
	});

	if (!user) {
		throw new Error("User not found");
	}

	const positionTitle = user?.position?.title;
	const today = new Date();
	const requiredDaysAhead = positionTitle === "representative" ? 14 : 30;
	const requiredDate = new Date(today);
	requiredDate.setDate(today.getDate() + requiredDaysAhead);

	if (new Date(updatedLastWorkingDate) < requiredDate) {
		throw new Error(
			`Last working date must be at least ${requiredDaysAhead} days from today.`
		);
	}

	try {
		let updatedResignation = await prisma.resignation.update({
			where: {
				employeeId: employeeId,
				id: resignationId,
				reason: { notIn: ["recalled", "completed"] },
			},
			data: {
				lastWorkingDate: new Date(updatedLastWorkingDate),
			},
		});

		return updatedResignation;
	} catch (error) {
		console.error(error);
		return { error: error.message };
	}
};
