import type {
  AuthenticationResponseJSON,
  PublicKeyCredentialCreationOptionsJSON,
  PublicKeyCredentialRequestOptionsJSON,
  RegistrationResponseJSON,
} from '@simplewebauthn/types';
import { assertObjectMatch } from '@std/assert';
import { describe, it } from '@std/testing/bdd';

import {
  parseCreationOptionsFromJSON,
  parseRequestOptionsFromJSON,
  toJSON,
} from './json_serialization.ts';
import { Base64URL } from './base64url.ts';
import {} from '@simplewebauthn/types';

describe('PublicKeyCredential.parseCreationOptionsFromJSON', () => {
  const original = {
    'challenge': 'AAAAAA',
    'rp': {
      'name': 'WebAuthn Demo',
      'id': 'try-webauthn.appspot.com',
    },
    'user': {
      'id': 'AAAAAA',
      'name': 'chromedemojp@gmail.com',
      'displayName': 'Janelle Murells',
    },
    'pubKeyCredParams': [{
      'alg': -8,
      'type': 'public-key',
    }, {
      'alg': -7,
      'type': 'public-key',
    }, {
      'alg': -257,
      'type': 'public-key',
    }],
    'timeout': 300000,
    'attestation': 'none',
    'excludeCredentials': [
      {
        'id': 'AAAAAA',
        'type': 'public-key',
        'transports': [
          'cable',
          'internal',
        ],
      },
    ],
    'authenticatorSelection': {
      'authenticatorAttachment': 'platform',
      'residentKey': 'required',
      'userVerification': 'required',
      'requireResidentKey': true,
    },
    'extensions': {
      'credProps': true,
    },
    'hints': [],
  } as PublicKeyCredentialCreationOptionsJSON;
  const expected = {
    ...original,
    'challenge': (new Uint8Array([0, 0, 0, 0])).buffer,
    'user': {
      'id': (new Uint8Array([0, 0, 0, 0])).buffer,
    },
    'excludeCredentials': [
      {
        'id': (new Uint8Array([0, 0, 0, 0])).buffer,
        'type': 'public-key',
        'transports': [
          'cable',
          'internal',
        ],
      },
    ],
  } as PublicKeyCredentialCreationOptions;
  const target = parseCreationOptionsFromJSON(original);
  it('should parse CreationOptions', () => {
    assertObjectMatch(target, expected);
  });
});

describe('PublicKeyCredential.parseRequestOptionsFromJSON', () => {
  const original = {
    'challenge': 'AAAAAA',
    'rpId': 'try-webauthn.appspot.com',
    'timeout': 300000,
    'allowCredentials': [
      {
        'id': 'AAAAAA',
        'type': 'public-key',
        'transports': [
          'cable',
          'internal',
        ],
      },
    ],
    'userVerification': 'required',
  } as PublicKeyCredentialRequestOptionsJSON;
  const expected = {
    ...original,
    'challenge': (new Uint8Array([0, 0, 0, 0])).buffer,
    'allowCredentials': [
      {
        'id': (new Uint8Array([0, 0, 0, 0])).buffer,
        'type': 'public-key',
        'transports': [
          'cable',
          'internal',
        ],
      },
    ],
  } as PublicKeyCredentialRequestOptions;
  const target = parseRequestOptionsFromJSON(original);
  it('should parse RequestOptions', () => {
    assertObjectMatch(target, expected);
  });
});

describe('Registration PublicKeyCredential.prototype.toJSON', () => {
  const id = 'BxYpj3rs5WGW8UVnXsmMzg';
  const clientDataJSON =
    'eyJ0eXBlIjoid2ViYXV0aG4uY3JlYXRlIiwiY2hhbGxlbmdlIjoiNkM0QUptNmJyTVJwSF9JZVhDVmtHTTUydnVwTy14Y1huNldlcWIyVjJtTSIsIm9yaWdpbiI6ImFuZHJvaWQ6YXBrLWtleS1oYXNoOmd4N3NxX3B4aHhocklRZEx5ZkcwcHhLd2lKN2hPazJESlE0eHZLZDQzOFEiLCJhbmRyb2lkUGFja2FnZU5hbWUiOiJjb20uZmlkby5leGFtcGxlLmZpZG8yYXBpZXhhbXBsZSJ9';
  const attestationObject =
    'o2NmbXRkbm9uZWdhdHRTdG10oGhhdXRoRGF0YVkBMA11_MVj_ad52y40PupImIh1i3hUnUk6T9vqHNlqoxzE3QAAAAAAAAAAAAAAAAAAAAAAAAAAABAHFimPeuzlYZbxRWdeyYzOpQECAyYgASFYIPLEylOIRiI7z7q6zuYjWB9TcOj9yNwmawogQJ4ZKpNAIlggd9ZqIjd30p1tIU6A8ue5wEZl9q_AsKR_leaHFZ_bwWmhbGRldmljZVB1YktleViMpmNkcGtYTaUBAgMmIAEhWCBNwZidDC8QQNAffsFaxUKxTbVLxepdV-1_azg-u0-rsCJYIFtht9l1L8g2hqQOo8omnBd9fRj2byJzn1JQqnp19oVbY2ZtdGRub25lZW5vbmNlQGVzY29wZQBmYWFndWlkUAAAAAAAAAAAAAAAAAAAAABnYXR0U3RtdKA=';
  const original = {
    authenticatorAttachment: 'platform',
    id,
    rawId: Base64URL.decode(id),
    response: {
      clientDataJSON: Base64URL.decode(clientDataJSON),
      attestationObject: Base64URL.decode(attestationObject),
    } as AuthenticatorAttestationResponse,
    type: 'public-key',
    transports: [],
    getClientExtensionResults: () => ({}),
  } as PublicKeyCredential;
  const expected = {
    ...original,
    response: {
      clientDataJSON,
      attestationObject,
    },
    rawId: id,
    clientExtensionResults: {},
  } as RegistrationResponseJSON;
  const target = toJSON.bind(original)();
  it('should parse RequestOptions', () => {
    assertObjectMatch(target, expected);
  });
});

describe('Authentication PublicKeyCredential.prototype.toJSON', () => {
  const id = 'BxYpj3rs5WGW8UVnXsmMzg';
  const clientDataJSON =
    'eyJ0eXBlIjoid2ViYXV0aG4uZ2V0IiwiY2hhbGxlbmdlIjoiS05aUmtPRU5KY1dCTzZHX0VjcE1GS2FWRDlham1xNExsZDZJMllJc1c3QSIsIm9yaWdpbiI6ImFuZHJvaWQ6YXBrLWtleS1oYXNoOmd4N3NxX3B4aHhocklRZEx5ZkcwcHhLd2lKN2hPazJESlE0eHZLZDQzOFEiLCJhbmRyb2lkUGFja2FnZU5hbWUiOiJjb20uZmlkby5leGFtcGxlLmZpZG8yYXBpZXhhbXBsZSJ9';
  const authenticatorData =
    'DXX8xWP9p3nbLjQ-6kiYiHWLeFSdSTpP2-oc2WqjHMSdAAAAAKFsZGV2aWNlUHViS2V5WIymY2Rwa1hNpQECAyYgASFYIE3BmJ0MLxBA0B9-wVrFQrFNtUvF6l1X7X9rOD67T6uwIlggW2G32XUvyDaGpA6jyiacF319GPZvInOfUlCqenX2hVtjZm10ZG5vbmVlbm9uY2VAZXNjb3BlAGZhYWd1aWRQAAAAAAAAAAAAAAAAAAAAAGdhdHRTdG10oA==';
  const signature =
    'MEUCIF1LvdGHiW5aq25ZrNVUeZOm7pcS_9a172pkO2C6ILE1AiEA8NYg-ZzOgt1pN0Bqv02t7lWCSMn_IPpvKHdT5Mjv75E=';
  const userHandle = 'b2FPajFxcmM4MWo3QkFFel9RN2lEakh5RVNlU2RLNDF0Sl92eHpQYWV5UQ==';
  const original = {
    authenticatorAttachment: 'platform',
    id,
    rawId: Base64URL.decode(id),
    response: {
      clientDataJSON: Base64URL.decode(clientDataJSON),
      authenticatorData: Base64URL.decode(authenticatorData),
      signature: Base64URL.decode(signature),
      userHandle: Base64URL.decode(userHandle),
    } as AuthenticatorAssertionResponse,
    type: 'public-key',
    getClientExtensionResults: () => ({}),
  } as PublicKeyCredential;
  const expected = {
    ...original,
    response: {
      clientDataJSON,
      authenticatorData,
      signature,
      userHandle,
    },
    rawId: id,
    clientExtensionResults: {},
  } as AuthenticationResponseJSON;
  const target = toJSON.bind(original)();
  it('should parse RequestOptions', () => {
    assertObjectMatch(target, expected);
  });
});
