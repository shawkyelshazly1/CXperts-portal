"use client";

import { usePathname, useRouter } from "next/navigation";
import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import { signOut, useSession } from "next-auth/react";
import S from "underscore.string";
import { FaUser } from "react-icons/fa";
import Link from "next/link";
import logoPic from "@/public/logo.png";
import AdminMenu from "./AdminMenu";
import HRMenu from "./HRMenu";
import Image from "next/image";
import WFMMenu from "./WFMMenu";

const pages = ["home", "vacation"];
const settings = ["profile", "reset_password", "Logout"];

export default function Header() {
	const pathname = usePathname();
	const router = useRouter();

	const { data } = useSession();

	const [anchorElNav, setAnchorElNav] = React.useState(null);
	const [anchorElUser, setAnchorElUser] = React.useState(null);

	const handleOpenNavMenu = (event) => {
		setAnchorElNav(event.currentTarget);
	};
	const handleOpenUserMenu = (event) => {
		setAnchorElUser(event.currentTarget);
	};

	const handleCloseNavMenu = () => {
		setAnchorElNav(null);
	};

	const handleCloseUserMenu = () => {
		setAnchorElUser(null);
	};
	return pathname === "/login" ? (
		<></>
	) : (
		<AppBar position="sticky" style={{ backgroundColor: "#FFF" }}>
			<Container maxWidth="xl">
				<Toolbar disableGutters>
					<Image
						src={logoPic}
						alt="go-call-logo"
						width={70}
						height={70}
						className="hidden md:flex p-2"
					/>

					<Box sx={{ display: { xs: "flex", md: "none" } }}>
						<IconButton
							size="large"
							aria-label="account of current user"
							aria-controls="menu-appbar"
							aria-haspopup="true"
							onClick={handleOpenNavMenu}
						>
							<MenuIcon />
						</IconButton>
						<Menu
							id="menu-appbar"
							anchorEl={anchorElNav}
							anchorOrigin={{
								vertical: "bottom",
								horizontal: "left",
							}}
							keepMounted
							transformOrigin={{
								vertical: "top",
								horizontal: "left",
							}}
							open={Boolean(anchorElNav)}
							onClose={handleCloseNavMenu}
							sx={{
								display: { xs: "block", md: "none" },
							}}
						>
							{pages.map((page) => (
								<Link href={page === "home" ? "/" : `/${page}`} key={page}>
									<MenuItem>
										<Typography color="#000" textAlign="center">
											{page}
										</Typography>
									</MenuItem>
								</Link>
							))}
							{/* departments menus */}
							<AdminMenu />
							<HRMenu />
							<WFMMenu />
						</Menu>
					</Box>

					<div className="flex-1 w-full flex md:hidden">
						<Image
							src={logoPic}
							alt="go-call-logo"
							width={50}
							height={50}
							className=""
						/>
					</div>
					<Box
						sx={{
							flexGrow: 1,
							display: { xs: "none", md: "flex", marginLeft: "50px" },
						}}
					>
						{pages.map((page) => (
							<Link href={page === "home" ? "/" : `/${page}`} key={page}>
								<Button
									sx={{
										my: 2,
										display: "block",
										fontWeight: "700",
									}}
								>
									{page}
								</Button>
							</Link>
						))}
						{/* departments menus */}
						<AdminMenu />
						<HRMenu />
						<WFMMenu />
					</Box>

					<Box
						sx={{ flexGrow: 0 }}
						className="flex flex-row items-center gap-4"
					>
						<Typography
							textAlign="center"
							className="text-lg font-semibold text-gray-400"
						>
							Welcome, {S(data?.user?.firstName).capitalize().value()}
						</Typography>
						<Tooltip title="Open settings">
							<IconButton
								onClick={handleOpenUserMenu}
								className=" rounded-full w-fit "
							>
								<Image
									src={"/profile_image.png"}
									className="rounded-full border-[2px] border-[#fbb919]"
									width={45}
									height={35}
									alt="profile_image"
								/>
							</IconButton>
						</Tooltip>
						<Menu
							sx={{ mt: "45px" }}
							id="menu-appbar"
							anchorEl={anchorElUser}
							anchorOrigin={{
								vertical: "top",
								horizontal: "right",
							}}
							keepMounted
							transformOrigin={{
								vertical: "top",
								horizontal: "right",
							}}
							open={Boolean(anchorElUser)}
							onClose={handleCloseUserMenu}
						>
							{settings.map((setting) => (
								<MenuItem
									key={setting}
									onClick={() => {
										setting === "Logout"
											? signOut({ callbackUrl: "/" })
											: router.push(`/${setting}`);
										handleCloseUserMenu();
									}}
								>
									<Typography textAlign="center">
										{setting
											.split("_")
											.map((value) => S(value).capitalize().value())
											.join(" ")}
									</Typography>
								</MenuItem>
							))}
						</Menu>
					</Box>
				</Toolbar>
			</Container>
		</AppBar>
	);
}
