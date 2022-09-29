import { parseTemplate } from '../../parsing/parseTemplate';
import { generateTemplates } from '../generateTemplates';

import { readFileSync } from 'fs';
import { join } from 'path';

describe('generateDts', () => {
  it('generates a ts for `Hello, ${name}!`', () => {
    const ts = generateTemplates(
      [
        {
          name: 'hello-name',
          template: { parts: ['Hello, ', '!'], holes: ['name'] },
        },
      ],
      '0.0.1-alpha-test',
    )
      .split(/[\s\n]/)
      .filter((x) => x !== '')
      .join(' ');

    const expected =
      `// generated by pactjs-generator and pactjs-cli@0.0.1-alpha-test
import { buildUnsignedTransaction, ICommandBuilder } from '@kadena/client';

export default {
  "hello-name": (args: {
    "name": string,
  }): ICommandBuilder<{}> => {
    const parts = [
      "Hello, ",
      "!"
    ];
    const holes = [
      "name"
    ];

    return buildUnsignedTransaction(parts, holes, args);
  }
}`
        .split(/[\s\n]/)
        .filter((x) => x !== '')
        .join(' ');

    expect(ts).toBe(expected);
  });

  it('generates a ts for a full template', () => {
    const simpleTransferTpl = parseTemplate(
      readFileSync(
        join(__dirname, '../my-tx-lib/src/simple-transfer.json'),
        'utf8',
      ),
    );

    const safeTransactionTpl = parseTemplate(
      readFileSync(
        join(__dirname, '../my-tx-lib/src/safe-transaction.yaml'),
        'utf8',
      ),
    );

    const ts = generateTemplates(
      [
        {
          name: 'simple-transfer',
          template: simpleTransferTpl,
        },
        {
          name: 'safe-transaction',
          template: safeTransactionTpl,
        },
      ],
      '0.0.1-alpha-test',
    )
      .split(/[\s\n]/)
      .filter((x) => x !== '')
      .join(' ');

    const expected =
      `// generated by pactjs-generator and pactjs-cli@0.0.1-alpha-test
import { buildUnsignedTransaction, ICommandBuilder } from '@kadena/client';
  export default {
    "simple-transfer": (args: {
      "from-acct": string,
      "to-acct": string,
      "amount": string,
      "chain": string,
      "network": string,
      "from-key": string,
    }): ICommandBuilder<{}> => {
      const parts = [
        "{\\n  \\"code\\": \\"(coin.transfer \\\\\\"",
        "\\\\\\" \\\\\\"",
        "\\\\\\" ",
        ")\\",\\n  \\"data\\": null,\\n  \\"publicMeta\\": {\\n    \\"chainId\\": \\"",
        "\\",\\n    \\"sender\\": \\"",
        "\\",\\n    \\"gasLimit\\": 2500,\\n    \\"gasPrice\\": 1e-8,\\n    \\"ttl\\": 600\\n  },\\n  \\"networkId\\": \\"",
        "\\",\\n  \\"signers\\": [\\n    {\\n      \\"public\\": \\"",
        "\\",\\n      \\"caps\\": [\\n        { \\"name\\": \\"coin.GAS\\", \\"args\\": [] },\\n        {\\n          \\"name\\": \\"coin.TRANSFER\\",\\n          \\"args\\": [\\n            \\"",
        "\\",\\n            \\"",
        "\\",\\n            \\"",
        "\\"\\n          ]\\n        }\\n      ]\\n    }\\n  ],\\n  \\"type\\": \\"exec\\"\\n}\\n"
      ];
      const holes = [
        "from-acct",
        "to-acct",
        "amount",
        "chain",
        "from-acct",
        "network",
        "from-key",
        "from-acct",
        "to-acct",
        "amount"
      ];
      return buildUnsignedTransaction(parts, holes, args);
    },
    "safe-transaction": (args: {
      "{from-acct": string,
      "{to-acct": string,
      "amount": string,
      "chain": string,
      "network": string,
      "from-key": string,
    }): ICommandBuilder<{}> => {
      const parts = [
        "code: |-\\n  (coin.transfer \\"",
        "}\\" \\"",
        "}\\" ",
        ")\\ndata:\\npublicMeta:\\n  chainId: \\"",
        "\\"\\n  sender: ",
        "}\\n  gasLimit: 600\\n  gasPrice: 0.00000001\\n  ttl: 7200\\nnetworkId: ",
        "\\nsigners:\\n  - public: ",
        "\\n    caps:\\n      - name: \\"coin.TRANSFER\\"\\n        args: [",
        "}, ",
        "}, ",
        "]\\n      - name: \\"coin.GAS\\"\\n        args: []\\ntype: exec\\n"
      ];
      const holes = [
        "{from-acct",
        "{to-acct",
        "amount",
        "chain",
        "{from-acct",
        "network",
        "from-key",
        "{from-acct",
        "{to-acct",
        "amount"
      ];
      return buildUnsignedTransaction(parts, holes, args);
    }
}`
        .split(/[\s\n]/)
        .filter((x) => x !== '')
        .join(' ');

    expect(ts).toBe(expected);
  });
});
