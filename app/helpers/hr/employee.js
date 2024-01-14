import prisma from "@/prisma/index";
import exportFromJSON from "export-from-json";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "app/util/firebase";
import moment from "moment";

// find employees
export const searchEmployees = async (searchParams) => {
	try {
		let employees = await prisma.employee.findMany({
			where: {
				OR: [
					{ employeeId: { contains: searchParams.search || "" } },
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
						project: {
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
				subordinates: {
					select: {
						firstName: true,
						lastName: true,
						position: {
							select: {
								title: true,
							},
						},
						employeeId: true,
						department: {
							select: {
								name: true,
							},
						},
					},
				},
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
		let departments = await prisma.department.findMany({
			where: {
				parentId: null,
			},
		});
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
	let fileName = "employeesData";
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

export const updateEmployee = async (employeeId, employeeInfo, documents) => {
	try {
		// check if employee exists with same employeeId
		if (employeeInfo?.employeeId) {
			const existingEmployee = await prisma.employee.findUnique({
				where: { employeeId },
			});
			if (existingEmployee) {
				throw new Error("Employee already exists with same employeeId");
			}
		}

		// check if employee exists with same email
		if (employeeInfo?.email) {
			const existingEmployee = await prisma.employee.findUnique({
				where: { email: employeeInfo.email },
			});
			if (existingEmployee) {
				throw new Error("Employee already exists with same email");
			}
		}

		let uploads = {};

		// upload documents
		if (documents) {
			for (const document of documents) {
				await uploadEmployeeDocument(
					document.file,
					employeeId,
					document.documentName
				).then((result) => {
					if (result.error) {
						throw new Error(result.error);
					}

					let obj = {
						[document.documentName]: result,
					};

					uploads = {
						...uploads,
						...obj,
					};
				});
			}

			const updatedEmployee = await prisma.employee.update({
				where: { employeeId: employeeId },
				data: {
					...employeeInfo,
				},
			});

			const updateDocuments = await prisma.employeeDocuments.update({
				where: {
					employeeId: employeeId,
				},
				data: { ...uploads },
				select: {
					employeeId: true,
				},
			});

			return updatedEmployee;
		} else {
			const updatedEmployee = await prisma.employee.update({
				where: { employeeId: employeeId },
				data: {
					...employeeInfo,
				},
			});

			return updatedEmployee;
		}
	} catch (error) {
		console.error(error);
		return { error: error.message };
	}
};

export const uploadEmployeeDocument = async (
	file,
	employeeId,
	documentName
) => {
	return new Promise(async (resolve, reject) => {
		if (!file) {
			reject(new Error("No file provided"));
			return;
		}
		const imageName = `${documentName}-${employeeId}-${moment().format(
			"MM-DD-YYYY"
		)}-${Math.floor(Math.random() * 100)}`;
		const imageRef = ref(storage, `documents/${imageName}`);

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
