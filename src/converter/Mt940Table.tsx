import { useAtomValue } from "jotai";
import { languageAtom } from "@/components/tabs/atoms";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Mt940File, StatementLine } from "./Mt940";

function formatAmount(
  amount: number,
  language: string,
  currency: string = "EUR",
): string {
  return new Intl.NumberFormat(language === "de" ? "de-DE" : "en-US", {
    style: "currency",
    currency: currency,
  }).format(amount);
}

function formatDate(date: Date, language: string): string {
  return date.toLocaleDateString(language === "de" ? "de-DE" : "en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

export function Mt940Table({ mt940 }: { mt940: Mt940File | null }) {
  const language = useAtomValue(languageAtom);
  if (!mt940 || !mt940.statements || mt940.statements.length === 0) {
    return null;
  }

  // Flatten all transactions from all statements
  const allTransactions: Array<StatementLine & { statementIndex: number }> = [];
  mt940.statements.forEach((statement, index) => {
    statement.transactions.forEach((transaction) => {
      allTransactions.push({ ...transaction, statementIndex: index });
    });
  });

  if (allTransactions.length === 0) {
    return (
      <div className="text-center py-4 text-gray-500">
        No transactions found in MT940 file.
      </div>
    );
  }

  return (
    <Table>
      <TableCaption>MT940 Bank Statement Transactions</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Reference</TableHead>
          <TableHead>Description</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {allTransactions.map((transaction, index) => {
          const statement = mt940.statements[transaction.statementIndex];
          const currency = statement.openingBalance.currency;
          const isDebit =
            transaction.debitCredit === "D" || transaction.debitCredit === "RD";
          const amount = isDebit ? -transaction.amount : transaction.amount;

          return (
            <TableRow key={`${transaction.statementIndex}-${index}`}>
              <TableCell className="font-medium">
                {formatDate(transaction.valueDate, language)}
              </TableCell>
              <TableCell>
                <span
                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    isDebit
                      ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                      : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                  }`}
                >
                  {transaction.debitCredit}
                </span>
              </TableCell>
              <TableCell className="font-mono text-sm">
                {transaction.customerReference ||
                  transaction.bankReference ||
                  "-"}
              </TableCell>
              <TableCell className="max-w-[300px] text-wrap">
                {transaction.information?.description ||
                  transaction.information?.details ||
                  transaction.supplementaryDetails ||
                  "No description"}
              </TableCell>
              <TableCell
                className={`text-right font-medium ${
                  isDebit
                    ? "text-red-600 dark:text-red-400"
                    : "text-green-600 dark:text-green-400"
                }`}
              >
                {formatAmount(amount, language, currency)}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
