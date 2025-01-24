import type {
  AuthenticationResponseJSON,
  AuthenticatorAssertionResponse,
  AuthenticatorAssertionResponseJSON,
  AuthenticatorAttestationResponseJSON,
  PublicKeyCredentialCreationOptionsJSON,
  PublicKeyCredentialJSON,
  PublicKeyCredentialRequestOptionsJSON,
  RegistrationResponseJSON,
} from '@simplewebauthn/types';

import { Base64URL } from './base64url.ts';

function isAuthenticatorAssertionResponse(
  value: AuthenticatorResponse,
): value is AuthenticatorAssertionResponse {
  if (typeof value !== 'object') {
    return false;
  }
  if (
    (value as AuthenticatorAssertionResponse)?.authenticatorData === undefined ||
    typeof (value as AuthenticatorAssertionResponse)?.authenticatorData !== 'object'
  ) {
    return false;
  }
  return true;
}

function isAuthenticatorAttestationResponse(
  value: AuthenticatorResponse,
): value is AuthenticatorAttestationResponse {
  if (typeof value !== 'object') {
    return false;
  }
  if (
    (value as AuthenticatorAttestationResponse)?.attestationObject === undefined ||
    typeof (value as AuthenticatorAttestationResponse)?.attestationObject !== 'object'
  ) {
    return false;
  }
  return true;
}

/**
 * Polyfill `PublicKeyCredential.parseCreationOptionsFromJSON`
 *
 * See https://w3c.github.io/webauthn/#sctn-parseCreationOptionsFromJSON
 */
export function parseCreationOptionsFromJSON(
  options: PublicKeyCredentialCreationOptionsJSON,
): PublicKeyCredentialCreationOptions {
  const user = {
    ...options.user,
    id: Base64URL.decode(options.user.id),
  } as PublicKeyCredentialUserEntity;
  const challenge = Base64URL.decode(options.challenge);
  const excludeCredentials = options.excludeCredentials?.map((cred) => {
    return {
      ...cred,
      id: Base64URL.decode(cred.id),
      transports: cred.transports as AuthenticatorTransport[] | undefined,
    } as PublicKeyCredentialDescriptor;
  }) ?? [];

  const toReturn = {
    ...options,
    user,
    challenge,
    excludeCredentials,
  } as PublicKeyCredentialCreationOptions;

  return toReturn;
}

/**
 * Polyfill `PublicKeyCredential.parseRequestOptionsFromJSON`
 *
 * See https://w3c.github.io/webauthn/#sctn-parseRequestOptionsFromJSON
 */
export function parseRequestOptionsFromJSON(
  options: PublicKeyCredentialRequestOptionsJSON,
): PublicKeyCredentialRequestOptions {
  const challenge = Base64URL.decode(options.challenge) as ArrayBuffer;
  const allowCredentials = options.allowCredentials?.map((cred) => {
    return {
      ...cred,
      id: Base64URL.decode(cred.id) as ArrayBuffer,
      transports: cred.transports as AuthenticatorTransport[] | undefined,
    } as PublicKeyCredentialDescriptor;
  }) ?? [];

  const toReturn = {
    ...options,
    allowCredentials,
    challenge,
  } as PublicKeyCredentialRequestOptions;

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
    if (isAuthenticatorAssertionResponse(this.response)) {
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

    if (isAuthenticatorAttestationResponse(this.response)) {
      // This is registration.
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
