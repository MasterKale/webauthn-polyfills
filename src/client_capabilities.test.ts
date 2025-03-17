import { assertObjectMatch } from '@std/assert';
import { beforeEach, describe, it } from '@std/testing/bdd';

import { applyPolyfill } from './client_capabilities.ts';

declare var PublicKeyCredential: typeof globalThis.PublicKeyCredential & {
  getClientCapabilities(): Promise<any>;
};

describe('getClientCapabilities', () => {
  beforeEach(() => {
    // @ts-ignore For test purposes
    globalThis.PublicKeyCredential = {};

    PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable = () => {
      return Promise.resolve(true);
    };

    PublicKeyCredential.isConditionalMediationAvailable = () => {
      return Promise.resolve(true);
    };
  });

  it('iOS 17.5 Safari 17.5 returns `conditionalGet` instead of `conditionalMediation`', async () => {
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

    const ua =
      'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1';
    applyPolyfill(ua);
    const capabilities = await PublicKeyCredential.getClientCapabilities();
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

  it('Polyfill is not applied in Chrome where getClientCapabilities exists', async () => {
    PublicKeyCredential.getClientCapabilities = () => {
      return Promise.resolve({
        'conditionalCreate': false,
        'conditionalGet': true,
        'extension:appid': true,
        'extension:appidExclude': true,
        'extension:credBlob': true,
        'extension:credProps': true,
        'extension:credentialProtectionPolicy': true,
        'extension:enforceCredentialProtectionPolicy': true,
        'extension:getCredBlob': true,
        'extension:hmacCreateSecret': true,
        'extension:largeBlob': true,
        'extension:minPinLength': true,
        'extension:payment': true,
        'extension:prf': true,
        'hybridTransport': true,
        'passkeyPlatformAuthenticator': true,
        'relatedOrigins': true,
        'signalAllAcceptedCredentials': true,
        'signalCurrentUserDetails': true,
        'signalUnknownCredential': true,
        'userVerifyingPlatformAuthenticator': true,
      });
    };

    const ua =
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36';
    applyPolyfill(ua);
    const capabilities = await PublicKeyCredential.getClientCapabilities();
    assertObjectMatch(capabilities, {
      'conditionalCreate': false,
      'conditionalGet': true,
      'extension:appid': true,
      'extension:appidExclude': true,
      'extension:credBlob': true,
      'extension:credProps': true,
      'extension:credentialProtectionPolicy': true,
      'extension:enforceCredentialProtectionPolicy': true,
      'extension:getCredBlob': true,
      'extension:hmacCreateSecret': true,
      'extension:largeBlob': true,
      'extension:minPinLength': true,
      'extension:payment': true,
      'extension:prf': true,
      'hybridTransport': true,
      'passkeyPlatformAuthenticator': true,
      'relatedOrigins': true,
      'signalAllAcceptedCredentials': true,
      'signalCurrentUserDetails': true,
      'signalUnknownCredential': true,
      'userVerifyingPlatformAuthenticator': true,
    });
  });
});
