// Constants
export default function () {
  const height = 300;
  const entryHeight = 20;

  return {
    width: 600,
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
