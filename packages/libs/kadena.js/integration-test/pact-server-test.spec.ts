// Expects pact server to be running at http://127.0.0.1:9001.
// To run: `$ npm run start:pact`.
// Requires `pact` to be installed: https://github.com/kadena-io/pact

import sign from '../src/crypto/sign';
import type { SendRequestBody } from '../src/fetch/send';
import { send } from '../src/fetch/send';
import type {
  ChainwebNetworkId,
  Command,
  CommandPayload,
} from '../src/util/PactCommand';
import type { SignCommand } from '../src/util/SignCommand';

const network: ChainwebNetworkId = 'development';
const apiHost = 'http://127.0.0.1:9001';
const kp = {
  publicKey: 'ba54b224d1924dd98403f5c751abdd10de6cd81b0121800bf7bdbdcfaec7388d',
  secretKey: '8693e641ae2bbe9ea802c736f42027b03f86afe63cae315e7169c9c496c17332',
};
const nonce = 'step01';
const pactCode =
  '(define-keyset \'k (read-keyset "accounts-admin-keyset"))\n(module system \'k\n  (defun get-system-time ()\n    (time "2017-10-31T12:00:00Z")))\n(get-system-time)';
const envData: object = {
  'accounts-admin-keyset': [
    'ba54b224d1924dd98403f5c751abdd10de6cd81b0121800bf7bdbdcfaec7388d',
  ],
};

const cmd: CommandPayload = {
  networkId: network,
  payload: {
    exec: {
      data: envData,
      code: pactCode,
    },
  },
  signers: [
    {
      pubKey:
        'ba54b224d1924dd98403f5c751abdd10de6cd81b0121800bf7bdbdcfaec7388d',
    },
  ],
  meta: {
    creationTime: 0,
    ttl: 0,
    gasLimit: 0,
    chainId: '0',
    gasPrice: 0,
    sender: '',
  },
  nonce: JSON.stringify(nonce),
};

test('[Pact Server] Makes a send request and retrieve request key', async () => {
  const commandStr = JSON.stringify(cmd);
  const cmdWithOneSignature: SignCommand = sign(commandStr, kp);
  const signedCommand: Command = {
    cmd: commandStr,
    hash: cmdWithOneSignature.hash,
    sigs: [{ sig: cmdWithOneSignature.sig }],
  };
  const sendReq: SendRequestBody = {
    cmds: [signedCommand],
  };

  const actual = await send(sendReq, apiHost);
  const expected = {
    requestKeys: [signedCommand.hash],
  };
  expect(actual).toEqual(expected);
});