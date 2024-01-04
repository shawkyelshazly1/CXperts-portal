import * as React from "react";
import { styled, alpha } from "@mui/material/styles";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import EditIcon from "@mui/icons-material/Edit";
import Divider from "@mui/material/Divider";
import ContactPageIcon from "@mui/icons-material/ContactPage";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import ResetPasswordModal from "../resetPasswordModal/ResetPasswordModal";
import UserStatusActionButton from "../DisableUserActionButton";
import { useSession } from "next-auth/react";

// menu style

const StyledMenu = styled((props) => (
	<Menu
		elevation={0}
		anchorOrigin={{
			vertical: "bottom",
			horizontal: "right",
		}}
		transformOrigin={{
			vertical: "top",
			horizontal: "right",
		}}
		{...props}
	/>
))(({ theme }) => ({
	"& .MuiPaper-root": {
		borderRadius: 6,
		marginTop: theme.spacing(1),
		minWidth: 180,
		color:
			theme.palette.mode === "light"
				? "rgb(55, 65, 81)"
				: theme.palette.grey[300],
		boxShadow:
			"rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px",
		"& .MuiMenu-list": {
			padding: "4px 0",
		},
		"& .MuiMenuItem-root": {
			"& .MuiSvgIcon-root": {
				fontSize: 18,
				color: theme.palette.text.secondary,
				marginRight: theme.spacing(1.5),
			},
			"&:active": {
				backgroundColor: alpha(
					theme.palette.primary.main,
					theme.palette.action.selectedOpacity
				),
			},
		},
	},
}));

export default function ActionsMenu({ userId, userStatus }) {
	const { data } = useSession();

	const [anchorEl, setAnchorEl] = React.useState(null);
	const open = Boolean(anchorEl);
	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};
	const handleClose = () => {
		setAnchorEl(null);
	};

	return data.user.id !== userId ? (
		<div>
			<Button
				id="demo-customized-button"
				aria-controls={open ? "demo-customized-menu" : undefined}
				aria-haspopup="true"
				aria-expanded={open ? "true" : undefined}
				className="hover:bg-slate-200 font-semibold"
				disableElevation
				onClick={handleClick}
				endIcon={<KeyboardArrowDownIcon />}
			>
				Actions
			</Button>
			<StyledMenu
				id="demo-customized-menu"
				MenuListProps={{
					"aria-labelledby": "demo-customized-button",
				}}
				anchorEl={anchorEl}
				open={open}
				onClose={handleClose}
			>
				<MenuItem
					onClick={() => {
						console.log("view user profile, userId: ", userId);
						handleClose();
					}}
					disableRipple
				>
					<ContactPageIcon />
					View
				</MenuItem>
				<MenuItem
					onClick={() => {
						console.log("Edit user profile, userId: ", userId);
						handleClose();
					}}
					disableRipple
				>
					<EditIcon />
					Edit
				</MenuItem>

				{/* below only shows if IT */}

				<Divider sx={{ my: 0.5 }} />

				<ResetPasswordModal userId={userId} closeMenu={handleClose} />
				<UserStatusActionButton
					userId={userId}
					closeMenu={handleClose}
					userStatus={userStatus}
				/>
			</StyledMenu>
		</div>
	) : (
		<></>
	);
}
