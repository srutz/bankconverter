/**
 * MT940 Format Field Length Limits
 * Based on SWIFT MT940 Customer Statement Message specification
 */

export const MT940_LIMITS = {
  // Tag 20: Transaction Reference Number
  TRANSACTION_REFERENCE: 16,

  // Tag 21: Related Reference
  RELATED_REFERENCE: 16,

  // Tag 25: Account Identification
  ACCOUNT_NUMBER: 35,

  // Tag 28C: Statement Number/Sequence Number
  STATEMENT_NUMBER: 5,
  SEQUENCE_NUMBER: 5,

  // Tag 61: Statement Line
  CUSTOMER_REFERENCE: 16,
  BANK_REFERENCE: 16,
  SUPPLEMENTARY_DETAILS: 34,

  // Tag 86: Information to Account Owner
  INFO_LINE_LENGTH: 65, // Maximum characters per line
  TRANSACTION_CODE: 3, // ?00 field
  DESCRIPTION_FIELD: 27, // ?20-?29 fields
  NAME_FIELD: 27, // ?32-?33 fields
  ACCOUNT_FIELD: 34, // ?30-?31 fields
  REFERENCE_FIELD: 16, // ?34 field
} as const;

/**
 * Validates if a string exceeds MT940 field length limits
 */
export function validateFieldLength(
  value: string,
  limit: number,
  fieldName: string,
): { valid: boolean; message?: string } {
  if (value.length <= limit) {
    return { valid: true };
  }

  return {
    valid: false,
    message: `Field '${fieldName}' exceeds MT940 limit of ${limit} characters (current: ${value.length})`,
  };
}

/**
 * Truncates a field to MT940 limits with optional warning
 */
export function truncateToLimit(
  value: string,
  limit: number,
  fieldName?: string,
): { value: string; truncated: boolean } {
  if (value.length <= limit) {
    return { value, truncated: false };
  }

  if (fieldName) {
    console.warn(
      `MT940: Field '${fieldName}' truncated from ${value.length} to ${limit} characters`,
    );
  }

  return {
    value: value.substring(0, limit),
    truncated: true,
  };
}
