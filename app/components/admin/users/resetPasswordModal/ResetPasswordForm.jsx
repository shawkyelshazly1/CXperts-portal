"use client";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { ClipLoader } from "react-spinners";

export default function ResetPasswordForm({ userId, closeModal }) {
	const [loading, setLoading] = useState(false);
	const [formData, setFormData] = useState({
		password: null,
		confirmPassword: null,
		userId: userId,
	});

	const handleFormSubmission = async (e) => {
		e.preventDefault();

		if (Object.entries(formData).some((key, value) => value === null)) {
			toast.error("Missing Fields");
			return;
		}

		if (formData.password !== formData.confirmPassword) {
			toast.error("Passwords don't match");
			return;
		}

		setLoading(true);
		// send api request to CREATE USER
		await fetch("/api/admin/users/reset_password", {
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
				toast.success("Password Changed ✅");
				closeModal();
			})
			.catch((error) => {
				toast.error(error.message);
			})
			.finally(() => {
				setLoading(false);
			});
	};

	const handleFieldChange = (field) => {
		setFormData({ ...formData, [field.name]: field.value });
	};
	return (
		<form
			className="flex flex-col gap-4 w-full"
			onSubmit={handleFormSubmission}
		>
			<input
				type="password"
				className="p-3 border-2 border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-200 ease-in-out"
				placeholder="Password"
				required
				name="password"
				onChange={(e) => {
					handleFieldChange({ name: e.target.name, value: e.target.value });
				}}
			/>
			<input
				type="password"
				className="p-3 border-2 border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-200 ease-in-out"
				placeholder="Confirm Password"
				required
				name="confirmPassword"
				onChange={(e) => {
					handleFieldChange({ name: e.target.name, value: e.target.value });
				}}
			/>
			<button
				disabled={loading}
				type="submit"
				className="mt-4 p-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-opacity-50 transition duration-200 ease-in-out"
			>
				{loading ? <ClipLoader size={25} color="#FFF" /> : "Reset Password"}
			</button>
		</form>
	);
}
