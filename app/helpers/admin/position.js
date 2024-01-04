import prisma from "@/prisma/index";

// create new position
export const createPosition = async (positionData) => {
	try {
		let positionTitle = positionData.title
			.split(" ")
			.map((word) => word.toLowerCase())
			.join("_");

		let existingPosition = await prisma.position.findFirst({
			where: {
				title: positionTitle,
			},
		});

		if (existingPosition) {
			return { error: "Position Exists Already" };
		}

		let department = await prisma.department.findUnique({
			where: {
				id: parseInt(positionData.departmentId),
			},
		});

		if (!department) {
			return { error: "Invalid Department!" };
		}

		let newPosition = await prisma.position.create({
			data: {
				...positionData,
				title: positionTitle,
				level: parseInt(positionData.level),
			},
		});

		return newPosition;
	} catch (error) {
		console.error(error);
		return { error: "Something went wrong!" };
	} finally {
		await prisma.$disconnect();
	}
};

// load positions count
export const getPositionsCount = async () => {
	try {
		let positionsCount = await prisma.position.count({});

		return positionsCount;
	} catch (error) {
		console.error(error);
	} finally {
		await prisma.$disconnect();
	}
};

// load positions for table
export const loadPositions = async (skip, take) => {
	try {
		let positions = await prisma.position.findMany({
			select: {
				id: true,
				title: true,
				level: true,
				department: {
					select: {
						name: true,
					},
				},
			},
			skip,
			take,
		});
		return positions;
	} catch (error) {
		console.error(error);
	} finally {
		await prisma.$disconnect();
	}
};
