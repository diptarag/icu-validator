import { Location, ParserOptions } from '@formatjs/icu-messageformat-parser';

interface StringValidationErrorResult {
  errorMessage: string;
  originalMessage: string;
  location: Location;
}

interface StringValidationResult {
  __icu_validator_error: boolean;
  result?: StringValidationErrorResult;
}

interface ObjectValidationResult {
  [key: string]: StringValidationResult | ObjectValidationResult;
}

interface FileValidationResult {
  isValid: boolean;
  fileName: string;
  validationResult: ObjectValidationResult | StringValidationResult;
}

interface ValidationOptions {
  prettyPrint?: boolean;
  verbose?: boolean;
  parseOptions?: ParserOptions;
  ignoreTransTag?: boolean;
}

export {
  StringValidationResult,
  ValidationOptions,
  ObjectValidationResult,
  FileValidationResult
};
