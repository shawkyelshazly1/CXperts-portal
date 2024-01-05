"use client";

import { signOut } from "next-auth/react";
import { useState } from "react";
import toast from "react-hot-toast";
import { BsCheckLg, BsX } from "react-icons/bs";

export default function ResetPasswordForm() {
	const [formData, setFormData] = useState({
		old_password: "",
		new_password: "",
		confirm_password: "",
	});

	const [requirementsMet, setRequirementsMet] = useState({
		length: false,
		uppercase: false,
		lowercase: false,
		digit: false,
		specialChar: false,
	});

	const requirements = [
		{ id: "length", label: "At least 8 characters" },
		{ id: "uppercase", label: "At least one uppercase letter" },
		{ id: "lowercase", label: "At least one lowercase letter" },
		{ id: "digit", label: "At least one digit" },
		{ id: "specialChar", label: "At least one special character !@#$%_" },
	];

	const handleFieldChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handlePasswordChange = (e) => {
		const newPassword = e.target.value;
		setFormData({ ...formData, [e.target.name]: e.target.value.trim() });

		// Check each requirement and update the state
		setRequirementsMet({
			length: newPassword.length >= 8,
			uppercase: /[A-Z]/.test(newPassword),
			lowercase: /[a-z]/.test(newPassword),
			digit: /\d/.test(newPassword),
			specialChar: /[!@#$%_]/.test(newPassword),
		});
	};

	const handleFormSubmission = async (e) => {
		e.preventDefault();

		// validate form
		if (
			Object.values(requirementsMet).some((item) => {
				return item !== true;
			})
		) {
			toast.error("Password Requirements aren't met!");
			return;
		}

		if (formData.new_password !== formData.confirm_password) {
			toast.error("Confirm new password!");
			return;
		}

		if (formData.new_password === formData.old_password) {
			toast.error("Choose new password!");
			return;
		}

		await fetch("/api/user/reset_password", {
			method: "POST",
			body: JSON.stringify({
				...formData,
			}),
		})
			.then(async (res) => {
				return await res.json();
			})
			.then((data) => {
				if (data.error) {
					throw new Error(data.error);
				}

				toast.success("Password Changed.");
				toast.success("You will be loggedOut!");

				var delayInMilliseconds = 300; //1 second

				setTimeout(function () {
					signOut({ callbackUrl: "/" });
				}, delayInMilliseconds);
			})
			.catch((error) => {
				toast.error(error.message);
			})
			.finally(() => {});
	};

	return (
		<form
			className="flex flex-col gap-3 items-center w-2/4 lg:w-1/4 xl:w-1/5"
			onSubmit={handleFormSubmission}
		>
			<input
				required
				name="old_password"
				type="password"
				placeholder="Old Password"
				onChange={handleFieldChange}
				className="w-full py-2 px-4 text-lg border-2 focus:outline-none focus:border-secondary rounded-lg"
			/>
			<input
				required
				name="new_password"
				type="password"
				placeholder="New Password"
				className="w-full py-2 px-4 text-lg border-2 focus:outline-none focus:border-secondary rounded-lg"
				onChange={handlePasswordChange}
			/>
			<div
				className={`flex flex-col gap-0 self-start ${
					formData.new_password === "" ? "hidden" : ""
				}`}
			>
				{Object.values(requirementsMet).every((item) => item === true) ? (
					<span className="text-sm  flex flex-row gap-0 text-[#42a15e]">
						<BsCheckLg color="#42a15e" size={15} /> Matches Requirements
					</span>
				) : (
					requirements.map((item, idx) => (
						<span
							key={idx}
							className={`text-sm  flex flex-row gap-0 ${
								requirementsMet[item.id] ? "text-[#42a15e]" : "text-[#D80032]"
							}`}
						>
							{requirementsMet[item.id] ? (
								<BsCheckLg color="#42a15e" size={15} />
							) : (
								<BsX color="#D80032" size={18} />
							)}
							{item.label}
						</span>
					))
				)}
			</div>
			<input
				required
				name="confirm_password"
				type="password"
				placeholder="Confirm New Password"
				onChange={handleFieldChange}
				className="w-full py-2 px-4 text-lg border-2 focus:outline-none focus:border-secondary rounded-lg"
			/>
			<div
				className={`flex flex-col gap-0 self-start ${
					formData.confirm_password === "" ? "hidden" : ""
				}`}
			>
				{formData.new_password !== formData.confirm_password ? (
					<span className="text-sm  flex flex-row gap-0 text-[#D80032]">
						<BsX color="#D80032" size={18} /> Password doesn&apos;t match
					</span>
				) : (
					<span className="text-sm  flex flex-row gap-0 text-[#42a15e]">
						<BsCheckLg color="#42a15e" size={15} /> Password match
					</span>
				)}
			</div>
			<button className="py-2 px-4 w-full bg-primary text-white font-semibold rounded-lg text-xl mt-2">
				Reset Password
			</button>
		</form>
	);
}
