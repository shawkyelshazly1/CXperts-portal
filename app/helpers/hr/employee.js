import prisma from "@/prisma/index";
import exportFromJSON from "export-from-json";

// find employees
export const searchEmployees = async (searchParams) => {
	try {
		let employees = await prisma.employee.findMany({
			where: {
				OR: [
					{ id: { equals: parseInt(searchParams.search) || 0 } },
					{ firstName: { contains: searchParams.search?.split(" ")[0] } },
					{
						lastName: {
							contains:
								searchParams.search?.split(" ")[1] || searchParams.search,
						},
					},
					{ middleName: { contains: searchParams.search } },
					{
						department: {
							name: { contains: searchParams.search?.split(" ").join("_") },
						},
					},
					{
						position: {
							title: { contains: searchParams.search?.split(" ").join("_") },
						},
					},
					{ nationality: { contains: searchParams.search } },
				],
				department:
					searchParams.department === undefined
						? {}
						: { name: { in: searchParams.department?.split(",") } },
				position:
					searchParams.position === undefined
						? {}
						: { title: { in: searchParams.position?.split(",") } },
			},
			include: {
				department: true,
				position: true,
				documents: true,
				manager: true,
				project: true,
			},
		});

		return employees;
	} catch (error) {
		console.error("Error searching for employees:", error);
	} finally {
		await prisma.$disconnect();
	}
};

// load filters values
export const loadFilters = async () => {
	try {
		let departments = await prisma.department.findMany({});
		let positions = await prisma.position.findMany({});

		return { departments, positions };
	} catch (error) {
		console.error("Error searching for employees:", error);
	} finally {
		await prisma.$disconnect();
	}
};

// export data to csv
export const exportEmployeeDetailsToCSV = (data, selectedFields) => {
	let fileName = "employeeData";
	let exportType = exportFromJSON.types.csv;

	data = ensureArray(data);

	data = data.map((employee) => {
		let employeeInfo = selectedFields["employeeInfo"].reduce(
			(result, fieldName) => {
				// if field is manager get his first and last name
				switch (fieldName) {
					case "manager":
						if (employee[fieldName]) {
							result[
								fieldName
							] = `${employee[fieldName].firstName} ${employee[fieldName].lastName}`;
						} else {
							result[fieldName] = "N/A";
						}

						break;
					case "position":
						result[fieldName] = employee[fieldName].title.split("_").join(" ");
						break;
					case "department":
						result[fieldName] = employee[fieldName].name.split("_").join(" ");
						break;
					case "project":
						result[fieldName] =
							employee[fieldName] === null
								? null
								: employee[fieldName].name.split("_").join(" ");
						break;
					default:
						result[fieldName] = employee[fieldName];
				}

				return result;
			},
			{}
		);

		let employeeDocuments = selectedFields["employeeDocuments"].reduce(
			(result, fieldName) => {
				// if field is manager get his first and last name
				result[fieldName] =
					employee["documents"][fieldName] === null
						? "Not Submitted"
						: "Submitted";

				return result;
			},
			{}
		);

		return { ...employeeInfo, ...employeeDocuments };
	});
	exportFromJSON({ data, fileName, exportType });
};

const ensureArray = (data) => {
	if (Array.isArray(data)) {
		return data; // Data is already an array, no change needed
	} else if (data !== null && data !== undefined) {
		return [data]; // Convert the single object into an array
	} else {
		return []; // Return an empty array for null or undefined
	}
};
