"use client";

import { Box, Button, Menu, MenuItem, Typography } from "@mui/material";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";

const pages = ["vacations"];

export default function WFMMenu() {
	const { data } = useSession();

	const handleOpenWFMMenu = (event) => {
		setAnchorElWFMMenu(event.currentTarget);
	};

	const handleCloseWFMMenu = () => {
		setAnchorElWFMMenu(null);
	};

	const [anchorElWFMMenu, setAnchorElWFMMenu] = React.useState(null);

	return data?.user?.department.name === "workforce" ? (
		<Box sx={{ flexGrow: 0 }} className="flex flex-row items-center gap-4">
			<Button
				onClick={handleOpenWFMMenu}
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
				anchorEl={anchorElWFMMenu}
				anchorOrigin={{
					vertical: "top",
					horizontal: "right",
				}}
				keepMounted
				transformOrigin={{
					vertical: "top",
					horizontal: "right",
				}}
				open={Boolean(anchorElWFMMenu)}
				onClose={handleCloseWFMMenu}
			>
				{pages.map((page, idx) => (
					<Link href={`/wfm/${page}`} key={idx}>
						<MenuItem
							onClick={() => {
								handleCloseWFMMenu();
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
