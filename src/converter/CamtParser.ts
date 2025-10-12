/**
 * CAMT.053 XML Parser
 */

import type {
  AccountIdentification,
  Amount,
  Balance,
  BalanceType,
  BankTransactionCode,
  Camt053Document,
  Camt053ParseResult,
  Camt053ParserConfig,
  CreditDebitCode,
  Entry,
  EntryDetails,
  EntryStatus,
  GroupHeader,
  PartyIdentification,
  RemittanceInformation,
  Statement,
} from './Camt';

export class Camt053Parser {
  private config: Camt053ParserConfig;
  private errors: string[] = [];
  private warnings: string[] = [];

  constructor(config: Camt053ParserConfig = {}) {
    this.config = {
      strictMode: false,
      validateBalances: true,
      parseNestedTransactions: true,
      ...config,
    };
  }

  parse(xmlString: string): Camt053ParseResult {
    this.errors = [];
    this.warnings = [];

    try {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlString, 'text/xml');

      const parserError = xmlDoc.querySelector('parsererror');
      if (parserError) {
        this.errors.push(`XML parsing error: ${parserError.textContent}`);
        return { success: false, errors: this.errors };
      }

      const document = this.parseDocument(xmlDoc);

      if (this.config.validateBalances) {
        this.validateBalances(document);
      }

      return {
        success: this.errors.length === 0,
        data: document,
        errors: this.errors.length > 0 ? this.errors : undefined,
        warnings: this.warnings.length > 0 ? this.warnings : undefined,
      };
    } catch (error) {
      this.errors.push(`Parse error: ${error instanceof Error ? error.message : String(error)}`);
      return { success: false, errors: this.errors };
    }
  }

  private parseDocument(xmlDoc: Document): Camt053Document {
    const root = xmlDoc.documentElement;
    const ns = root.namespaceURI || '';

    // Many CAMT files wrap statements in a container element such as
    // <BkToCstmrStmt> or <BkToCstmrAcctRpt>. Try those first, then fall
    // back to the document root so both styles are supported.
    const container =
      this.getElement(root, 'BkToCstmrStmt', ns) ||
      this.getElement(root, 'BkToCstmrAcctRpt', ns) ||
      root;

    const grpHdr = this.getElement(container, 'GrpHdr', ns);
    const stmts = this.getElements(container, 'Stmt', ns);

    return {
      groupHeader: this.parseGroupHeader(grpHdr, ns),
      statements: stmts.map(stmt => this.parseStatement(stmt, ns)),
    };
  }

  private parseGroupHeader(node: Element | null, ns: string): GroupHeader {
    if (!node) throw new Error('Group header not found');

    return {
      messageIdentification: this.getTextContent(node, 'MsgId', ns),
      creationDateTime: this.parseDateTime(this.getTextContent(node, 'CreDtTm', ns)),
      additionalInformation: this.getTextContent(node, 'AddtlInf', ns) || undefined,
    };
  }

  private parseStatement(node: Element, ns: string): Statement {
    const stmt: Statement = {
      identification: this.getTextContent(node, 'Id', ns),
      creationDateTime: this.parseDateTime(this.getTextContent(node, 'CreDtTm', ns)),
      account: this.parseAccount(this.getElement(node, 'Acct', ns), ns),
      balances: this.getElements(node, 'Bal', ns).map(bal => this.parseBalance(bal, ns)),
      entries: this.getElements(node, 'Ntry', ns).map(entry => this.parseEntry(entry, ns)),
    };

    const elctrncSeqNb = this.getTextContent(node, 'ElctrncSeqNb', ns);
    if (elctrncSeqNb) stmt.electronicSequenceNumber = parseInt(elctrncSeqNb, 10);

    const lglSeqNb = this.getTextContent(node, 'LglSeqNb', ns);
    if (lglSeqNb) stmt.legalSequenceNumber = parseInt(lglSeqNb, 10);

    const frDtTm = this.getTextContent(node, 'FrToDt/FrDtTm', ns);
    if (frDtTm) stmt.fromDateTime = this.parseDateTime(frDtTm);

    const toDtTm = this.getTextContent(node, 'FrToDt/ToDtTm', ns);
    if (toDtTm) stmt.toDateTime = this.parseDateTime(toDtTm);

    return stmt;
  }

  private parseBalance(node: Element, ns: string): Balance {
    const tp = this.getElement(node, 'Tp', ns);
    const cdOrPrtry = this.getTextContent(tp, 'CdOrPrtry/Cd', ns);

    return {
      type: (cdOrPrtry || 'OPBD') as BalanceType,
      creditDebitIndicator: this.getTextContent(node, 'CdtDbtInd', ns) as CreditDebitCode,
      amount: this.parseAmount(this.getElement(node, 'Amt', ns), ns),
      date: this.parseDate(this.getTextContent(node, 'Dt/Dt', ns)),
    };
  }

  private parseEntry(node: Element, ns: string): Entry {
    const entry: Entry = {
      amount: this.parseAmount(this.getElement(node, 'Amt', ns), ns),
      creditDebitIndicator: this.getTextContent(node, 'CdtDbtInd', ns) as CreditDebitCode,
      status: this.getTextContent(node, 'Sts', ns) as EntryStatus,
    };

    const bookDt = this.getTextContent(node, 'BookgDt/Dt', ns);
    if (bookDt) entry.bookingDate = this.parseDate(bookDt);

    const valDt = this.getTextContent(node, 'ValDt/Dt', ns);
    if (valDt) entry.valueDate = this.parseDate(valDt);

    const acctSvcrRef = this.getTextContent(node, 'AcctSvcrRef', ns);
    if (acctSvcrRef) entry.accountServicerReference = acctSvcrRef;

    const bkTxCd = this.getElement(node, 'BkTxCd', ns);
    if (bkTxCd) entry.bankTransactionCode = this.parseBankTransactionCode(bkTxCd, ns);

    const addtlNtryInf = this.getTextContent(node, 'AddtlNtryInf', ns);
    if (addtlNtryInf) entry.additionalEntryInformation = addtlNtryInf;

    if (this.config.parseNestedTransactions) {
      const ntryDtls = this.getElements(node, 'NtryDtls/TxDtls', ns);
      if (ntryDtls.length > 0) {
        entry.entryDetails = ntryDtls.map(dtl => this.parseEntryDetails(dtl, ns));
      }
    }

    return entry;
  }

  private parseEntryDetails(node: Element, ns: string): EntryDetails {
    const details: EntryDetails = {
      amount: this.parseAmount(this.getElement(node, 'Amt', ns), ns),
      creditDebitIndicator: this.getTextContent(node, 'CdtDbtInd', ns) as CreditDebitCode,
    };

    const acctSvcrRef = this.getTextContent(node, 'Refs/AcctSvcrRef', ns);
    if (acctSvcrRef) details.accountServicerReference = acctSvcrRef;

    const bkTxCd = this.getElement(node, 'BkTxCd', ns);
    if (bkTxCd) details.bankTransactionCode = this.parseBankTransactionCode(bkTxCd, ns);

    // Related parties
    const dbtr = this.getElement(node, 'RltdPties/Dbtr', ns);
    const dbtrAcct = this.getElement(node, 'RltdPties/DbtrAcct', ns);
    const cdtr = this.getElement(node, 'RltdPties/Cdtr', ns);
    const cdtrAcct = this.getElement(node, 'RltdPties/CdtrAcct', ns);

    if (dbtr || dbtrAcct || cdtr || cdtrAcct) {
      details.relatedParties = {};
      if (dbtr) details.relatedParties.debtor = this.parseParty(dbtr, ns);
      if (dbtrAcct) details.relatedParties.debtorAccount = this.parseAccount(dbtrAcct, ns);
      if (cdtr) details.relatedParties.creditor = this.parseParty(cdtr, ns);
      if (cdtrAcct) details.relatedParties.creditorAccount = this.parseAccount(cdtrAcct, ns);
    }

    // Remittance information
    const rmtInf = this.getElement(node, 'RmtInf', ns);
    if (rmtInf) details.remittanceInformation = this.parseRemittanceInformation(rmtInf, ns);

    // References
    const refs = this.getElement(node, 'Refs', ns);
    if (refs) {
      details.references = {
        endToEndIdentification: this.getTextContent(refs, 'EndToEndId', ns) || undefined,
        mandateIdentification: this.getTextContent(refs, 'MndtId', ns) || undefined,
      };
    }

    return details;
  }

  private parseAccount(node: Element | null, ns: string): AccountIdentification {
    if (!node) return {};

    const account: AccountIdentification = {};

    const iban = this.getTextContent(node, 'Id/IBAN', ns);
    if (iban) account.iban = iban;

    const othr = this.getElement(node, 'Id/Othr', ns);
    if (othr) {
      account.other = {
        identification: this.getTextContent(othr, 'Id', ns),
        schemeName: this.getTextContent(othr, 'SchmeNm/Cd', ns) || undefined,
      };
    }

    const ccy = this.getTextContent(node, 'Ccy', ns);
    if (ccy) account.currency = ccy;

    const nm = this.getTextContent(node, 'Nm', ns);
    if (nm) account.name = nm;

    return account;
  }

  private parseParty(node: Element, ns: string): PartyIdentification {
    const party: PartyIdentification = {};

    const nm = this.getTextContent(node, 'Nm', ns);
    if (nm) party.name = nm;

    return party;
  }

  private parseBankTransactionCode(node: Element, ns: string): BankTransactionCode {
    return {
      domain: this.getTextContent(node, 'Domn/Cd', ns) || undefined,
      family: this.getTextContent(node, 'Domn/Fmly/Cd', ns) || undefined,
      subFamily: this.getTextContent(node, 'Domn/Fmly/SubFmlyCd', ns) || undefined,
      proprietary: this.getTextContent(node, 'Prtry/Cd', ns) || undefined,
    };
  }

  private parseRemittanceInformation(node: Element, ns: string): RemittanceInformation {
    const rmtInf: RemittanceInformation = {};

    const ustrd = this.getElements(node, 'Ustrd', ns);
    if (ustrd.length > 0) {
      rmtInf.unstructured = ustrd.map(u => u.textContent || '');
    }

    return rmtInf;
  }

  private parseAmount(node: Element | null, _ns: string): Amount {
    if (!node) return { value: 0, currency: 'EUR' };

    return {
      value: parseFloat(node.textContent || '0'),
      currency: node.getAttribute('Ccy') || 'EUR',
    };
  }

  private parseDate(dateStr: string): Date {
    return new Date(dateStr);
  }

  private parseDateTime(dateTimeStr: string): Date {
    return new Date(dateTimeStr);
  }

  private getElement(parent: Element | Document, path: string, _ns: string): Element | null {
    const parts = path.split('/');
    let current: Element | null = parent as Element;

    for (const part of parts) {
      if (!current) return null;
      const found = Array.from(current.children).find(
        child => child.localName === part || child.tagName === part
      ) as Element | undefined;
      current = found || null;
    }

    return current;
  }

  private getElements(parent: Element | Document, path: string, _ns: string): Element[] {
    const parts = path.split('/');
    // biome-ignore lint/style/noNonNullAssertion: because
    const lastPart = parts.pop()!;
    let current: Element | null = parent as Element;

    for (const part of parts) {
      if (!current) return [];
      const found = Array.from(current.children).find(
        child => child.localName === part || child.tagName === part
      ) as Element | undefined;
      current = found || null;
    }

    if (!current) return [];

    return Array.from(current.children).filter(
      child => child.localName === lastPart || child.tagName === lastPart
    );
  }

  private getTextContent(parent: Element | null, path: string, ns: string): string {
    const element = this.getElement(parent as Element, path, ns);
    return element?.textContent?.trim() || '';
  }

  private validateBalances(doc: Camt053Document): void {
    for (const stmt of doc.statements) {
      const opening = stmt.balances.find(b => b.type === 'OPBD');
      const closing = stmt.balances.find(b => b.type === 'CLBD');

      if (!opening) {
        this.warnings.push(`Statement ${stmt.identification}: No opening balance found`);
      }

      if (!closing) {
        this.warnings.push(`Statement ${stmt.identification}: No closing balance found`);
      }

      if (opening && closing) {
        let calculated = opening.amount.value;
        if (opening.creditDebitIndicator === 'DBIT') calculated = -calculated;

        for (const entry of stmt.entries) {
          const amount = entry.creditDebitIndicator === 'CRDT' 
            ? entry.amount.value 
            : -entry.amount.value;
          calculated += amount;
        }

        const closingValue = closing.creditDebitIndicator === 'CRDT'
          ? closing.amount.value
          : -closing.amount.value;

        if (Math.abs(calculated - closingValue) > 0.01) {
          this.warnings.push(
            `Statement ${stmt.identification}: Balance mismatch. Expected ${closingValue}, calculated ${calculated}`
          );
        }
      }
    }
  }
}
