import { statSync, Stats } from 'fs';
import {
  validateString,
  validateObject,
  validateJsonFileSync,
  validateJsonFile,
  validateDirectorySync,
  validateDirectory as validateJsonFilesDirectory
} from './validator';
import {
  FileValidationResult,
  ObjectValidationResult,
  StringValidationResult,
  ValidationOptions
} from './types';
import {
  printStringValidation,
  printObjectValidation,
  printFileValidation,
  printDirectoryValidation
} from './printer';

/**
 * Validate if a data source conforms to ICU standard
 * The source can be either -
 * 1) a text
 * 2) an object of key and texts
 * 3) a JSON file containing keys and ICU texts
 * 4) directory containing JSON files
 * @param {string | object} source Validation source - it can be a single ICU string, an object of key value pair, a JSON file path or a directory path containing JSON files
 * @param {ValidationOptions} [options] options to customize the output and validation rules
 * @param {boolean} [options.prettyPrint=false] if the output should be printed on console
 * @param {boolean} [options.verbose=false] if all scanned files should be printed on console, only works if prettyPrint is enabled
 * @param {boolean} [options.ignoreTransTag=false] special handling for i18next Trans component generated output
 * @param {ParserOptions} [options.parseOptions] options to customize the validation rule
 * @param {boolean} [options.parseOptions.ignoreTag=false] Whether to treat HTML/XML tags as string literal
 * @param {boolean} [options.parseOptions.requiresOtherClause=false] Should `select`, `selectordinal`, and `plural` arguments always include the `other` case clause
 * @param {boolean} [options.parseOptions.shouldParseSkeletons=false] Whether to parse number/datetime skeleton into Intl.NumberFormatOptions and Intl.DateTimeFormatOptions, respectively.
 * @param {boolean} [options.parseOptions.captureLocation=false] Capture location info in AST
 * @param {Intl.Locale} [options.parseOptions.locale] Instance of Intl.Locale to resolve locale-dependent skeleton
 * @returns
 */
function validate(
  source: string | object,
  options?: ValidationOptions
):
  | StringValidationResult
  | ObjectValidationResult
  | FileValidationResult
  | FileValidationResult[]
  | undefined {
  if (typeof source === 'object') {
    const objectValidationResult = validateObject(
      source,
      options?.parseOptions,
      options?.ignoreTransTag
    );
    if (options?.prettyPrint) {
      printObjectValidation(objectValidationResult as ObjectValidationResult);
    }
    return objectValidationResult;
  }

  let fsStat: Stats;
  try {
    fsStat = statSync(source);
    if (fsStat.isFile()) {
      const fileValidationResult = validateJsonFileSync(
        source,
        options?.parseOptions,
        options?.ignoreTransTag
      );
      if (options?.prettyPrint) {
        printFileValidation(fileValidationResult, options?.verbose);
      }
      return fileValidationResult;
    } else if (fsStat.isDirectory()) {
      const directoryValidationResult = validateDirectorySync(
        source,
        options?.parseOptions,
        options?.ignoreTransTag
      );
      if (options?.prettyPrint) {
        printDirectoryValidation(directoryValidationResult, options?.verbose);
      }
      return directoryValidationResult;
    }
  } catch {
    // The source is an ICU string, validate the string
    const stringValidationResult = validateString(
      source,
      options?.parseOptions,
      options?.ignoreTransTag
    );
    if (options?.prettyPrint) {
      printStringValidation(source, stringValidationResult);
    }
    return stringValidationResult;
  }
}

/**
 * Check if all strings in a JSON file conforms to ICU standard
 * Typically the JSON file is an externalized translation file
 * @param {string} filePath Path of the JSON file
 * @param {ValidationOptions} [options] options to customize the output and validation rules
 * @param {boolean} [options.prettyPrint=false] if the output should be printed on console
 * @param {boolean} [options.verbose=false] if valid file output should also be printed on console, only works if prettyPrint is enabled
 * @param {boolean} [options.ignoreTransTag=false] special handling for i18next Trans component generated output
 * @param {ParserOptions} [options.parseOptions] options to customize the validation rule
 * @param {boolean} [options.parseOptions.ignoreTag=false] Whether to treat HTML/XML tags as string literal
 * @param {boolean} [options.parseOptions.requiresOtherClause=false] Should `select`, `selectordinal`, and `plural` arguments always include the `other` case clause
 * @param {boolean} [options.parseOptions.shouldParseSkeletons=false] Whether to parse number/datetime skeleton into Intl.NumberFormatOptions and Intl.DateTimeFormatOptions, respectively.
 * @param {boolean} [options.parseOptions.captureLocation=false] Capture location info in AST
 * @param {Intl.Locale} [options.parseOptions.locale] Instance of Intl.Locale to resolve locale-dependent skeleton
 * @returns {Promise<FileValidationResult>}
 */
async function validateFile(
  filePath: string,
  options?: ValidationOptions
): Promise<FileValidationResult> {
  const fileValidationResult = await validateJsonFile(
    filePath,
    options?.parseOptions,
    options?.ignoreTransTag
  );
  if (options?.prettyPrint) {
    printFileValidation(fileValidationResult, options?.verbose);
  }
  return fileValidationResult;
}

/**
 * Check if all strings inside all the JSON files of a directory conforms to ICU standard
 * @param {string} directoryPath Path of the directory containing locale JSON files
 * @param {ValidationOptions} [options] options to customize the output and validation rules
 * @param {boolean} [options.prettyPrint=false] if the output should be printed on console
 * @param {boolean} [options.verbose=false] if all scanned files should be printed on console, only works if prettyPrint is enabled
 * @param {boolean} [options.ignoreTransTag=false] special handling for i18next Trans component generated output
 * @param {ParserOptions} [options.parseOptions] options to customize the validation rule
 * @param {boolean} [options.parseOptions.ignoreTag=false] Whether to treat HTML/XML tags as string literal
 * @param {boolean} [options.parseOptions.requiresOtherClause=false] Should `select`, `selectordinal`, and `plural` arguments always include the `other` case clause
 * @param {boolean} [options.parseOptions.shouldParseSkeletons=false] Whether to parse number/datetime skeleton into Intl.NumberFormatOptions and Intl.DateTimeFormatOptions, respectively.
 * @param {boolean} [options.parseOptions.captureLocation=false] Capture location info in AST
 * @param {Intl.Locale} [options.parseOptions.locale] Instance of Intl.Locale to resolve locale-dependent skeleton
 * @returns {Promise<FileValidationResult[]>}
 */
async function validateDirectory(
  directoryPath: string,
  options?: ValidationOptions
): Promise<FileValidationResult[]> {
  const directoryValidationResult = await validateJsonFilesDirectory(
    directoryPath,
    options?.parseOptions,
    options?.ignoreTransTag
  );
  if (options?.prettyPrint) {
    printDirectoryValidation(directoryValidationResult, options?.verbose);
  }
  return directoryValidationResult;
}

export { validate, validateFile, validateDirectory };
