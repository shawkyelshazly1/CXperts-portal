import { MenuItem } from "@mui/material";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import PersonAddIcon from "@mui/icons-material/PersonAdd";

import toast from "react-hot-toast";

export default function UserStatusActionButton({
	userId,
	closeMenu,
	userStatus,
}) {
	const handleDisableUser = () => {
		toast
			.promise(
				fetch("/api/admin/users/disable", {
					method: "POST",
					body: JSON.stringify({
						userId,
					}),
					headers: {
						"Content-Type": "application/json",
					},
				}).then((res) => {
					if (!res.ok) {
						throw new Error("Failed to disable user");
					}
					return res.json();
				}),
				{
					loading: "Disabling user...",
					success: "User Disabled ✅",
					error: (err) => err.message,
				}
			)
			.finally(() => {
				closeMenu();
			});
	};

	const handleActivateUser = () => {
		toast
			.promise(
				fetch("/api/admin/users/activate", {
					method: "POST",
					body: JSON.stringify({
						userId,
					}),
					headers: {
						"Content-Type": "application/json",
					},
				}).then((res) => {
					if (!res.ok) {
						throw new Error("Failed to activate user");
					}
					return res.json();
				}),
				{
					loading: "Activating user...",
					success: "User Activated ✅",
					error: (err) => err.message,
				}
			)
			.finally(() => {
				closeMenu();
			});
	};

	return (
		<MenuItem
			onClick={() => {
				if (userStatus === "active") handleDisableUser();
				else handleActivateUser();
			}}
			disableRipple
		>
			{userStatus === "active" ? <PersonRemoveIcon /> : <PersonAddIcon />}
			{userStatus === "active" ? "Disable" : "Activate"}
		</MenuItem>
	);
}
