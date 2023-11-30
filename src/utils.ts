import { StringValidationResult } from "./types";

function sanitizeInputText(text: string, ignoreTransTag: boolean) {
  if (!ignoreTransTag) {
    return text;
  }

  // The regex matches <0><1><2></0></1></2> etc
  return text.replace(/<\/?(\d+)>/g, (match, number) => {
    // As both <d> & </d> are matched
    // With the split we retrieve either < or </ as prefix
    const prefix = match.split(number)[0];
    return `${prefix}Trans${number}>`;
  });
}

function sanitizeOutputText(text: string, ignoreTransTag: boolean) {
  if (!ignoreTransTag) {
    return text;
  }

  // The regex matches <Trans0><Trans1><Trans2></Trans0></Trans1></Trans2> etc
  return text.replace(/<\/?Trans(\d+)>/g, (match, number) => {
    // As both <Transd> & </Transd> are matched
    // With the split we retrieve either < or </ as prefix
    const prefix = match.split(`Trans${number}`)[0];
    return `${prefix}${number}>`;
  });
}

function isStringValidationResult(obj: any): obj is StringValidationResult {
  return (
    obj !== null && typeof obj === 'object' && '__icu_validator_error' in obj
  );
}

function isInvalidAtAnyLevel(obj: any, key: string) {
  for (const prop in obj) {
    if (obj.hasOwnProperty(prop)) {
      if (prop === key && obj[prop] === true) {
        return true;
      }

      if (typeof obj[prop] === 'object' && obj[prop] !== null) {
        // Recursively check the nested object
        if (isInvalidAtAnyLevel(obj[prop], key)) {
          return true; // Key found and its value is true in the nested object
        }
      }
    }
  }

  return false; // Key not found or its value is not true at any level
}

export { sanitizeInputText, sanitizeOutputText, isStringValidationResult, isInvalidAtAnyLevel };
