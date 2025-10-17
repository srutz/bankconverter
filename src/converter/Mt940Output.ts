import {
  ClosingAvailableBalance,
  ClosingBalance,
  ForwardAvailableBalance,
  Mt940File,
  Mt940Statement,
  OpeningBalance,
  StatementLine,
  TransactionInformation,
} from "./Mt940";
import { MT940_LIMITS } from "./Mt940Limits";

// Helper functions for MT940 length handling
function truncateField(value: string, maxLength: number): string {
  if (value.length <= maxLength) return value;
  return value.substring(0, maxLength);
}

function wrapText(text: string, maxLength: number): string[] {
  if (text.length <= maxLength) return [text];

  const lines: string[] = [];
  let remaining = text;

  while (remaining.length > 0) {
    if (remaining.length <= maxLength) {
      lines.push(remaining);
      break;
    }

    // Try to break at word boundary
    let breakPoint = maxLength;
    const lastSpace = remaining.lastIndexOf(" ", maxLength);
    if (lastSpace > maxLength * 0.7) {
      // Only break at space if it's not too early
      breakPoint = lastSpace;
    }

    lines.push(remaining.substring(0, breakPoint));
    remaining = remaining.substring(breakPoint).trimStart();
  }

  return lines;
}

// return the mt940 datastructure in textformat which is actually mt940
export function mt940Output({ mt940 }: { mt940: Mt940File }): string {
  if (!mt940 || !mt940.statements || mt940.statements.length === 0) {
    return "";
  }

  const lines: string[] = [];

  for (const statement of mt940.statements) {
    lines.push(...formatStatement(statement));
  }

  return lines.join("\r\n") + "\r\n";
}

function formatStatement(statement: Mt940Statement): string[] {
  const lines: string[] = [];

  // Tag 20: Transaction Reference
  lines.push(
    `:20:${truncateField(statement.transactionReference.reference, MT940_LIMITS.TRANSACTION_REFERENCE)}`,
  );

  // Tag 21: Related Reference (optional)
  if (statement.relatedReference) {
    lines.push(
      `:21:${truncateField(statement.relatedReference.reference, MT940_LIMITS.RELATED_REFERENCE)}`,
    );
  }

  // Tag 25: Account Identification
  lines.push(
    `:25:${truncateField(statement.accountIdentification.accountNumber, MT940_LIMITS.ACCOUNT_NUMBER)}`,
  );

  // Tag 28C: Statement Number/Sequence Number
  const statementNumber = truncateField(
    statement.statementNumber.statementNumber,
    MT940_LIMITS.STATEMENT_NUMBER,
  );
  let statementNumberLine = `:28C:${statementNumber}`;
  if (statement.statementNumber.sequenceNumber) {
    const sequenceNumber = truncateField(
      statement.statementNumber.sequenceNumber,
      MT940_LIMITS.SEQUENCE_NUMBER,
    );
    statementNumberLine += `/${sequenceNumber}`;
  }
  lines.push(statementNumberLine);

  // Tag 60F/60M: Opening Balance
  lines.push(formatBalance(statement.openingBalance));

  // Tag 61 & 86: Statement Lines (transactions)
  for (const transaction of statement.transactions) {
    lines.push(...formatTransaction(transaction));
  }

  // Tag 62F/62M: Closing Balance
  lines.push(formatBalance(statement.closingBalance));

  // Tag 64: Closing Available Balance (optional)
  if (statement.closingAvailableBalance) {
    lines.push(formatBalance(statement.closingAvailableBalance));
  }

  // Tag 65: Forward Available Balances (optional)
  if (
    statement.forwardAvailableBalances &&
    statement.forwardAvailableBalances.length > 0
  ) {
    for (const balance of statement.forwardAvailableBalances) {
      lines.push(formatBalance(balance));
    }
  }

  return lines;
}

function formatBalance(
  balance:
    | OpeningBalance
    | ClosingBalance
    | ClosingAvailableBalance
    | ForwardAvailableBalance,
): string {
  const tag = balance.tag;
  const debitCredit = balance.debitCredit;
  const date = formatDate(balance.date);
  const currency = balance.currency;
  const amount = formatAmount(balance.amount);

  return `:${tag}:${debitCredit}${date}${currency}${amount}`;
}

function formatTransaction(transaction: StatementLine): string[] {
  const lines: string[] = [];

  // Tag 61: Statement Line
  const valueDate = formatDate(transaction.valueDate);
  const entryDate = transaction.entryDate
    ? formatDate(transaction.entryDate)
    : "";
  const debitCredit = transaction.debitCredit;
  const fundsCode = transaction.fundsCode || "";
  const amount = formatAmount(transaction.amount);
  const transactionType = transaction.transactionType || "NMSC";
  const customerRef = transaction.customerReference
    ? truncateField(
        transaction.customerReference,
        MT940_LIMITS.CUSTOMER_REFERENCE,
      )
    : "";
  const bankRef = transaction.bankReference
    ? truncateField(transaction.bankReference, MT940_LIMITS.BANK_REFERENCE)
    : "";
  const supplementaryDetails = transaction.supplementaryDetails
    ? truncateField(
        transaction.supplementaryDetails,
        MT940_LIMITS.SUPPLEMENTARY_DETAILS,
      )
    : "";

  let line61 = `:61:${valueDate}`;
  if (entryDate && entryDate !== valueDate) {
    line61 += entryDate;
  }
  line61 += debitCredit;
  if (fundsCode) {
    line61 += fundsCode;
  }
  line61 += amount;
  line61 += transactionType;
  if (customerRef) {
    line61 += customerRef;
  }
  if (bankRef) {
    line61 += `//${bankRef}`;
  }
  if (supplementaryDetails) {
    line61 += `\r\n${supplementaryDetails}`;
  }

  lines.push(line61);

  // Tag 86: Information to Account Owner (optional)
  if (transaction.information) {
    lines.push(formatTransactionInformation(transaction.information));
  }

  return lines;
}

function formatTransactionInformation(info: TransactionInformation): string {
  // Build structured information with length limits
  const parts: string[] = [];

  if (info.code) {
    parts.push(truncateField(info.code, 3));
  }

  if (info.transactionCode) {
    parts.push(
      `?00${truncateField(info.transactionCode, MT940_LIMITS.TRANSACTION_CODE)}`,
    );
  }

  if (info.description) {
    // Split long descriptions across multiple ?20-?29 fields
    const descriptionLines = wrapText(
      info.description,
      MT940_LIMITS.DESCRIPTION_FIELD,
    );
    for (let i = 0; i < Math.min(descriptionLines.length, 10); i++) {
      // ?20-?29 = 10 fields max
      const fieldNumber = 20 + i;
      parts.push(`?${fieldNumber}${descriptionLines[i]}`);
    }
  }

  if (info.accountNumber) {
    parts.push(
      `?30${truncateField(info.accountNumber, MT940_LIMITS.ACCOUNT_FIELD)}`,
    );
  }

  if (info.bankCode) {
    parts.push(
      `?31${truncateField(info.bankCode, MT940_LIMITS.ACCOUNT_FIELD)}`,
    );
  }

  if (info.name) {
    // Split long names across ?32 and ?33 fields
    const nameLines = wrapText(info.name, MT940_LIMITS.NAME_FIELD);
    for (let i = 0; i < Math.min(nameLines.length, 2); i++) {
      // ?32 and ?33
      const fieldNumber = 32 + i;
      parts.push(`?${fieldNumber}${nameLines[i]}`);
    }
  }

  if (info.reference) {
    parts.push(
      `?34${truncateField(info.reference, MT940_LIMITS.REFERENCE_FIELD)}`,
    );
  }

  if (info.details) {
    parts.push(
      `?60${truncateField(info.details, MT940_LIMITS.DESCRIPTION_FIELD)}`,
    );
  }

  if (info.additionalInfo) {
    parts.push(
      `?61${truncateField(info.additionalInfo, MT940_LIMITS.DESCRIPTION_FIELD)}`,
    );
  }

  // Combine all parts and handle line wrapping for tag 86
  let content = parts.join("");

  // If no structured information, use description as fallback
  if (parts.length === 0 && info.description) {
    content = truncateField(
      info.description,
      MT940_LIMITS.INFO_LINE_LENGTH - 4,
    ); // -4 for ":86:"
  }

  // Handle line wrapping for tag 86
  const maxContentLength = MT940_LIMITS.INFO_LINE_LENGTH - 4; // -4 for ":86:"
  if (content.length <= maxContentLength) {
    return `:86:${content}`;
  }

  // Split long content across multiple lines
  const lines = wrapText(content, maxContentLength);
  const result = [`:86:${lines[0]}`];

  // Add continuation lines (without tag prefix)
  for (let i = 1; i < lines.length; i++) {
    result.push(lines[i]);
  }

  return result.join("\r\n");
}

function formatDate(date: Date): string {
  // MT940 uses YYMMDD format
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}${month}${day}`;
}

function formatAmount(amount: number): string {
  // MT940 uses comma as decimal separator and no thousands separator
  return amount.toFixed(2).replace(".", ",");
}
