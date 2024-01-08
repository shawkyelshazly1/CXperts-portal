"use client";

import {
	Checkbox,
	FormControl,
	InputLabel,
	ListItemText,
	MenuItem,
	OutlinedInput,
	Select,
} from "@mui/material";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useState, useTransition } from "react";
import S from "underscore.string";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
	PaperProps: {
		style: {
			maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
			width: 250,
		},
	},
};

export default function StatusFilter() {
	const [inputValue, setInputValue] = useState([]);
	const [debouncedValue, setDebouncedValue] = useState([]);
	const [mounted, setMounted] = useState(false);
	const [isPending, startTransition] = useTransition();
	const router = useRouter();
	const pathname = usePathname();

	// hook
	const handleSearchParams = useCallback(
		(debouncedValue) => {
			let params = new URLSearchParams(window.location.search);
			if (debouncedValue.length > 0) {
				params.set("approvalStatus", debouncedValue);
			} else {
				params.delete("approvalStatus");
			}

			startTransition(() => {
				router.replace(`${pathname}?${params.toString()}`);
			});
		},
		[pathname, router]
	);

	// EFFECT: Set Inital params
	useEffect(() => {
		const params = new URLSearchParams(window.location.search);
		const searchQuery = params.get("approvalStatus") ?? [];
		if (typeof searchQuery === "string") setInputValue(searchQuery?.split(","));
		else {
			setInputValue([]);
		}
	}, []);

	// EFFECT: Set Mounted
	useEffect(() => {
		if (debouncedValue.length > 0 && !mounted) {
			setMounted(true);
		}
	}, [mounted, debouncedValue]);

	// EFFECT: Debounce Input Value
	useEffect(() => {
		const timer = setTimeout(() => {
			setDebouncedValue(inputValue);
		}, 500);

		return () => {
			clearTimeout(timer);
		};
	}, [inputValue]);

	// EFFECT: Search Params
	useEffect(() => {
		if (mounted) handleSearchParams(debouncedValue);
	}, [debouncedValue, mounted, handleSearchParams]);

	const handleChange = (event) => {
		const {
			target: { value },
		} = event;
		setInputValue(value);
	};

	return (
		<div className="flex flex-col gap-2 w-full">
			<FormControl sx={{ m: 1, width: 300 }}>
				<InputLabel id="approvalStatus-multiple-checkbox-label">
					Approval Status
				</InputLabel>
				<Select
					labelId="approvalStatus-multiple-checkbox-label"
					id="approvalStatus-multiple-checkbox"
					multiple
					name="approvalStatus"
					value={inputValue}
					onChange={handleChange}
					input={<OutlinedInput label="Approval Status" />}
					renderValue={() =>
						inputValue
							.map((status) =>
								status
									.split("_")
									.map((word) => S(word).capitalize().value())
									.join(" ")
							)
							.join(", ")
					}
					MenuProps={MenuProps}
				>
					{["pending", "denied", "approved"].map((status, idx) => (
						<MenuItem key={idx} value={status}>
							<Checkbox checked={inputValue.indexOf(status) > -1} />
							<ListItemText
								primary={status
									.split("_")
									.map((word) => S(word).capitalize().value())
									.join(" ")}
							/>
						</MenuItem>
					))}
				</Select>
			</FormControl>
		</div>
	);
}
