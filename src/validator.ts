import path from 'path';
import { readFileSync, readdirSync } from 'fs';
import { readFile, readdir } from 'fs/promises';
import { parse, ParserOptions } from '@formatjs/icu-messageformat-parser';
import {
  StringValidationResult,
  ObjectValidationResult,
  FileValidationResult
} from './types';
import { sanitizeInputText, sanitizeOutputText } from './utils';

function validateString(
  text: string,
  options?: ParserOptions,
  ignoreTransTag: boolean = false
): StringValidationResult {
  try {
    // Try to parse the string using format js parser after input sanitization
    // If successful then it's a valid ICU string
    parse(sanitizeInputText(text, ignoreTransTag), options);
    return {
      __icu_validator_error: false
    };
  } catch (error) {
    // @ts-expect-error
    const { message, location } = error as Error;
    return {
      __icu_validator_error: true,
      result: {
        errorMessage: message,
        originalMessage: sanitizeOutputText(text, ignoreTransTag),
        location
      }
    };
  }
}

function validateObject(
  source: object,
  options?: ParserOptions,
  ignoreTransTag: boolean = false
) {
  if (typeof source === 'object') {
    let transformedObj: ObjectValidationResult = {};
    for (let [key, value] of Object.entries(source)) {
      transformedObj[key] = validateObject(value, options, ignoreTransTag);
    }
    return transformedObj;
  } else if (typeof source === 'string') {
    return validateString(source, options, ignoreTransTag);
  } else {
    throw new Error('Translation source must either be string or an object');
  }
}

function validateJsonFileSync(
  filePath: string,
  options?: ParserOptions,
  ignoreTransTag: boolean = false
): FileValidationResult {
  if (!filePath.endsWith('.json')) {
    throw new Error('Only JSON file can be validated');
  }

  const fileContent = readFileSync(filePath, 'utf8');
  const validationResult = validateObject(
    JSON.parse(fileContent),
    options,
    ignoreTransTag
  );
  return {
    fileName: filePath,
    validationResult
  };
}

async function validateJsonFile(
  filePath: string,
  options?: ParserOptions,
  ignoreTransTag: boolean = false
): Promise<FileValidationResult> {
  if (!filePath.endsWith('.json')) {
    throw new Error('Only JSON file can be validated');
  }

  const fileContent = await readFile(filePath, 'utf8');
  const validationResult = validateObject(
    JSON.parse(fileContent),
    options,
    ignoreTransTag
  );
  return {
    fileName: filePath,
    validationResult
  };
}

function validateDirectorySync(
  directoryPath: string,
  options?: ParserOptions,
  ignoreTransTag: boolean = false
) {
  const files = readdirSync(directoryPath, 'utf8').filter((file) =>
    file.endsWith('.json')
  );

  return files.map((file) =>
    validateJsonFileSync(
      path.resolve(directoryPath, file),
      options,
      ignoreTransTag
    )
  );
}

async function validateDirectory(
  directoryPath: string,
  options?: ParserOptions,
  ignoreTransTag: boolean = false
) {
  const files = await readdir(directoryPath, 'utf8');
  return Promise.all(
    files
      .filter((file) => file.endsWith('.json'))
      .map((file) =>
        validateJsonFile(
          path.resolve(directoryPath, file),
          options,
          ignoreTransTag
        )
      )
  );
}

export {
  validateString,
  validateObject,
  validateJsonFile,
  validateJsonFileSync,
  validateDirectorySync,
  validateDirectory
};
