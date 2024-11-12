import { UAParser } from 'ua-parser-js';

/** */
export class Base64URL {
  static encode(buffer: ArrayBuffer) {
    const base64 = globalThis.btoa(
      String.fromCharCode(...new Uint8Array(buffer)),
    );
    return base64.replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
  }

  static decode(base64url: string) {
    const base64 = base64url.replace(/-/g, '+').replace(/_/g, '/');
    const binStr = globalThis.atob(base64);
    const bin = new Uint8Array(binStr.length);
    for (let i = 0; i < binStr.length; i++) {
      bin[i] = binStr.charCodeAt(i);
    }
    return bin.buffer;
  }
}

/** */
if (globalThis.PublicKeyCredential) {
  const uap = new UAParser();
  const browser = uap.getBrowser();

  if (!browser?.major || !browser?.name) {
    throw new Error('Browser major version not found.');
  }

  const browserName = browser.name;
  const browserVer = parseFloat(
    browser.version.replace(/^([0-9]+\.[0-9]+).*$/, '$1'),
  );
  const engine = uap.getEngine();
  const isSafari = browserName?.indexOf('Safari') > -1;

  if (!engine?.version || !engine?.name) {
    throw new Error('Engine version not found.');
  }

  const engineName = engine.name;
  const engineVer = parseFloat(
    engine.version.replace(/^([0-9]+\.[0-9]+)\.*$/, '$1'),
  );

  // @ts-ignore: We're polyfilling this, so ignore whether TS knows about this or not
  if (!globalThis.PublicKeyCredential?.parseCreationOptionsFromJSON) {
    Object.defineProperty(PublicKeyCredential, 'parseCreationOptionsFromJSON', {
      value: (
        options: PublicKeyCredentialCreationOptions,
      ) => {
        const user = {
          ...options.user,
          id: Base64URL.decode(options.user.id),
        };
        const challenge = Base64URL.decode(options.challenge);
        const excludeCredentials = options.excludeCredentials?.map((cred) => {
          return {
            ...cred,
            id: Base64URL.decode(cred.id),
          };
        }) ?? [];
        return {
          ...options,
          user,
          challenge,
          excludeCredentials,
        };
      },
    });
    // PublicKeyCredential.parseCreationOptionsFromJSON = ;
  }

  // @ts-ignore: We're polyfilling this, so ignore whether TS knows about this or not
  if (!globalThis.PublicKeyCredential?.parseRequestOptionsFromJSON) {
    // @ts-ignore: Begin polyfill
    PublicKeyCredential.parseRequestOptionsFromJSON = (options) => {
      const challenge = Base64URL.decode(options.challenge);
      const allowCredentials = options.allowCredentials?.map((cred) => {
        return {
          ...cred,
          id: Base64URL.decode(cred.id),
        };
      }) ?? [];
      return {
        ...options,
        allowCredentials,
        challenge,
      } as PublicKeyCredentialRequestOptions;
    };
  }

  // @ts-ignore: We're polyfilling this, so ignore whether TS knows about this or not
  if (!globalThis.PublicKeyCredential.prototype.toJSON) {
    // @ts-ignore: Begin polyfill
    PublicKeyCredential.prototype.toJSON = function () {
      try {
        // @ts-ignore
        const id = this.id;
        const rawId = Base64URL.encode(this.rawId);
        const authenticatorAttachment = this.authenticatorAttachment;
        const clientExtensionResults = {};
        // @ts-ignore
        const type = this.type;
        // This is authentication.
        // @ts-ignore
        if (this.response.signature) {
          return {
            id,
            rawId,
            response: {
              authenticatorData: Base64URL.encode(
                this.response.authenticatorData,
              ),
              clientDataJSON: Base64URL.encode(this.response.clientDataJSON),
              signature: Base64URL.encode(this.response.signature),
              userHandle: Base64URL.encode(this.response.userHandle),
            },
            authenticatorAttachment,
            clientExtensionResults,
            type,
          } as AuthenticationResponseJSON;
        } else {
          return {
            id,
            rawId,
            response: {
              clientDataJSON: Base64URL.encode(this.response.clientDataJSON),
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
      } catch (error) {
        console.error(error);
        throw error;
      }
    };
  }

  if (
    // @ts-ignore: We're polyfilling this, so ignore whether TS knows about this or not
    !PublicKeyCredential.getClientCapabilities ||
    // If this is Safari 17.4+, there's a spec glitch.
    (isSafari && browserVer >= 17.4)
  ) {
    // @ts-ignore: Begin polyfill
    PublicKeyCredential.getClientCapabilities = async () => {
      let conditionalCreate = false;
      let conditionalGet = false;
      let hybridTransport = false;
      let passkeyPlatformAuthenticator = false;
      let userVerifyingPlatformAuthenticator = false;
      let relatedOrigins = false;
      let signalAllAcceptedCredentials = false;
      let signalCurrentUserDetails = false;
      let signalUnknownCredential = false;
      if (
        PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable &&
        PublicKeyCredential.isConditionalMediationAvailable
      ) {
        // Are UVPAA and conditional UI available on this browser?
        const results = await Promise.all([
          PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable(),
          PublicKeyCredential.isConditionalMediationAvailable(),
        ]);
        userVerifyingPlatformAuthenticator = results[0];
        conditionalGet = results[1];
      }
      // @ts-ignore
      if (PublicKeyCredential.signalAllAcceptedCredentials) {
        signalAllAcceptedCredentials = true;
      }
      // @ts-ignore
      if (PublicKeyCredential.signalCurrentUserDetails) {
        signalCurrentUserDetails = true;
      }
      // @ts-ignore
      if (PublicKeyCredential.signalUknownCredential) {
        signalUnknownCredential = true;
      }

      // `conditionalCreate` is `true` on Safari 18+
      if (isSafari && browserVer >= 18) {
        conditionalCreate = true;
      }
      // `hybridTransport` is `true` on Firefox 119+, Chromium 108+ and Safari 16+
      if (
        (engineName === 'Blink' && engineVer >= 108) ||
        (browserName === 'Firefox' && browserVer >= 119) ||
        (isSafari && browserVer >= 16)
      ) {
        hybridTransport = true;
      }
      // `passkeyPlatformAuthenticator` is `true` if `hybridTransport` or `userVerifyingPlatformAuthenticator` is `true`.
      if (hybridTransport || userVerifyingPlatformAuthenticator) {
        passkeyPlatformAuthenticator = true;
      }
      // `relatedOrigins` is `true` on Safari 18+ and Chromium 128+
      if (
        (isSafari && browserVer >= 18) ||
        (engineName === 'Blink' && engineVer >= 128)
      ) {
        relatedOrigins = true;
      }
      return {
        conditionalCreate,
        conditionalGet,
        hybridTransport,
        passkeyPlatformAuthenticator,
        userVerifyingPlatformAuthenticator,
        relatedOrigins,
        signalAllAcceptedCredentials,
        signalCurrentUserDetails,
        signalUnknownCredential,
      };
    };
  }
}
