import nodemailer from "nodemailer";
import { render } from "@react-email/render";
import WelcomeEmail from "@/components/emails/WelcomeEmail";
import VacationRequestEmail from "@/components/emails/VacationRequestEmail";
import VacationRequiredApprovalEmail from "@/components/emails/VacationRequiredApprovalEmail";
import VacationRequestFeedbackEmail from "@/components/emails/VacationRequestFeedbackEmail";

// Send welcome email
export async function sendWelcomeEmail(username, password, email) {
	// Create a transport instance using nodemailer
	const transporter = nodemailer.createTransport({
		// Transport configuration (e.g., service, host, port, auth)
		host: "smtp.hostinger.com",
		secure: true,
		secureConnection: false,
		tls: {
			ciphers: "SSLv3",
		},
		requireTLS: true,
		port: 465,
		debug: true,
		connectionTimeout: 10000,
		auth: {
			user: process.env.GRIEVANCE_EMAIL,
			pass: process.env.GRIEVANCE_EMAIL_PASSWORD,
		},
	});

	// Render the React component to a string
	const emailHtml = render(
		<WelcomeEmail password={password} username={username} />
	);
	// Setup email data
	const mailOptions = {
		from: '"CXperts-portal" <portal@cxpertseg.com>', // sender address
		to: email, // list of receivers
		subject: "Welcome to CXperts", // Subject line
		html: emailHtml, // html body
	};

	// Send email with defined transport object
	try {
		const info = await transporter.sendMail(mailOptions);
		console.log("Message sent: %s", info.messageId);
		return { success: true, messageId: info.messageId };
	} catch (error) {
		console.error("Error sending email: ", error);
		return { success: false, error: error.message };
	}
}

// send vacation request email
export async function sendVacationRequestSubmissionEmail(
	vacationType,
	email,
	from,
	to
) {
	// Create a transport instance using nodemailer
	const transporter = nodemailer.createTransport({
		// Transport configuration (e.g., service, host, port, auth)
		host: "smtp.hostinger.com",
		secure: true,
		secureConnection: false,
		tls: {
			ciphers: "SSLv3",
		},
		requireTLS: true,
		port: 465,
		debug: true,
		connectionTimeout: 10000,
		auth: {
			user: process.env.GRIEVANCE_EMAIL,
			pass: process.env.GRIEVANCE_EMAIL_PASSWORD,
		},
	});

	// Render the React component to a string
	const emailHtml = render(
		<VacationRequestEmail from={from} to={to} vacationType={vacationType} />
	);
	// Setup email data
	const mailOptions = {
		from: '"CXperts-portal" <portal@cxpertseg.com>', // sender address
		to: email, // list of receivers
		subject: "Vacation Request Submitted! - Please Do Not Reply to This Email", // Subject line
		html: emailHtml, // html body
	};

	// Send email with defined transport object
	try {
		const info = await transporter.sendMail(mailOptions);
		console.log("Message sent: %s", info.messageId);
		return { success: true, messageId: info.messageId };
	} catch (error) {
		console.error("Error sending email: ", error);
		return { success: false, error: error.message };
	}
}

// send vacation request manager email
export async function sendVacationRequestManagerEmail(
	vacationType,
	email,
	from,
	to,
	employeeId,
	employeeName
) {
	// Create a transport instance using nodemailer
	const transporter = nodemailer.createTransport({
		// Transport configuration (e.g., service, host, port, auth)
		host: "smtp.hostinger.com",
		secure: true,
		secureConnection: false,
		tls: {
			ciphers: "SSLv3",
		},
		requireTLS: true,
		port: 465,
		debug: true,
		connectionTimeout: 10000,
		auth: {
			user: process.env.GRIEVANCE_EMAIL,
			pass: process.env.GRIEVANCE_EMAIL_PASSWORD,
		},
	});

	// Render the React component to a string
	const emailHtml = render(
		<VacationRequiredApprovalEmail
			from={from}
			to={to}
			vacationType={vacationType}
			employeeID={employeeId}
			employeeName={employeeName}
		/>
	);
	// Setup email data
	const mailOptions = {
		from: '"CXperts-portal" <portal@cxpertseg.com>', // sender address
		to: email, // list of receivers
		subject: "Vacation Request Requires Approval!", // Subject line
		html: emailHtml, // html body
	};

	// Send email with defined transport object
	try {
		const info = await transporter.sendMail(mailOptions);
		console.log("Message sent: %s", info.messageId);
		return { success: true, messageId: info.messageId };
	} catch (error) {
		console.error("Error sending email: ", error);
		return { success: false, error: error.message };
	}
}

// send vacation request feedback email
export async function sendVacationRequestFeedbackEmail(
	vacationType,
	email,
	from,
	status,
	to,
	managerName
) {
	// Create a transport instance using nodemailer
	const transporter = nodemailer.createTransport({
		// Transport configuration (e.g., service, host, port, auth)
		host: "smtp.hostinger.com",
		secure: true,
		secureConnection: false,
		tls: {
			ciphers: "SSLv3",
		},
		requireTLS: true,
		port: 465,
		debug: true,
		connectionTimeout: 10000,
		auth: {
			user: process.env.GRIEVANCE_EMAIL,
			pass: process.env.GRIEVANCE_EMAIL_PASSWORD,
		},
	});

	// Render the React component to a string
	const emailHtml = render(
		<VacationRequestFeedbackEmail
			from={from}
			status={status}
			to={to}
			managerName={managerName}
			vacationType={vacationType}
		/>
	);
	// Setup email data
	const mailOptions = {
		from: '"CXperts-portal" <portal@cxpertseg.com>', // sender address
		to: email, // list of receivers
		subject: "Vacation Request Feedback.", // Subject line
		html: emailHtml, // html body
	};

	// Send email with defined transport object
	try {
		const info = await transporter.sendMail(mailOptions);
		console.log("Message sent: %s", info.messageId);
		return { success: true, messageId: info.messageId };
	} catch (error) {
		console.error("Error sending email: ", error);
		return { success: false, error: error.message };
	}
}
