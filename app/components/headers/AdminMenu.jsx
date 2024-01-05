"use client";

import { Box, Button, Menu, MenuItem, Typography } from "@mui/material";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";

const pages = ["users", "departments", "positions"];

export default function AdminMenu() {
	const { data } = useSession();

	const handleOpenAdminMenu = (event) => {
		setAnchorElAdminMenu(event.currentTarget);
	};

	const handleCloseAdminMenu = () => {
		setAnchorElAdminMenu(null);
	};

	const [anchorElAdminMenu, setAnchorElAdminMenu] = React.useState(null);

	return data?.user?.department.name === "information_technology" ? (
		<Box sx={{ flexGrow: 0 }} className="flex flex-row items-center gap-4">
			<Button
				onClick={handleOpenAdminMenu}
				sx={{
					my: 2,
					display: "block",
					fontWeight: "700",
				}}
			>
				Manage
			</Button>
			<Menu
				sx={{ mt: "45px" }}
				id="menu-appbar"
				anchorEl={anchorElAdminMenu}
				anchorOrigin={{
					vertical: "top",
					horizontal: "right",
				}}
				keepMounted
				transformOrigin={{
					vertical: "top",
					horizontal: "right",
				}}
				open={Boolean(anchorElAdminMenu)}
				onClose={handleCloseAdminMenu}
			>
				{pages.map((page, idx) => (
					<Link href={`/admin/${page}`} key={idx}>
						<MenuItem
							onClick={() => {
								handleCloseAdminMenu();
							}}
						>
							<Typography
								sx={{
									display: "block",
									fontWeight: "700",
									textTransform: "capitalize",
								}}
							>
								{page}
							</Typography>
						</MenuItem>
					</Link>
				))}
			</Menu>
		</Box>
	) : (
		<></>
	);
}
