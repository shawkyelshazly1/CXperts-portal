"use client";

import { DatePicker } from "@mui/x-date-pickers";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useState, useTransition } from "react";

export default function DatePickerTo() {
	const [inputValue, setInputValue] = useState("");
	const [debouncedValue, setDebouncedValue] = useState("");
	const [mounted, setMounted] = useState(false);
	const [isPending, startTransition] = useTransition();
	const router = useRouter();
	const pathname = usePathname();

	// hook
	const handleSearchParams = useCallback(
		(debouncedValue) => {
			let params = new URLSearchParams(window.location.search);
			if (debouncedValue.length > 0) {
				params.set("to", debouncedValue);
			} else {
				params.delete("to");
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
		const searchQuery = params.get("to") ?? "";
		if (typeof searchQuery === "string") setInputValue(searchQuery?.split(","));
		else {
			setInputValue("");
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

	const handleChange = (value) => {
		setInputValue(value.toISOString());
	};

	return (
		<div className="flex flex-col gap-2 w-full">
			<DatePicker onChange={handleChange} />
		</div>
	);
}
