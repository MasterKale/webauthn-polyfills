import type {
  AuthenticationResponseJSON,
  AuthenticatorAssertionResponseJSON,
  AuthenticatorAttestationResponseJSON,
  PublicKeyCredentialCreationOptionsJSON,
  PublicKeyCredentialJSON,
  PublicKeyCredentialRequestOptionsJSON,
  RegistrationResponseJSON,
} from '@simplewebauthn/types';

import { Base64URL } from './base64url.ts';

/**
 * Polyfill `PublicKeyCredential.parseCreationOptionsFromJSON`
 *
 * See https://w3c.github.io/webauthn/#sctn-parseCreationOptionsFromJSON
 */
export function parseCreationOptionsFromJSON(options: PublicKeyCredentialCreationOptionsJSON) {
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
}

/**
 * Polyfill `PublicKeyCredential.parseRequestOptionsFromJSON`
 *
 * See https://w3c.github.io/webauthn/#sctn-parseRequestOptionsFromJSON
 */
export function parseRequestOptionsFromJSON(options: PublicKeyCredentialRequestOptionsJSON) {
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
}

/**
 * Polyfill `PublicKeyCredential.prototype.toJSON`
 *
 * See https://w3c.github.io/webauthn/#dom-publickeycredential-tojson
 */
export function toJSON(
  this: PublicKeyCredential,
): PublicKeyCredentialJSON {
  try {
    const id = this.id;
    const rawId = Base64URL.encode(this.rawId);
    const authenticatorAttachment = this.authenticatorAttachment;
    const clientExtensionResults = {};
    const type = this.type;
    // This is authentication.
    if (this.response instanceof AuthenticatorAssertionResponse) {
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
          userHandle: this.response.userHandle
            ? Base64URL.encode(this.response.userHandle)
            : undefined,
        } as AuthenticatorAssertionResponseJSON,
        authenticatorAttachment,
        clientExtensionResults,
        type,
      } as AuthenticationResponseJSON;
    }

    // This is registration.
    if (this.response instanceof AuthenticatorAttestationResponse) {
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
        } as AuthenticatorAttestationResponseJSON,
        authenticatorAttachment,
        clientExtensionResults,
        type,
      } as RegistrationResponseJSON;
    }

    throw new Error('Unexpected object.');
  } catch (error) {
    console.error(error);
    throw error;
  }
}

/**
 * Make sure at least PublicKeyCredential is defined before trying to polyfill anything on it
 */
if (globalThis.PublicKeyCredential) {
  // @ts-ignore: We're polyfilling this, so ignore whether TS knows about this or not
  if (!PublicKeyCredential.parseCreationOptionsFromJSON) {
    Object.defineProperty(PublicKeyCredential, 'parseCreationOptionsFromJSON', {
      value: parseCreationOptionsFromJSON,
    });
  }

  // @ts-ignore: We're polyfilling this, so ignore whether TS knows about this or not
  if (!PublicKeyCredential.parseRequestOptionsFromJSON) {
    Object.defineProperty(PublicKeyCredential, 'parseRequestOptionsFromJSON', {
      value: parseRequestOptionsFromJSON,
    });
  }

  // @ts-ignore: We're polyfilling this, so ignore whether TS knows about this or not
  if (!PublicKeyCredential.prototype.toJSON) {
    Object.defineProperty(PublicKeyCredential.prototype, 'toJSON', {
      value: toJSON,
    });
  }
}
