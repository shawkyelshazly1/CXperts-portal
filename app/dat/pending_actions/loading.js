import { ClipLoader } from "react-spinners";

export default function Loading() {
	return (
		<div className="flex flex-col items-center justify-center w-full ">
			<ClipLoader color="#1770b8" size={100} />
		</div>
	);
}
