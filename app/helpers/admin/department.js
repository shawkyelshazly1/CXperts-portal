import prisma from "@/prisma/index";

// create new department
export const createDepartment = async (departmentData) => {
	try {
		let departmentName = departmentData.name
			.split(" ")
			.map((word) => word.toLowerCase())
			.join("_");

		let existingDepartment = await prisma.department.findFirst({
			where: {
				name: departmentName,
			},
		});

		if (existingDepartment) {
			return { error: "Department Exists Already" };
		}

		let newDepartment = await prisma.department.create({
			data: {
				...departmentData,
				name: departmentName,
				parentId: departmentData.parentId || null,
			},
		});

		return newDepartment;
	} catch (error) {
		console.error(error);
		return { error: "Something went wrong!" };
	} finally {
		await prisma.$disconnect();
	}
};

// load departments count for table pagination
export const getDepartmentsCount = async () => {
	try {
		let departmentsCount = await prisma.department.count({});

		return departmentsCount;
	} catch (error) {
		console.error(error);
	} finally {
		await prisma.$disconnect();
	}
};

// load departments for table
export const loadDepartments = async (skip, take) => {
	try {
		let departments = await prisma.department.findMany({
			select: {
				id: true,
				name: true,
				description: true,
				parentDept: {
					select: {
						id: true,
						name: true,
					},
				},
			},
			skip,
			take,
		});
		return departments;
	} catch (error) {
		console.error(error);
	} finally {
		await prisma.$disconnect();
	}
};
