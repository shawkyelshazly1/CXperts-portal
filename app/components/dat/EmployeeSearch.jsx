"use client";

import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useState, useTransition } from "react";

export default function EmployeeSearch() {
	const [inputValue, setInputValue] = useState("");
	const [debouncedValue, setDebouncedValue] = useState("");
	const [isPending, startTransition] = useTransition();
	const router = useRouter();
	const pathname = usePathname();

	// hook
	const handleSearchParams = useCallback(
		(value) => {
			let params = new URLSearchParams(window.location.search);
			if (value.length > 0) {
				params.set("employeeId", value);
			} else {
				params.delete("employeeId");
			}
			startTransition(() => {
				router.replace(`${pathname}?${params.toString()}`);
			});
		},
		[pathname, router]
	);

	// EFFECT: Set Initial params
	useEffect(() => {
		const params = new URLSearchParams(window.location.search);
		const searchQuery = params.get("employeeId") ?? "";
		setInputValue(searchQuery);
	}, []);

	// EVENT HANDLER: Update Params
	const updateSearchParams = () => {
		if (inputValue.trim() === "") return;
		handleSearchParams(inputValue.toLowerCase());
	};

	return (
		<div className="flex flex-col gap-2 w-fit justify-center">
			<div className="flex flex-row gap-3 w-full">
				<input
					type="text"
					value={inputValue}
					onChange={(e) => setInputValue(e.target.value)}
					name="search"
					className="focus:outline-none border-[2px] border-primary rounded-lg py-1 px-2 focus:border-secondary"
					placeholder="Employee ID"
				/>
				<button
					onClick={updateSearchParams}
					className="bg-primary text-white rounded-lg py-1 px-4 hover:bg-secondary"
				>
					Search
				</button>
			</div>
		</div>
	);
}
