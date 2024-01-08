"use client";
import { useRouter } from "next/navigation";

export default function ClearFiltersButton() {
	const router = useRouter();

	const handleClearParams = () => {
		
		// Create a new URL object without query parameters
		const newUrl = new URL(window.location.href);
		newUrl.search = "";

		// Replace the current URL with the new URL without query parameters
		router.replace(newUrl.pathname);
	};

	return (
		<div>
			<button
				className={`  bg-amber-600 hover:bg-amber-700
				 self-end  text-white font-semibold py-2 px-4 flex flex-row gap-1 text-lg items-center justify-center rounded-lg `}
				onClick={handleClearParams}
			>
				Clear Filters
			</button>
		</div>
	);
}
