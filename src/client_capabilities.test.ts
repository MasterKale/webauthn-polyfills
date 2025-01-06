import { assertObjectMatch } from '@std/assert';
import { describe, it } from '@std/testing/bdd';

import { prepareGetClientCapabilities } from './client_capabilities.ts';

describe('getClientCapabilities', () => {
  it('iOS 17.5 Safari 17.5 returns all `false` and `undefined`', async () => {
    const ua =
      'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1';
    const PublicKeyCredential = {
      getClientCapabilities: async () => {
        return {
          conditionalCreate: true,
          conditionalMediation: true,
          hybridTransport: true,
          passkeyPlatformAuthenticator: true,
          relatedOrigins: true,
          signalAllAcceptedCredentials: false,
          signalCurrentUserDetails: false,
          signalUnknownCredential: false,
          userVerifyingPlatformAuthenticator: true,
        };
      },
    };
    const capabilities = await prepareGetClientCapabilities(ua);
    assertObjectMatch(capabilities, {
      conditionalCreate: true,
      conditionalGet: true,
      hybridTransport: true,
      passkeyPlatformAuthenticator: true,
      relatedOrigins: true,
      signalAllAcceptedCredentials: false,
      signalCurrentUserDetails: false,
      signalUnknownCredential: false,
      userVerifyingPlatformAuthenticator: true,
    });
  });
});
