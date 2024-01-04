export default function layout({ children }) {
	return (
		<div className="flex w-full h-[calc(100vh-7.1vh)] justify-center items-center  py-6">
			{children}
		</div>
	);
}
