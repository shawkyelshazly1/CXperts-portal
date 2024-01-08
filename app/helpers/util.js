import { join } from "underscore.string";

export const saveFile = async (file, fileName, location, writeFile) => {
	const bytes = await file.arrayBuffer();
	const buffer = Buffer.from(bytes);

	// save to disk
	const path = join("/", location, fileName);
	await writeFile(path, buffer);
	console.log(`open ${path} to see the file`);
	return path;
};
