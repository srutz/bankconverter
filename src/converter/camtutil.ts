import { Camt053ParseResult } from "./Camt";
import { Camt053Parser } from "./CamtParser";
import { Mt940File } from "./Mt940";
import { CamtToMt940Converter } from "./Mt940Converter";

export function convertToMt940(content: string) {
  const parser = new Camt053Parser({
    parseNestedTransactions: true,
    strictMode: false,
    validateBalances: false,
  });
  let parseResult: Camt053ParseResult | null = null;
  try {
    parseResult = parser.parse(content);
  } catch (error) {
    console.error("Error parsing CAMT.053 file:", error);
  }
  const converter = new CamtToMt940Converter({
    defaultCurrency: "EUR",
    includeEntryDetails: true,
  });
  let mt940Result: Mt940File | null = null;
  if (parseResult?.success && parseResult.data) {
    try {
      mt940Result = converter.convert(parseResult.data);
    } catch (error) {
      console.error("Error parsing CAMT.053 file:", error);
    }
  }
  return {
    parseResult,
    mt940Result,
  };
}
