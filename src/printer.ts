import kleur from 'kleur';
import {
  StringValidationResult,
  ObjectValidationResult,
  FileValidationResult
} from './types';
import { isStringValidationResult } from './utils';

function printStringValidation(
  text: string,
  validationResult: StringValidationResult
) {
  if (!validationResult.__icu_validator_error) {
    console.log(kleur.green(`Valid ICU string :- ${text}`));
    return;
  }

  console.log(kleur.bgRed(`Invalid ICU string :- ${text}`));
  if (validationResult.result) {
    console.log(`Error :- ${kleur.red(validationResult.result.errorMessage)}`);
    console.log(
      `Location :- ${JSON.stringify(validationResult.result.location)}`
    );
  }
}

function _printObjectValidationRec(
  source: StringValidationResult | ObjectValidationResult,
  path: string
) {
  // Print message only for individual string and also only for error
  // Skip other validation results
  if (isStringValidationResult(source)) {
    if (source.__icu_validator_error) {
      console.log(
        kleur.bgRed(`Invalid ICU string :- ${source.result?.originalMessage}`)
      );
      console.log(kleur.magenta(`Object path :- ${path}`));
      console.log(
        `Error :- ${
          source.result?.errorMessage && kleur.red(source.result?.errorMessage)
        }`
      );
      console.log(`Location :- ${JSON.stringify(source.result?.location)}\n`);
    }
  } else {
    // For object, iterate over and check string validation result
    // Update the path to show proper error path in a nested object
    for (let [key, value] of Object.entries(source)) {
      _printObjectValidationRec(value, `${path}.${key}`);
    }
  }
}

function printObjectValidation(validationResult: ObjectValidationResult) {
  for (let [key, value] of Object.entries(validationResult)) {
    _printObjectValidationRec(value, key);
  }
}

function printFileValidation(fileValidationResult: FileValidationResult, verbose: boolean = false) {
  if (fileValidationResult.isValid && !verbose) {
    return;
  }
  console.log(
    kleur.black().bgGreen(`Validating file :- ${fileValidationResult.fileName}`)
  );
  console.log('\n');
  printObjectValidation(
    fileValidationResult.validationResult as ObjectValidationResult
  );
  console.log(kleur.black().bgGreen(`Done!!!`));
  console.log('\n');
}

function printDirectoryValidation(
  directoryValidationResult: FileValidationResult[],
  verbose: boolean = false
) {
  directoryValidationResult.forEach((value) => printFileValidation(value, verbose));
}

export {
  printStringValidation,
  printObjectValidation,
  printFileValidation,
  printDirectoryValidation
};
