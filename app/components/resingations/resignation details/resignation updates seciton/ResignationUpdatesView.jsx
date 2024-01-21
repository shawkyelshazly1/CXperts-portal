"use client";
import { useEffect, useRef, useState } from "react";
import { ClipLoader } from "react-spinners";
import FeedbackCard from "./FeedbackCard";

export default function ResignationUpdatesView({ resignationId }) {
	const [updates, setUpdates] = useState([]);
	const [loading, setLoading] = useState(false);

	const scrolledSection = useRef(null);

	// load resignation
	useEffect(() => {
		async function loadResignationUpdates() {
			setLoading(true);
			await fetch(`/api/hr/resignation/updates/load/${resignationId}`, {
				method: "GET",
			})
				.then(async (res) => {
					return await res.json();
				})
				.then((data) => {
					setUpdates(data);
				})
				.catch((error) => toast.error("Something went wrong!"))
				.finally(() => {
					setLoading(false);
				});
		}

		// calling functions
		loadResignationUpdates();

		return () => {
			setUpdates([]);
		};
	}, [resignationId]);

	useEffect(() => {
		scrolledSection.current.scrollTop = scrolledSection?.current?.scrollHeight;
	}, [updates]);

	return (
		<div
			className="flex-1 w-full h-full  overflow-y-auto "
			ref={scrolledSection}
		>
			{loading ? (
				<div className="flex items-center justify-center w-full">
					<ClipLoader color="#1770b8" size={100} />
				</div>
			) : (
				<div className="flex flex-col-reverse gap-2  w-full p-2">
					{updates.map((update, idx) => (
						<FeedbackCard feedback={update} key={idx} />
					))}
				</div>
			)}
		</div>
	);
}
