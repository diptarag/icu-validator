# icu-validator

Validate a data source if all strings in the data source conforms to ICU standard.
Supports -
* Individual text
* Object of key value pair where value corresponds to texts
* A JSON file path
* A directory path contaning JSON files

## Usage

Install using yarn -
```sh
yarn add icu-validator -D
```
or using npm
```sh
npm install icu-validator --save-dev
```

### Import or require the module

```javascript
// Using ESM
import { validate, validateFile, validateDirectory } from 'icu-validator';

// Using CJS
const { validate, validateFile, validateDirectory } = require('icu-validator');
```

### Basic use case - validating a string

```javascript
const { validate } = require('icu-validator');

const validationResult = validate('Hello {{name}}, how are you?');
/**
 * {
 *  "__icu_validator_error":true,
 *  "result": {
 *    "errorMessage":"MALFORMED_ARGUMENT",
 *    "originalMessage":"Hello {{name}}, how are you?",
 *    "location": {
 *      "start": { "offset":6,"line":1,"column":7 },
 *      "end": { "offset":7,"line":1,"column":8 }
 *    }
 *  }
 * }
 **/

const validationResult = validate('Hello {name}, how are you?');
/**
 * { "__icu_validator_error": false }
 **/
```

You can pretty print the errors by passing a flag ```prettyPrint: true```
```javascript
const validationResult = validate('Hello {{name}}, how are you?', { prettyPrint: true });
```

### Validating an object of key value pairs

```javascript
const obj = {
  "welcome": "Hello {name}, how are you?",
  "examples": {
    "pluralization": "Hi {name}, you have {{numProducts, plural, =0 {no items} =1 {one item} other {# items}} in cart"
  }
};

validate(obj, { prettyPrint: true });

/**
Invalid ICU string :- Hi {name}, you have {{numProducts, plural, =0 {no items} =1 {one item} other {# items}} in cart
Object path :- examples.pluralization
Error :- MALFORMED_ARGUMENT
Location :- {"start":{"offset":20,"line":1,"column":21},"end":{"offset":21,"line":1,"column":22}}
**/
```

### Validating a JSON file or a directory containing many JSON files

Validate method does accept a file or directory path as first argument. But one very important thing to keep in mind - **the validate method is completely sync**, so all file & directory read operations will be sync.
It is recommended to use dedicated ```validateFile``` and ```validateDirectory``` async methods.

```javascript
validateFile(filePath).then((result) => {
  console.log(JSON.stringify(result));
});

validateDirectory(directoryPath).then((result) => {
  console.log(JSON.stringify(result));
});
```

Try ```prettyPrint: true``` if you want to show the errors on screen

## Options
```validate```, ```validateFile``` and ```validateDirectory``` take a 2nd argument - ```options``` to customize the output format and validation rules/

```javascript
validate(source: string | object, options: object)
validateFile(filePath: string, options: object)
validateDirectory(directoryPath: string, options: object)
```

Options include -

### `prettyPrint` - default (`false`)
Print the validation result and errors in console.

### `ignoreTransTag` - default (`false`)
If you are using `react-i18next` with ICU, you will encounter situations where you need to externalize HTML elements. For react-i18next, the recommended method is [Trans component](https://react.i18next.com/latest/trans-component). The externalized string resembles a format - ```Please click <0>here</0>```. These are usually termed as invalid strings. Use this option if you want to ignore such tags from validation rule.

### `parseOptions`
Under the hood, ```icu-validator``` uses ```formatjs``` parser. You can customize the validation rules by customizing the parser -
#### ``ignoreTag``
Whether to treat HTML/XML tags as string literal
#### ``requiresOtherClause``
Should ```select```, ```selectordinal```, and ```plural``` arguments always include the ```other``` case clause
#### ``shouldParseSkeletons``
Whether to parse number/datetime skeleton into Intl.NumberFormatOptions and Intl.DateTimeFormatOptions, respectively.
#### ``captureLocation``
Capture location info in AST
#### ``locale``
Instance of Intl.Locale to resolve locale-dependent skeleton

