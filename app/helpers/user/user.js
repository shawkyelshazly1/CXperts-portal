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
