
export async function readFileAsText(file: File, encoding?: string): Promise<string> {
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