/**
 * Mt940 SWIFT Bank Statement Data Structures
 */

// Transaction types based on Mt940 standard
type TransactionType =
  | 'NTRF' // Non-SEPA Transfer
  | 'NSTO' // Non-SEPA Standing Order
  | 'NMSC' // Non-SEPA Miscellaneous
  | 'NDDT' // Non-SEPA Direct Debit
  | 'NCHG' // Non-SEPA Charges
  | 'NCOM' // Non-SEPA Commission
  | 'MCOP' // Card Payment
  | 'MDDT'; // Direct Debit

// Debit/Credit indicator
type DebitCredit = 'D' | 'C' | 'RD' | 'RC';

// Tag 20: Transaction Reference
type TransactionReference = {
  tag: '20';
  reference: string;
};

// Tag 21: Related Reference
type RelatedReference = {
  tag: '21';
  reference: string;
};

// Tag 25: Account Identification
type AccountIdentification = {
  tag: '25';
  accountNumber: string;
};

// Tag 28C: Statement Number/Sequence Number
type StatementNumber = {
  tag: '28C';
  statementNumber: string;
  sequenceNumber?: string;
};

// Tag 60F/60M: Opening Balance (Final/Intermediate)
type OpeningBalance = {
  tag: '60F' | '60M';
  debitCredit: DebitCredit;
  date: Date;
  currency: string;
  amount: number;
};

// Tag 62F/62M: Closing Balance (Final/Intermediate)
type ClosingBalance = {
  tag: '62F' | '62M';
  debitCredit: DebitCredit;
  date: Date;
  currency: string;
  amount: number;
};

// Tag 64: Closing Available Balance
type ClosingAvailableBalance = {
  tag: '64';
  debitCredit: DebitCredit;
  date: Date;
  currency: string;
  amount: number;
};

// Tag 65: Forward Available Balance
type ForwardAvailableBalance = {
  tag: '65';
  debitCredit: DebitCredit;
  date: Date;
  currency: string;
  amount: number;
};

// Tag 86: Information to Account Owner (Transaction details)
type TransactionInformation = {
  tag: '86';
  code?: string;
  transactionCode?: string;
  description?: string;
  details?: string;
  accountNumber?: string;
  bankCode?: string;
  name?: string;
  reference?: string;
  additionalInfo?: string;
};

// Tag 61: Statement Line
type StatementLine = {
  tag: '61';
  valueDate: Date;
  entryDate?: Date;
  debitCredit: DebitCredit;
  fundsCode?: string;
  amount: number;
  transactionType?: string;
  customerReference?: string;
  bankReference?: string;
  supplementaryDetails?: string;
  information?: TransactionInformation; // Associated tag 86
};

// Complete Mt940 Statement
type Mt940Statement = {
  transactionReference: TransactionReference;
  relatedReference?: RelatedReference;
  accountIdentification: AccountIdentification;
  statementNumber: StatementNumber;
  openingBalance: OpeningBalance;
  transactions: StatementLine[];
  closingBalance: ClosingBalance;
  closingAvailableBalance?: ClosingAvailableBalance;
  forwardAvailableBalances?: ForwardAvailableBalance[];
};

// Mt940 File (can contain multiple statements)
type Mt940File = {
  statements: Mt940Statement[];
  rawContent?: string;
};

// Parser result with validation
type Mt940ParseResult = {
  success: boolean;
  data?: Mt940File;
  errors?: string[];
  warnings?: string[];
};

// Helper type for raw Mt940 tags
type Mt940Tag = {
  tag: string;
  value: string;
  lineNumber?: number;
};

// Configuration for parsing
type Mt940ParserConfig = {
  strictMode?: boolean;
  dateFormat?: 'YYMMDD' | 'YYYYMMDD';
  decimalSeparator?: '.' | ',';
  validateBalances?: boolean;
};

export type {
  TransactionType,
  DebitCredit,
  TransactionReference,
  RelatedReference,
  AccountIdentification,
  StatementNumber,
  OpeningBalance,
  ClosingBalance,
  ClosingAvailableBalance,
  ForwardAvailableBalance,
  TransactionInformation,
  StatementLine,
  Mt940Statement,
  Mt940File,
  Mt940ParseResult,
  Mt940Tag,
  Mt940ParserConfig,
};
