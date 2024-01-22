import prisma from "@/prisma/index";

// load employee information using employeeId and if not representative then return error
export const loadEmployee = async (searchParams) => {
	try {
		if (searchParams?.employeeId === undefined) {
			return;
		}

		let employee = await prisma.employee.findUnique({
			where: { employeeId: searchParams?.employeeId?.toLowerCase() },
			include: {
				position: true,
				project: true,
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

		if (employee.position.title !== "representative") {
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
