export async function readFileAsText(
  file: File,
  encoding?: string,
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      resolve(reader.result as string);
    };
    reader.onerror = () => {
      reject(new Error("Failed to read file"));
    };
    if (encoding) {
      reader.readAsText(file, encoding);
    } else {
      reader.readAsText(file);
    }
  });
}

export function makeDtAusFilenameFromCamtFilename(
  camtFilename: string,
): string {
  // Example: camt053_20231015_123456.xml -> dt_aus_20231015_123456.txt
  const match = camtFilename.match(/camt053_(\d{8})_(\d{6})\.xml$/i);
  if (match) {
    const datePart = match[1];
    const timePart = match[2];
    return `dtaus_${datePart}_${timePart}.txt`;
  }
  return "dt_aus_output.txt";
}
