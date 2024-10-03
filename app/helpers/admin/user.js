import prisma from "../../../prisma";
import bcryptjs from "bcryptjs";
import passwordGenerator from "generate-password";
import exportFromJSON from "export-from-json";
import S from "underscore.string";
import { read, utils } from "xlsx";
import moment from "moment";

// load all users
export const loadUsers = async (skip, take) => {
	try {
		let users = await prisma.employee.findMany({
			select: {
				employeeId: true,
				firstName: true,
				lastName: true,
				email: true,
				position: true,
				accountStatus: true,
				department: {
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
			skip,
			take,
		});

		return users;
	} catch (error) {
		console.error(error);
	} finally {
		await prisma.$disconnect();
	}
};

// load usersCount for table pagination
export const getUsersCount = async () => {
	try {
		let usersCount = await prisma.employee.count({});

		return usersCount;
	} catch (error) {
		console.error(error);
	} finally {
		await prisma.$disconnect();
	}
};

// load user info
export const loadUser = async (userId) => {
	try {
		let user = await prisma.employee.findUnique({
			where: { employeeId: userId },
			select: {
				employeeId: true,
				firstName: true,
				lastName: true,
				email: true,
				position: true,
				manager: {
					select: {
						firstName: true,
						lastName: true,
					},
				},
				department: {
					select: {
						name: true,
					},
				},
			},
		});

		return user;
	} catch (error) {
		console.error(error);
	} finally {
		await prisma.$disconnect();
	}
};

// load Departments
export const loadDepartments = async () => {
	try {
		let departments = await prisma.department.findMany({
			
			select: {
				id: true,
				name: true,
			},
		});

		return departments;
	} catch (error) {
		console.error(error);
	} finally {
		await prisma.$disconnect();
	}
};

// load Departments
export const loadSubDepartment = async (deptId) => {
	try {
		let subDepartments = await prisma.department.findMany({
			where: { parentId: deptId },
			select: {
				id: true,
				name: true,
			},
		});

		return subDepartments;
	} catch (error) {
		console.error(error);
	} finally {
		await prisma.$disconnect();
	}
};

// load Departments
export const loadDepartmentPeople = async (departmentId, positionId) => {
	try {
		let people = await prisma.employee.findMany({
			where: {
				departmentId: departmentId,
			},
			select: {
				firstName: true,
				lastName: true,
				employeeId: true,
				position: {
					select: {
						level: true,
					},
				},
			},
		});

		let currentPosition = await prisma.position.findUnique({
			where: { id: positionId },
			select: {
				level: true,
			},
		});

		people = people.filter(
			(employee) =>
				parseInt(employee.position.level) < parseInt(currentPosition.level) //lower means higher ranking 1 < 2
		);

		let general_managers = await prisma.employee.findMany({
			where: {
				department: {
					name: "general_management",
				},
			},
			include: {
				department: true,
			},
		});

		return [...people, ...general_managers];
	} catch (error) {
		console.error(error);
	} finally {
		await prisma.$disconnect();
	}
};

// load positions
export const loadPositions = async (departmentId) => {
	try {
		let positions = await prisma.position.findMany({
			where: { departmentId: departmentId },
			select: {
				title: true,
				id: true,
				level: true,
			},
		});

		return positions;
	} catch (error) {
		console.error(error);
	} finally {
		await prisma.$disconnect();
	}
};

// create new user
export const createUser = async (userDetails) => {
	try {
		let newEmployee = await prisma.employee.create({
			data: {
				...userDetails,
				firstName: userDetails.firstName.toLowerCase().trim(),
				lastName: userDetails.lastName.toLowerCase().trim(),
				email: userDetails.email.toLowerCase().trim(),
				employeeId: userDetails.employeeId.trim().toLowerCase(),
				birthDate: Number.isInteger(userDetails.birthDate)
					? moment("1900-01-01").add(userDetails.birthDate, "days").toDate()
					: userDetails.birthDate,
			},
			select: {
				employeeId: true,
				firstName: true,
				lastName: true,
				email: true,
				position: true,
				department: {
					select: {
						name: true,
					},
				},
				manager: {
					select: {
						employeeId: true,
						firstName: true,
						lastName: true,
					},
				},
			},
		});

		// create employee documents
		let employeeDocuments = await prisma.employeeDocuments.create({
			data: {
				employeeId: newEmployee.employeeId,
			},
		});

		// // create employee loginDetails
		// let username = await generateUniqueUsername([
		// 	newEmployee.firstName,
		// 	newEmployee.lastName,
		// ]);

		// create employee loginDetails
		let username = userDetails.email.split("@")[0];

		let password = passwordGenerator.generate({
			length: 10,
			numbers: true,
		});

		let loginDetails = await prisma.loginDetails.create({
			data: {
				username: username,
				password: await bcryptjs.hash(password, 10),
				employeeId: newEmployee.employeeId,
			},
			select: {
				username: true,
			},
		});

		let employeeInfo = {
			...newEmployee,
			username,
			password,
		};

		return employeeInfo;
	} catch (error) {
		console.error(error);
		return { error: "Email or Employee ID exists already!" };
	} finally {
		await prisma.$disconnect();
	}
};

// generate username and check availability
export const generateUniqueUsername = async (names) => {
	let username = (
		names[0].substring(0, 1) +
		names[1] +
		"_" +
		String(Math.floor(Math.random() * 999))
	).toLowerCase();

	return await prisma.loginDetails
		.findUnique({
			where: { username: username },
		})
		.then((user) => {
			if (user) {
				return generateUniqueUsername(model, names);
			}

			return username;
		})
		.catch((error) => {
			console.error(error);
		});
};

// export data to csv
export const exportWFRToCsv = (data) => {
	let fileName = "WFR";
	let exportType = exportFromJSON.types.csv;
	data = ensureArray(data);
	data = data.map((request) => {
		return {
			id: request.employeeId,
			firstName: S(request.firstName).capitalize().value(),
			lastName: S(request.lastName).capitalize().value(),
			email: request.email,
			position: request.position.title
				.split("_")
				.map((value) => S(value).capitalize().value())
				.join(" "),
			department: request.department.name
				.split("_")
				.map((value) => S(value).capitalize().value())
				.join(" "),
			managerId: request.manager.employeeId,
			manager: `${S(request.manager.firstName).capitalize().value()}  ${S(
				request.manager.lastName
			)
				.capitalize()
				.value()}`,
			username: request.username,
			password: request.password,
		};
	});
	exportFromJSON({ data, fileName, exportType });
};

export const ensureArray = (data) => {
	if (Array.isArray(data)) {
		return data; // Data is already an array, no change needed
	} else if (data !== null && data !== undefined) {
		return [data]; // Convert the single object into an array
	} else {
		return []; // Return an empty array for null or undefined
	}
};

// download BulkFormat.xlsx
export const downloadBulkFormatSheet = () => {
	const fileUrl = "/BulkFormat.xlsx";

	let link = document.createElement("a");
	link.href = fileUrl;
	link.download = "BulkFormat.xlsx";
	link.click();
};

// validate bulk template columns
export const validateBulkTemplate = (file) => {
	const expectedColumns = [
		"employeeId",
		"email",
		"firstName",
		"lastName",
		"departmentId",
		"managerId",
		"positionId",
		"projectId",
		"birthDate",
		"middleName",
		"nationalId",
		"nationality",
		"phoneNumber",
	];

	return new Promise((resolve) => {
		if (!file) {
			resolve(false);
			return;
		}

		const reader = new FileReader();

		reader.onload = (e) => {
			let data = e.target.result;
			const workbook = read(data, { type: "binary" });
			const sheetName = workbook.SheetNames[0];
			const sheet = workbook.Sheets[sheetName];
			const dataRows = utils.sheet_to_json(sheet, { header: 1 });
			const fileColumns = Object.values(dataRows[0] || {});
			const validColumns = fileColumns.every((col) =>
				expectedColumns.includes(col)
			);
			if (validColumns) {
				const parsedData = dataRows.slice(1).map((row) => {
					const obj = {};
					fileColumns.forEach((column, index) => {
						obj[column] = row[index];
					});
					return obj;
				});
				resolve(parsedData);
			} else {
				resolve(validColumns);
			}
		};

		reader.readAsBinaryString(file);
	});
};

export const upsertBulkUsers = async (data) => {
	try {
		// create results object
		let results = {
			total: Object.values(data).length,
			successful: 0,
			failed: 0,
			errors: [],
			wfrs: [],
		};

		// loop through records on the sheet
		const promises = Object.values(data).map(async (employee, idx) => {
			let errors = [];
			try {
				// validate department
				let existingDepartment = await prisma.department.findUnique({
					where: {
						id: employee.departmentId,
					},
				});

				if (!existingDepartment) {
					errors.push("Wrong Department Id.");
				}

				// validate position
				let existingPosition = await prisma.position.findUnique({
					where: { id: employee.positionId },
				});

				if (!existingPosition) {
					errors.push("Wrong Position Id.");
				} else {
					// validate manager
					let existingManager = await prisma.employee.findUnique({
						where: {
							employeeId: employee.managerId,
						},
						select: {
							position: true,
							department: true,
						},
					});

					if (!existingManager) {
						errors.push("Wrong Manager Id.");
						// validate manager & employee department , allowed general_management as external department
					} else if (
						existingManager.department.id !== employee.departmentId &&
						existingManager.department.name !== "general_management"
					) {
						errors.push("Wrong Manager Depertment.");
						// validate position level for manager
					} else if (
						parseInt(existingPosition.level) <=
						parseInt(existingManager.position.level)
					) {
						errors.push("Wrong Manager Level Or Position Level Assigned.");
					}
				}

				// validate if employee exists already or matching data based on email
				let existingEmployee = await prisma.employee.findUnique({
					where: {
						email: employee.email,
					},
				});

				if (existingEmployee) {
					errors.push("Email exists already.");
				}

				// validate if employee exists already or matching data based on id
				let existingEmployeeId = await prisma.employee.findUnique({
					where: {
						employeeId: employee.employeeId,
					},
				});

				if (existingEmployeeId) {
					errors.push("EmployeeId exists already.");
				}

				if (
					employee?.birthDate === null ||
					employee?.birthDate === "" ||
					employee?.birthDate === undefined
				) {
					errors.push("Missing or Invalid Date Of birth.");
				}

				// check for errors
				if (errors.length > 0) {
					throw { value: { index: idx + 1, errors } };
				}

				// add employee
				let newEmployee = await createUser({
					...employee,
				});

				// update results with success employee
				results.successful = results.successful + 1;
				results.wfrs = [...results.wfrs, newEmployee];
			} catch (error) {
				// update results with failed employee
				results.failed = results.failed + 1;
				results.errors = [...results.errors, error.value];
			}
		});

		// Wait for all promises to resolve
		await Promise.all(promises);

		// return results
		return results;
	} catch (error) {
		console.error(error);
		return { error: "Something went wrong!" };
	} finally {
		await prisma.$disconnect();
	}
};

// reset user password
export const resetUserPassword = async (employeeId, password) => {
	try {
		let user = await prisma.employee.findFirst({
			where: { employeeId: employeeId },
		});

		if (!user) {
			throw new Error("User not found");
		}

		let loginDetails = await prisma.loginDetails.update({
			where: { employeeId: employeeId },
			data: { password: await bcryptjs.hash(password, 10) },
		});

		return loginDetails;
	} catch (error) {
		console.error(error);
		return { error: "Something went wrong!" };
	} finally {
		await prisma.$disconnect();
	}
};

export const disableEmployee = async (employeeId) => {
	try {
		let user = await prisma.employee.update({
			where: { employeeId: employeeId },
			data: { accountStatus: "disabled" },
		});

		if (!user) {
			throw new Error("User not found");
		}

		return user;
	} catch (error) {
		console.error(error);
		return { error: "Something went wrong!" };
	} finally {
		await prisma.$disconnect();
	}
};

export const activateEmployee = async (employeeId) => {
	try {
		let user = await prisma.employee.update({
			where: { employeeId: employeeId },
			data: { accountStatus: "active" },
		});

		if (!user) {
			throw new Error("User not found");
		}

		return user;
	} catch (error) {
		console.error(error);
		return { error: "Something went wrong!" };
	} finally {
		await prisma.$disconnect();
	}
};
