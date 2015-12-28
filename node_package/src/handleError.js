import React from 'react';
import ReactDOMServer from 'react-dom/server';

function handleGeneratorFunctionIssue(options) {
  const { e, componentName } = options;

  let msg = '';

  if (componentName) {
    const lastLine =
      'A generator function takes a single arg of props (and the location for react-router) ' +
      'and returns a ReactElement.';

    let shouldBeGeneratorError =
      `ERROR: You failed to specify the option generatorFunction to be true, but the React
component \'${componentName}\' seems to be a generator function.\n${lastLine}`;
    const reMatchShouldBeGeneratorError = /Can't add property context, object is not extensible/;
    if (reMatchShouldBeGeneratorError.test(e.message)) {
      msg += shouldBeGeneratorError + '\n\n';
      console.error(shouldBeGeneratorError);
    }

    shouldBeGeneratorError =
      `ERROR: You specified the option generatorFunction to be true, but the React, but the React
component \'${componentName}\' is not a generator function.\n${lastLine}`;

    const reMatchShouldNotBeGeneratorError = /Cannot call a class as a function/;

    if (reMatchShouldNotBeGeneratorError.test(e.message)) {
      msg += shouldBeGeneratorError + '\n\n';
      console.error(shouldBeGeneratorError);
    }
  }

  return msg;
}

export default (options) => {
  const { e, jsCode, serverSide } = options;

  console.error('Exception in rendering!');

  let msg = handleGeneratorFunctionIssue(options);

  if (jsCode) {
    console.error('JS code was: ' + jsCode);
  }

  if (e.fileName) {
    console.error('location: ' + e.fileName + ':' + e.lineNumber);
  }

  console.error(`message: ${e.message}`);
  console.error(`stack: ${e.stack}`);

  if (serverSide) {
    msg += `Exception in rendering!
${e.fileName ? `\nlocation: ${e.fileName}:` + e.lineNumber : ''}
Message: ${e.message}

${e.stack}`;

    const reactElement = React.createElement('pre', null, msg);
    return ReactDOMServer.renderToString(reactElement);
  }
};