// @deno-types="npm:@types/ua-parser-js@^0.7.39"
import { UAParser } from 'ua-parser-js';
import type {
  PublicKeyCredentialCreationOptionsJSON,
  PublicKeyCredentialRequestOptionsJSON,
} from '@simplewebauthn/types';

import { Base64URL } from './base64url.ts';

/**
 * Make sure at least PublicKeyCredential is defined before trying to polyfill anything on it
 */
if (globalThis.PublicKeyCredential) {
  const uap = new UAParser();
  const browser = uap.getBrowser();

  if (!browser?.major || !browser?.name) {
    throw new Error('Browser major version not found.');
  }

  const browserName = browser.name;
  const browserVer = parseInt(browser.major);
  const engine = uap.getEngine();

  if (!engine?.version || !engine?.name) {
    throw new Error('Engine version not found.');
  }
  const engineName = engine.name;
  const engineVer = parseInt(engine.version.replace(/^([0-9]+)\.*$/, '$1'));

  const isWebkit = engineName?.indexOf('WebKit') > -1;

  /**
   * Polyfill `PublicKeyCredential.parseCreationOptionsFromJSON`
   *
   * See https://w3c.github.io/webauthn/#sctn-parseCreationOptionsFromJSON
   */
  // @ts-ignore: We're polyfilling this, so ignore whether TS knows about this or not
  if (!PublicKeyCredential.parseCreationOptionsFromJSON) {
    Object.defineProperty(PublicKeyCredential, 'parseCreationOptionsFromJSON', {
      value: (options: PublicKeyCredentialCreationOptionsJSON) => {
        const user = {
          ...options.user,
          id: Base64URL.decode(options.user.id),
        };
        const challenge = Base64URL.decode(options.challenge);
        const excludeCredentials = options.excludeCredentials?.map((cred) => {
          return {
            ...cred,
            id: Base64URL.decode(cred.id),
            transports: cred.transports as AuthenticatorTransport[] | undefined,
          };
        }) ?? [];

        const toReturn: PublicKeyCredentialCreationOptions = {
          ...options,
          user,
          challenge,
          excludeCredentials,
        };

        return toReturn;
      },
    });
  }

  /**
   * Polyfill `PublicKeyCredential.parseRequestOptionsFromJSON`
   *
   * See https://w3c.github.io/webauthn/#sctn-parseRequestOptionsFromJSON
   */
  // @ts-ignore: We're polyfilling this, so ignore whether TS knows about this or not
  if (!PublicKeyCredential.parseRequestOptionsFromJSON) {
    Object.defineProperty(PublicKeyCredential, 'parseRequestOptionsFromJSON', {
      value: (options: PublicKeyCredentialRequestOptionsJSON) => {
        const challenge = Base64URL.decode(options.challenge);
        const allowCredentials = options.allowCredentials?.map((cred) => {
          return {
            ...cred,
            id: Base64URL.decode(cred.id),
            transports: cred.transports as AuthenticatorTransport[] | undefined,
          };
        }) ?? [];

        const toReturn: PublicKeyCredentialRequestOptions = {
          ...options,
          allowCredentials,
          challenge,
        };

        return toReturn;
      },
    });
  }

  /**
   * Polyfill `PublicKeyCredential.prototype.toJSON`
   *
   * See https://w3c.github.io/webauthn/#dom-publickeycredential-tojson
   */
  // @ts-ignore: We're polyfilling this, so ignore whether TS knows about this or not
  if (!PublicKeyCredential.prototype.toJSON) {
    Object.defineProperty(PublicKeyCredential.prototype, 'toJSON', {
      value: function () {
        try {
          const id = this.id;
          const rawId = Base64URL.encode(this.rawId);
          const authenticatorAttachment = this.authenticatorAttachment;
          const clientExtensionResults = {};
          const type = this.type;
          // This is authentication.
          if (this.response.signature) {
            return {
              id,
              rawId,
              response: {
                authenticatorData: Base64URL.encode(
                  this.response.authenticatorData,
                ),
                clientDataJSON: Base64URL.encode(
                  this.response.clientDataJSON,
                ),
                signature: Base64URL.encode(this.response.signature),
                userHandle: Base64URL.encode(this.response.userHandle),
              },
              authenticatorAttachment,
              clientExtensionResults,
              type,
            };
          } else {
            return {
              id,
              rawId,
              response: {
                clientDataJSON: Base64URL.encode(
                  this.response.clientDataJSON,
                ),
                attestationObject: Base64URL.encode(
                  this.response.attestationObject,
                ),
                transports: this.response?.getTransports() || [],
              },
              authenticatorAttachment,
              clientExtensionResults,
              type,
            };
          }
        } catch (error) {
          console.error(error);
          throw error;
        }
      },
    });
  }

  /**
   * Polyfill `PublicKeyCredential.getClientCapabilities`
   *
   * See https://w3c.github.io/webauthn/#sctn-getClientCapabilities
   */
  if (
    // @ts-ignore: We're polyfilling this, so ignore whether TS knows about this or not
    !PublicKeyCredential.getClientCapabilities ||
    // If this is Safari 17.4+, there's a spec glitch.
    (isWebkit && browserVer >= 17.4)
  ) {
    Object.defineProperty(PublicKeyCredential, 'getClientCapabilities', {
      value: async () => {
        let conditionalCreate = false;
        let conditionalGet = false;
        let hybridTransport = undefined;
        let passkeyPlatformAuthenticator = false;
        let userVerifyingPlatformAuthenticator = false;
        let relatedOrigins = false;
        let signalAllAcceptedCredentials = false;
        let signalCurrentUserDetails = false;
        let signalUnknownCredential = false;

        // @ts-ignore: We're polyfilling this, so ignore whether TS knows about this or not
        const capabilities = PublicKeyCredential.getClientCapabilities && await PublicKeyCredential.getClientCapabilities();

        if (
          PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable &&
          PublicKeyCredential.isConditionalMediationAvailable
        ) {
          // Are UVPAA and conditional UI available on this browser?
          const results = await Promise.all([
            PublicKeyCredential
              .isUserVerifyingPlatformAuthenticatorAvailable(),
            PublicKeyCredential.isConditionalMediationAvailable(),
          ]);
          userVerifyingPlatformAuthenticator = results[0];
          conditionalGet = results[1];
        }

        // @ts-ignore: It's okay if this doesn't exist
        if (typeof PublicKeyCredential.signalAllAcceptedCredentials === 'function') {
          signalAllAcceptedCredentials = true;
        }

        // @ts-ignore: It's okay if this doesn't exist
        if (typeof PublicKeyCredential.signalCurrentUserDetails === 'function') {
          signalCurrentUserDetails = true;
        }

        // @ts-ignore: It's okay if this doesn't exist
        if (typeof PublicKeyCredential.signalUknownCredential === 'function') {
          signalUnknownCredential = true;
        }

        // `conditionalCreate` is `true` on Safari 15+
        if (browserName === 'Safari' && browserVer >= 18) {
          conditionalCreate = true;
        }

        // `hybridTransport` is `true` on Firefox 119+, Chromium 108+ and Safari 16+
        if (capabilities) {
          hybridTransport = capabilities.hybridTransport;
        }

        // `passkeyPlatformAuthenticator` is `true` if `hybridTransport` or `userVerifyingPlatformAuthenticator` is `true`.
        if (hybridTransport || userVerifyingPlatformAuthenticator) {
          passkeyPlatformAuthenticator = true;
        }

        // `relatedOrigins` is `true` on Chromium 128+ or Safari 18+
        if ((engineName === 'Blink' && engineVer >= 128) ||
            (isWebkit && browserVer >= 18)) {
          relatedOrigins = true;
        }

        return {
          conditionalCreate,
          conditionalGet,
          hybridTransport,
          passkeyPlatformAuthenticator,
          relatedOrigins,
          signalAllAcceptedCredentials,
          signalCurrentUserDetails,
          signalUnknownCredential,
          userVerifyingPlatformAuthenticator,
        };
      },
    });
  }
}
