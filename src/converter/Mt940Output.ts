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
  lines.push(`:20:${statement.transactionReference.reference}`);

  // Tag 21: Related Reference (optional)
  if (statement.relatedReference) {
    lines.push(`:21:${statement.relatedReference.reference}`);
  }

  // Tag 25: Account Identification
  lines.push(`:25:${statement.accountIdentification.accountNumber}`);

  // Tag 28C: Statement Number/Sequence Number
  let statementNumberLine = `:28C:${statement.statementNumber.statementNumber}`;
  if (statement.statementNumber.sequenceNumber) {
    statementNumberLine += `/${statement.statementNumber.sequenceNumber}`;
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
  const customerRef = transaction.customerReference || "";
  const bankRef = transaction.bankReference || "";
  const supplementaryDetails = transaction.supplementaryDetails || "";

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
  let line86 = ":86:";

  // Build structured information
  const parts: string[] = [];

  if (info.code) {
    parts.push(info.code);
  }

  if (info.transactionCode) {
    parts.push(`?00${info.transactionCode}`);
  }

  if (info.description) {
    parts.push(`?20${info.description}`);
  }

  if (info.name) {
    parts.push(`?32${info.name}`);
  }

  if (info.accountNumber) {
    parts.push(`?30${info.accountNumber}`);
  }

  if (info.bankCode) {
    parts.push(`?31${info.bankCode}`);
  }

  if (info.reference) {
    parts.push(`?34${info.reference}`);
  }

  if (info.details) {
    parts.push(`?60${info.details}`);
  }

  if (info.additionalInfo) {
    parts.push(`?61${info.additionalInfo}`);
  }

  // If no structured information, use description as fallback
  if (parts.length === 0 && info.description) {
    line86 += info.description;
  } else {
    line86 += parts.join("");
  }

  return line86;
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
