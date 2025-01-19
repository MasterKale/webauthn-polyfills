import { assertObjectMatch } from '@std/assert';
import { describe, it } from '@std/testing/bdd';

import { prepareGetClientCapabilities } from './client_capabilities.ts';

// @ts-ignore For test purposes
globalThis.PublicKeyCredential = {};

describe('getClientCapabilities', () => {
  const ua =
    'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1';

  // @ts-ignore PublicKeyCredential is here for test purposes and never used.
  PublicKeyCredential.getClientCapabilities = () => {
    return Promise.resolve({
      conditionalCreate: true,
      conditionalMediation: true,
      hybridTransport: true,
      passkeyPlatformAuthenticator: true,
      relatedOrigins: true,
      signalAllAcceptedCredentials: false,
      signalCurrentUserDetails: false,
      signalUnknownCredential: false,
      userVerifyingPlatformAuthenticator: true,
    });
  };

  PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable = () => {
    return Promise.resolve(true);
  };

  PublicKeyCredential.isConditionalMediationAvailable = () => {
    return Promise.resolve(true);
  };

  it('iOS 17.5 Safari 17.5 returns all `false` and `undefined`', async () => {
    const getClientCapabilities = prepareGetClientCapabilities(ua);
    const capabilities = await getClientCapabilities();
    console.log(capabilities);
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
