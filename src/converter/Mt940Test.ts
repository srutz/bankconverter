/**
 * Test file to verify MT940 length limits are working correctly
 */

import type { Camt053Document } from "./Camt";
import { CamtToMt940Converter } from "./Mt940Converter";
import { mt940Output } from "./Mt940Output";

// Test data with very long strings to verify truncation
const testCamtData: Camt053Document = {
  groupHeader: {
    messageIdentification: "TEST123",
    creationDateTime: new Date(),
    messageRecipient: {
      name: "TEST",
      identification: {
        organisationId: "TEST",
      },
    },
  },
  statements: [
    {
      identification:
        "VERY-LONG-STATEMENT-IDENTIFICATION-THAT-EXCEEDS-SIXTEEN-CHARACTERS",
      creationDateTime: new Date("2024-01-01"),
      account: {
        iban: "DE89370400440532013000",
        name: "Test Account with a very long name that exceeds limits",
      },
      electronicSequenceNumber: 1,
      legalSequenceNumber: 1,
      balances: [
        {
          type: "OPBD",
          creditDebitIndicator: "CRDT",
          date: new Date("2024-01-01"),
          amount: { value: 1000.0, currency: "EUR" },
        },
        {
          type: "CLBD",
          creditDebitIndicator: "CRDT",
          date: new Date("2024-01-02"),
          amount: { value: 1500.0, currency: "EUR" },
        },
      ],
      entries: [
        {
          accountServicerReference:
            "VERY-LONG-BANK-REFERENCE-THAT-EXCEEDS-LIMIT",
          bookingDate: new Date("2024-01-01"),
          valueDate: new Date("2024-01-01"),
          creditDebitIndicator: "CRDT",
          status: "BOOK",
          amount: { value: 500.0, currency: "EUR" },
          additionalEntryInformation:
            "This is a very long additional entry information that definitely exceeds the normal field limits and should be truncated or wrapped appropriately in the MT940 output format",
          entryDetails: [
            {
              creditDebitIndicator: "CRDT",
              amount: { value: 500.0, currency: "EUR" },
              bankTransactionCode: {
                family: "PMNT",
                subFamily: "RCDT",
                proprietary: "SEPA_CT",
              },
              relatedParties: {
                creditor: {
                  name: "This is an extremely long creditor name that definitely exceeds the MT940 field length limits and should be handled properly by wrapping or truncation",
                },
                creditorAccount: {
                  iban: "FR1420041010050500013M02606",
                },
              },
              remittanceInformation: {
                unstructured: [
                  "This is the first part of a very long remittance information",
                  "And this is the second part that when combined with the first",
                  "Creates an extremely long description that exceeds field limits",
                  "And should be properly handled in the MT940 output format",
                ],
              },
              references: {
                endToEndIdentification: "VERY-LONG-END-TO-END-REFERENCE-ID",
              },
            },
          ],
        },
      ],
    },
  ],
};

// Test the converter
console.log("=== Testing MT940 Length Limits ===\n");

const converter = new CamtToMt940Converter({
  defaultCurrency: "EUR",
  includeEntryDetails: true,
});

try {
  const mt940Data = converter.convert(testCamtData);
  const mt940Text = mt940Output({ mt940: mt940Data });

  console.log("Generated MT940 output:");
  console.log("=".repeat(50));
  console.log(mt940Text);
  console.log("=".repeat(50));

  // Check line lengths
  const lines = mt940Text.split("\r\n");
  console.log("\nLine length analysis:");
  lines.forEach((line, index) => {
    if (line.trim()) {
      console.log(
        `Line ${index + 1}: ${line.length} chars - ${line.substring(0, 80)}${line.length > 80 ? "..." : ""}`,
      );
      if (line.length > 65) {
        console.warn(`  ⚠️  Line exceeds MT940 limit of 65 characters`);
      }
    }
  });
} catch (error) {
  console.error("Error testing MT940 conversion:", error);
}
