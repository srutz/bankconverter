/**
 * CAMT.053 to MT940 Converter
 */

import type { Balance, Camt053Document, Statement as CamtStatement, Entry, EntryDetails } from './Camt';
import type {
  ClosingBalance,
  DebitCredit,
  Mt940File,
  Mt940Statement,
  OpeningBalance,
  StatementLine,
  TransactionInformation,
} from './Mt940';

type ConversionOptions = {
  defaultCurrency?: string;
  statementNumberPrefix?: string;
  includeEntryDetails?: boolean;
};

export class CamtToMt940Converter {
  private options: Required<ConversionOptions>;

  constructor(options: ConversionOptions = {}) {
    this.options = {
      defaultCurrency: 'EUR',
      statementNumberPrefix: '',
      includeEntryDetails: true,
      ...options,
    };
  }

  convert(camtDoc: Camt053Document): Mt940File {
    return {
      statements: camtDoc.statements.map((stmt, idx) => this.convertStatement(stmt, idx)),
    };
  }

  private convertStatement(camtStmt: CamtStatement, index: number): Mt940Statement {
    const openingBalance = this.findOpeningBalance(camtStmt.balances);
    const closingBalance = this.findClosingBalance(camtStmt.balances);

    if (!openingBalance || !closingBalance) {
      throw new Error(`Statement ${camtStmt.identification}: Missing opening or closing balance`);
    }

    const transactions = this.options.includeEntryDetails
      ? this.convertEntriesWithDetails(camtStmt.entries)
      : this.convertEntries(camtStmt.entries);

    return {
      transactionReference: {
        tag: '20',
        reference: camtStmt.identification,
      },
      accountIdentification: {
        tag: '25',
        accountNumber: this.extractAccountNumber(camtStmt.account),
      },
      statementNumber: {
        tag: '28C',
        statementNumber: `${this.options.statementNumberPrefix}${camtStmt.electronicSequenceNumber || index + 1}`,
        sequenceNumber: camtStmt.legalSequenceNumber?.toString(),
      },
      openingBalance: this.convertToMt940Balance(openingBalance, '60F') as OpeningBalance,
      transactions,
      closingBalance: this.convertToMt940Balance(closingBalance, '62F') as ClosingBalance,
    };
  }

  private convertEntries(entries: Entry[]): StatementLine[] {
    return entries.map(entry => this.convertEntry(entry));
  }

  private convertEntriesWithDetails(entries: Entry[]): StatementLine[] {
    const lines: StatementLine[] = [];

    for (const entry of entries) {
      if (entry.entryDetails && entry.entryDetails.length > 0) {
        // Convert each entry detail as a separate transaction
        for (const detail of entry.entryDetails) {
          lines.push(this.convertEntryDetail(entry, detail));
        }
      } else {
        // No details, convert the entry itself
        lines.push(this.convertEntry(entry));
      }
    }

    return lines;
  }

  private convertEntry(entry: Entry): StatementLine {
    const line: StatementLine = {
      tag: '61',
      valueDate: entry.valueDate || entry.bookingDate || new Date(),
      entryDate: entry.bookingDate,
      debitCredit: this.convertDebitCredit(entry.creditDebitIndicator),
      amount: entry.amount.value,
      bankReference: entry.accountServicerReference,
    };

    if (entry.bankTransactionCode) {
      line.transactionType = this.mapBankTransactionCode(entry.bankTransactionCode);
    }

    if (entry.additionalEntryInformation) {
      line.information = {
        tag: '86',
        description: entry.additionalEntryInformation,
      };
    }

    return line;
  }

  private convertEntryDetail(entry: Entry, detail: EntryDetails): StatementLine {
    const line: StatementLine = {
      tag: '61',
      valueDate: entry.valueDate || entry.bookingDate || new Date(),
      entryDate: entry.bookingDate,
      debitCredit: this.convertDebitCredit(detail.creditDebitIndicator),
      amount: detail.amount.value,
      bankReference: detail.accountServicerReference || entry.accountServicerReference,
    };

    if (detail.bankTransactionCode) {
      line.transactionType = this.mapBankTransactionCode(detail.bankTransactionCode);
    }

    // Build tag 86 information
    const info: TransactionInformation = {
      tag: '86',
    };

    if (detail.bankTransactionCode) {
      info.transactionCode = detail.bankTransactionCode.proprietary;
    }

    if (detail.relatedParties) {
      if (detail.relatedParties.creditor?.name) {
        info.name = detail.relatedParties.creditor.name;
      } else if (detail.relatedParties.debtor?.name) {
        info.name = detail.relatedParties.debtor.name;
      }

      if (detail.relatedParties.creditorAccount?.iban) {
        info.accountNumber = detail.relatedParties.creditorAccount.iban;
      } else if (detail.relatedParties.debtorAccount?.iban) {
        info.accountNumber = detail.relatedParties.debtorAccount.iban;
      }
    }

    if (detail.remittanceInformation) {
      if (detail.remittanceInformation.unstructured && detail.remittanceInformation.unstructured.length > 0) {
        info.description = detail.remittanceInformation.unstructured.join(' ');
      }

      if (detail.remittanceInformation.structured?.creditorReferenceInformation?.reference) {
        info.reference = detail.remittanceInformation.structured.creditorReferenceInformation.reference;
      }
    }

    if (detail.references?.endToEndIdentification) {
      info.reference = info.reference || detail.references.endToEndIdentification;
    }

    // Only add information if there's actual content
    if (Object.keys(info).length > 1) {
      line.information = info;
    }

    return line;
  }

  private findBalance(balances: Balance[], type: string): Balance | undefined {
    return balances.find(b => b.type === type);
  }

  private findOpeningBalance(balances: Balance[]): Balance | undefined {
    // Try different opening balance types in order of preference
    // OPBD = Opening Booked (standard)
    // PRCD = Previously Closed Booked (acts as opening for next period)
    // ITBD = Interim Booked
    const openingTypes = ['OPBD', 'PRCD', 'ITBD'];
    
    for (const type of openingTypes) {
      const balance = this.findBalance(balances, type);
      if (balance) {
        return balance;
      }
    }
    
    // If no specific opening balance found, try to find any balance that could serve as opening
    // Look for the first balance that's not a closing balance
    return balances.find(b => !['CLBD', 'CLAV', 'FWAV'].includes(b.type));
  }

  private findClosingBalance(balances: Balance[]): Balance | undefined {
    // Try different closing balance types in order of preference
    // CLBD = Closing Booked (standard)
    // CLAV = Closing Available
    // FWAV = Forward Available
    const closingTypes = ['CLBD', 'CLAV', 'FWAV'];
    
    for (const type of closingTypes) {
      const balance = this.findBalance(balances, type);
      if (balance) {
        return balance;
      }
    }
    
    // If no specific closing balance found, return the last balance
    return balances[balances.length - 1];
  }

  private convertToMt940Balance(balance: Balance, tag: '60F' | '60M' | '62F' | '62M'): OpeningBalance | ClosingBalance {
    return {
      tag,
      debitCredit: this.convertDebitCredit(balance.creditDebitIndicator),
      date: balance.date,
      currency: balance.amount.currency,
      amount: balance.amount.value,
    };
  }

  private convertDebitCredit(cdtDbtInd: string): DebitCredit {
    switch (cdtDbtInd) {
      case 'CRDT':
        return 'C';
      case 'DBIT':
        return 'D';
      default:
        return 'C';
    }
  }

  private extractAccountNumber(account: {
    iban?: string;
    other?: { identification?: string };
    name?: string;
  }): string {
    if (account.iban) return account.iban;
    if (account.other?.identification) return account.other.identification;
    if (account.name) return account.name;
    return 'UNKNOWN';
  }

  private mapBankTransactionCode(btc: {
    family?: string;
    subFamily?: string;
    proprietary?: string;
  }): string {
    // Map CAMT bank transaction codes to MT940 transaction types
    // This is a simplified mapping - expand based on your needs
    
    if (btc.proprietary) {
      return btc.proprietary;
    }

    const family = btc.family || '';
    const subFamily = btc.subFamily || '';

    // Common mappings
    if (family === 'PMNT') {
      if (subFamily === 'RCDT') return 'NTRF'; // Received credit transfer
      if (subFamily === 'RDDT') return 'NDDT'; // Received direct debit
      if (subFamily === 'ICDT') return 'NTRF'; // Issued credit transfer
      if (subFamily === 'IDDT') return 'NDDT'; // Issued direct debit
    }

    if (family === 'MCOP') return 'MCOP'; // Card payment

    if (family === 'CAJT') {
      if (subFamily === 'CHRG') return 'NCHG'; // Charges
      if (subFamily === 'COMM') return 'NCOM'; // Commission
    }

    if (family === 'ICDT') return 'NTRF'; // Issued credit transfer
    if (family === 'RCDT') return 'NTRF'; // Received credit transfer
    if (family === 'DDBT') return 'NDDT'; // Direct debit

    // Default
    return 'NMSC'; // Miscellaneous
  }
}
