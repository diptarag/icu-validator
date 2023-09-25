function sanitizeInputText (text: string, ignoreTransTag: boolean) {
  if (!ignoreTransTag) {
    return text;
  }

  // The regex matches <0><1><2></0></1></2> etc
  return text.replace(/<\/?(\d+)>/g, (match, number) => {
    // As both <d> & </d> are matched
    // With the split we retrieve either < or </ as prefix
    const prefix = match.split(number)[0];
    return `${prefix}Trans${number}>`
  });
}

function sanitizeOutputText (text: string, ignoreTransTag: boolean) {
  if (!ignoreTransTag) {
    return text;
  }

  // The regex matches <Trans0><Trans1><Trans2></Trans0></Trans1></Trans2> etc
  return text.replace(/<\/?Trans(\d+)>/g, (match, number) => {
    // As both <Transd> & </Transd> are matched
    // With the split we retrieve either < or </ as prefix
    const prefix = match.split(`Trans${number}`)[0];
    return `${prefix}${number}>`
  });
}

export { sanitizeInputText, sanitizeOutputText };

