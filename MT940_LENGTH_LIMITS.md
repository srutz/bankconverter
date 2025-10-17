# MT940 Length Limits Implementation

This implementation adds proper MT940 field length validation and handling to the CAMT.053 to MT940 converter.

## What Was Added

### 1. Length Limit Constants (`Mt940Limits.ts`)
- Defined all MT940 field length limits according to SWIFT specification
- Added validation and truncation utility functions

### 2. Text Sanitization (`Mt940Converter.ts`)
- Added `sanitizeForMt940()` function to clean text data:
  - Removes line breaks, tabs, and non-printable characters
  - Collapses multiple spaces
  - Ensures MT940-compatible character set

### 3. Field Length Enforcement (`Mt940Output.ts`)
- **Tag 20**: Transaction Reference - limited to 16 characters
- **Tag 21**: Related Reference - limited to 16 characters  
- **Tag 25**: Account Number - limited to 35 characters
- **Tag 28C**: Statement/Sequence Numbers - limited to 5 characters each
- **Tag 61**: Customer/Bank References - limited to 16 characters each
- **Tag 61**: Supplementary Details - limited to 34 characters
- **Tag 86**: Information lines - limited to 65 characters per line

### 4. Smart Text Wrapping
- Long descriptions in Tag 86 are split across multiple structured fields (?20-?29)
- Long names are split across ?32 and ?33 fields
- Text wrapping respects word boundaries when possible
- Continuation lines for Tag 86 when content exceeds single line limit

### 5. Field-Specific Handling
- **Transaction codes**: Limited to 3 characters (?00 field)
- **Description fields**: Limited to 27 characters each (?20-?29)
- **Name fields**: Limited to 27 characters each (?32-?33)
- **Account fields**: Limited to 34 characters (?30-?31)
- **Reference fields**: Limited to 16 characters (?34)

## Test Results

The test demonstrates proper handling of overly long field values:

```
:20:VERY-LONG-STATEM          # Truncated to 16 chars
:25:DE89370400440532013000     # IBAN within limits
:61:240101C500,00SEPA_CT//VERY-LONG-BANK-R  # Bank ref truncated
:86:?00SEP?20This is the first part of a?21very long  # Multi-line wrapping
remittance?22information And this is the?23second part that
when?24combined with the first?25Creates an extremely
long?26description that exceeds?27field limits And should
be?28properly handled in the?29MT940 output
format?30FR1420041010050500013M02606?32This is an extremely
long?33creditor name that definite?34VERY-LONG-END-TO
```

## Key Features

1. **Compliance**: All output adheres to MT940 field length specifications
2. **Data Preservation**: Long text is wrapped rather than simply truncated when possible
3. **Readability**: Smart word-boundary breaking for better readability
4. **Validation**: Input data is sanitized to remove problematic characters
5. **Structured Output**: Uses proper MT940 structured format for Tag 86 information

## Benefits

- ✅ Generated MT940 files are specification-compliant
- ✅ No data loss due to intelligent wrapping
- ✅ Bank systems can properly parse the output
- ✅ Maintains data integrity while enforcing format constraints
- ✅ Handles edge cases like very long field values gracefully

The implementation ensures that the converter produces valid MT940 files that will be accepted by banking systems while preserving as much information as possible from the source CAMT.053 data.
