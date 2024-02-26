import prisma from "@/prisma/index";

import _ from "lodash";
import { object } from "yup";

// load employee information using employeeId and if not representative then return error
export const loadEmployee = async (employeeId) => {
	if (employeeId.length === 0) {
		return;
	}
	try {
		let employee = await prisma.employee.findFirst({
			where: { employeeId: employeeId.toLowerCase() },
			include: {
				position: {
					select: {
						title: true,
					},
				},
				project: {
					select: {
						name: true,
					},
				},
				manager: {
					select: {
						firstName: true,
						lastName: true,
					},
				},
			},
		});

		if (!employee) {
			throw new Error("Employee not found");
		}

		if (employee?.position?.title !== "representative") {
			throw new Error("Employee is not a representative");
		}

		return employee;
	} catch (error) {
		console.error(error);
		return { error: error.message };
	} finally {
		await prisma.$disconnect();
	}
};
