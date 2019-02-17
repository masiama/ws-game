// Constants
export default function() {
	const width = innerWidth;
	const height = innerHeight;

	const entryHeight = 20;

	return {
		width,
		height,
		entryWidth: 50,
		entryHeight,
		rows: Math.floor(height / entryHeight),
		blockLength: 3,
		carSize: entryHeight,
		borderColor: [255, 255, 255],
		carColor: [255, 0, 0],
		bg: [0, 0, 0],
		randomCount: 6,
	};
}
