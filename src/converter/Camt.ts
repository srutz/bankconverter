/**
 * CAMT.053 (Bank-to-Customer Statement) Data Structures
 */

// Credit/Debit indicator
type CreditDebitCode = 'CRDT' | 'DBIT';

// Entry status
type EntryStatus = 'BOOK' | 'PDNG' | 'INFO';

// Balance types
type BalanceType =
  | 'OPBD' // Opening Booked
  | 'CLBD' // Closing Booked
  | 'ITBD' // Interim Booked
  | 'CLAV' // Closing Available
  | 'FWAV' // Forward Available
  | 'PRCD'; // Previously Closed Booked

// Party identification
type PartyIdentification = {
  name?: string;
  postalAddress?: {
    streetName?: string;
    buildingNumber?: string;
    postCode?: string;
    townName?: string;
    country?: string;
  };
  identification?: {
    organisationId?: string;
    privateId?: string;
  };
};

// Account identification
type AccountIdentification = {
  iban?: string;
  other?: {
    identification: string;
    schemeName?: string;
  };
  currency?: string;
  name?: string;
};

// Agent (Bank) identification
type AgentIdentification = {
  bic?: string;
  clearingSystemMemberId?: {
    memberId: string;
    clearingSystemId?: string;
  };
  name?: string;
  postalAddress?: {
    country?: string;
    addressLine?: string[];
  };
};

// Amount with currency
type Amount = {
  value: number;
  currency: string;
};

// Balance
type Balance = {
  type: BalanceType;
  creditDebitIndicator: CreditDebitCode;
  amount: Amount;
  date: Date;
};

// Bank transaction code
type BankTransactionCode = {
  domain?: string;
  family?: string;
  subFamily?: string;
  proprietary?: string;
};

// Remittance information
type RemittanceInformation = {
  unstructured?: string[];
  structured?: {
    creditorReferenceInformation?: {
      type?: string;
      reference?: string;
    };
    additionalRemittanceInformation?: string[];
  };
};

// Entry details (transaction details)
type EntryDetails = {
  amount: Amount;
  creditDebitIndicator: CreditDebitCode;
  status?: EntryStatus;
  bookingDate?: Date;
  valueDate?: Date;
  accountServicerReference?: string;
  bankTransactionCode?: BankTransactionCode;
  relatedParties?: {
    debtor?: PartyIdentification;
    debtorAccount?: AccountIdentification;
    creditor?: PartyIdentification;
    creditorAccount?: AccountIdentification;
  };
  relatedAgents?: {
    debtorAgent?: AgentIdentification;
    creditorAgent?: AgentIdentification;
  };
  remittanceInformation?: RemittanceInformation;
  references?: {
    messageIdentification?: string;
    accountOwnerTransactionIdentification?: string;
    accountServicerTransactionIdentification?: string;
    endToEndIdentification?: string;
    mandateIdentification?: string;
    chequeNumber?: string;
    clearingSystemReference?: string;
    proprietaryReference?: string;
  };
  returnInformation?: {
    originalBankTransactionCode?: BankTransactionCode;
    originator?: PartyIdentification;
    reason?: {
      code?: string;
      additionalInformation?: string;
    };
  };
  additionalEntryInformation?: string;
  charges?: {
    totalChargesAndTaxAmount?: Amount;
    records?: Array<{
      amount: Amount;
      creditDebitIndicator: CreditDebitCode;
      type?: string;
      chargeBearer?: string;
    }>;
  };
};

// Statement entry
type Entry = {
  amount: Amount;
  creditDebitIndicator: CreditDebitCode;
  status: EntryStatus;
  bookingDate?: Date;
  valueDate?: Date;
  accountServicerReference?: string;
  bankTransactionCode?: BankTransactionCode;
  additionalEntryInformation?: string;
  entryDetails?: EntryDetails[];
};

// Statement
type Statement = {
  identification: string;
  electronicSequenceNumber?: number;
  legalSequenceNumber?: number;
  creationDateTime: Date;
  fromDateTime?: Date;
  toDateTime?: Date;
  account: AccountIdentification;
  balances: Balance[];
  entries: Entry[];
  additionalStatementInformation?: string;
};

// Group header
type GroupHeader = {
  messageIdentification: string;
  creationDateTime: Date;
  messageRecipient?: PartyIdentification;
  messagePagination?: {
    pageNumber: string;
    lastPageIndicator: boolean;
  };
  additionalInformation?: string;
};

// CAMT.053 Document
type Camt053Document = {
  groupHeader: GroupHeader;
  statements: Statement[];
};

// Parser result
type Camt053ParseResult = {
  success: boolean;
  data?: Camt053Document;
  errors?: string[];
  warnings?: string[];
};

// Parser configuration
type Camt053ParserConfig = {
  strictMode?: boolean;
  validateBalances?: boolean;
  parseNestedTransactions?: boolean;
};

export type {
  CreditDebitCode,
  EntryStatus,
  BalanceType,
  PartyIdentification,
  AccountIdentification,
  AgentIdentification,
  Amount,
  Balance,
  BankTransactionCode,
  RemittanceInformation,
  EntryDetails,
  Entry,
  Statement,
  GroupHeader,
  Camt053Document,
  Camt053ParseResult,
  Camt053ParserConfig,
};