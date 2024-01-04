"use client";

import { Box, Button, Menu, MenuItem, Typography } from "@mui/material";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";

const pages = ["employees", "vacations", "layoffs"];

export default function HRMenu() {
	const { data } = useSession();

	const handleOpenHRMenu = (event) => {
		setAnchorElHRMenu(event.currentTarget);
	};

	const handleCloseHRMenu = () => {
		setAnchorElHRMenu(null);
	};

	const [anchorElHRMenu, setAnchorElHRMenu] = React.useState(null);

	return data?.user?.department.name === "human_resources" ? (
		<Box sx={{ flexGrow: 0 }} className="flex flex-row items-center gap-4">
			<Button
				onClick={handleOpenHRMenu}
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
				anchorEl={anchorElHRMenu}
				anchorOrigin={{
					vertical: "top",
					horizontal: "right",
				}}
				keepMounted
				transformOrigin={{
					vertical: "top",
					horizontal: "right",
				}}
				open={Boolean(anchorElHRMenu)}
				onClose={handleCloseHRMenu}
			>
				{pages.map((page, idx) => (
					<Link href={`/hr/${page}`} key={idx}>
						<MenuItem
							onClick={() => {
								handleCloseHRMenu();
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
