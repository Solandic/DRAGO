import { formatClassNames } from '@wix/editor-elements-common-utils';
// @ts-expect-error Untyped module
import { transformHTMLString } from '@wix/santa-core-utils/dist/cjs/coreUtils/core/htmlTransformer';
import semanticClassNames from './WRichText.semanticClassNames';

export const injectTextSemanticClassName = (html: string) => {
  const textSemanticClassNames = formatClassNames(semanticClassNames.text);
  try {
    return transformHTMLString(html, {
      start: (tag: string, attributes: Array<any>, ...args: Array<any>) => {
        const classAttr = attributes.find(attr => attr.name === 'class');
        if (classAttr) {
          classAttr.value += ` ${textSemanticClassNames}`;
          classAttr.escaped += ` ${textSemanticClassNames}`;
        } else {
          attributes.push({
            name: 'class',
            value: textSemanticClassNames,
            escaped: textSemanticClassNames,
          });
        }
        return { tag, attributes, ...args };
      },
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(
      `Failed to inject semanticClass of ${semanticClassNames.text}`,
      error,
    );
    return html;
  }
};
