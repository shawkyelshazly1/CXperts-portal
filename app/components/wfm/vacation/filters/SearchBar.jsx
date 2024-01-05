"use client";

import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useState, useTransition } from "react";

export default function SearchBar() {
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
				params.set("search", debouncedValue);
			} else {
				params.delete("search");
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
		const searchQuery = params.get("search") ?? "";
		setInputValue(searchQuery);
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

	return (
		<div className="flex flex-col gap-2 w-2/4 justify-center ">
			<input
				type="text"
				value={inputValue}
				onChange={(e) => setInputValue(e.target.value)}
				name="search"
				className="w-fullfocus:outline-none border-[2px] border-primary rounded-lg py-1 px-2 focus:border-secondary"
				placeholder="Find Employee"
			/>

			<div className="flex flex-row gap-3 w-full"></div>
		</div>
	);
}
