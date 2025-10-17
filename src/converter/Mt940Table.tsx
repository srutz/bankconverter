import { useAtomValue } from "jotai";
import { useTranslation } from "react-i18next";
import { InfoField } from "@/components/base/InfoField";
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
import { ViewerButtonsBar } from "./ViewerButtonBar";

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

export function Mt940Table({
  mt940,
  code,
  filename,
}: {
  mt940: Mt940File | null;
  code: string;
  filename?: string;
}) {
  const { t } = useTranslation();
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
        {t("mt940Table.noTransactions")}
      </div>
    );
  }
  const statementNumbers = mt940.statements.map(
    (s) => s.statementNumber.statementNumber,
  );
  const accountNumbers = mt940.statements.map(
    (s) => s.accountIdentification.accountNumber,
  );
  const firstOpeningBalance = mt940.statements[0].openingBalance;
  const lastClosingBalance =
    mt940.statements[mt940.statements.length - 1].closingBalance;

  return (
    <div className="px-2 h-1 grow flex flex-col">
      <ViewerButtonsBar filename={filename} code={code}></ViewerButtonsBar>
      <div className="my-8 grid grid-cols-3 gap-1 self-start gap-x-8">
        <InfoField
          name={t("mt940Table.openingBalance")}
          value={formatAmount(
            firstOpeningBalance.amount,
            language,
            firstOpeningBalance.currency,
          )}
        />
        <InfoField
          name={t("mt940Table.statementNo")}
          value={statementNumbers.join(", ")}
        />
        <InfoField
          name={t("mt940Table.account")}
          value={accountNumbers.join(",")}
        />
        <InfoField
          name={t("mt940Table.closingBalance")}
          value={formatAmount(
            lastClosingBalance.amount,
            language,
            lastClosingBalance.currency,
          )}
        />
        <InfoField
          name={t("mt940Table.sum")}
          value={formatAmount(
            lastClosingBalance.amount - firstOpeningBalance.amount,
            language,
            lastClosingBalance.currency,
          )}
        />
        <InfoField
          name={t("mt940Table.totalTransactions")}
          value={allTransactions.length}
        />
      </div>
      <Table>
        <TableCaption>{filename || t("mt940Table.transactions")}</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>{t("mt940Table.date")}</TableHead>
            <TableHead>{t("mt940Table.type")}</TableHead>
            <TableHead>{t("mt940Table.reference")}</TableHead>
            <TableHead>{t("mt940Table.description")}</TableHead>
            <TableHead className="text-right">
              {t("mt940Table.amount")}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {allTransactions.map((transaction, index) => {
            const statement = mt940.statements[transaction.statementIndex];
            const currency = statement.openingBalance.currency;
            const debit =
              transaction.debitCredit === "D" ||
              transaction.debitCredit === "RD";
            const amount = debit ? -transaction.amount : transaction.amount;

            return (
              <TableRow key={`${transaction.statementIndex}-${index}`}>
                <TableCell className="font-medium">
                  {formatDate(transaction.valueDate, language)}
                </TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      debit
                        ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                        : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                    }`}
                  >
                    {transaction.debitCredit}
                  </span>
                </TableCell>
                <TableCell className="text-sm">
                  {transaction.customerReference ||
                    transaction.bankReference ||
                    "-"}
                </TableCell>
                <TableCell className="max-w-[60%] break-words whitespace-normal">
                  {transaction.information?.description ||
                    transaction.information?.details ||
                    transaction.supplementaryDetails ||
                    "-"}
                </TableCell>
                <TableCell
                  className={`text-right font-medium ${
                    debit
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
    </div>
  );
}
