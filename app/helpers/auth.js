import prisma from "../../prisma";
import bcryptjs from "bcryptjs";

export const loginUser = async (username, password) => {
	try {
		let loginDetails = await prisma.loginDetails.findUnique({
			where: { username: username.toLowerCase() },
		});

		// if no user found or password didn't match
		if (
			!loginDetails ||
			!(await bcryptjs.compare(password, loginDetails.password))
		) {
			return { error: "Invalid username or password!" };
		}

		// return employee details
		let employee = await prisma.employee.findUnique({
			where: { id: loginDetails.employeeId },
			include: {
				manager: true,
				department: true,
				position: true,
				LoginDetails: {
					select: {
						reset_required: true,
					},
				},
			},
		});

		// return error if no employee found
		if (!employee) {
			return null;
		} else if (employee.accountStatus === "disabled") {
			return { error: "Account Disabled!" };
		}

		return employee;
	} catch (error) {
		return { error };
	} finally {
		await prisma.$disconnect();
	}
};
