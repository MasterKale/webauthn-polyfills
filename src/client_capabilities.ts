import { isVersion } from './is_version.ts';

export function prepareGetClientCapabilities(ua: string = '') {
  let version: isVersion;
  try {
    /**
     * Make sure at least PublicKeyCredential is defined before trying to polyfill anything on it
     */
    version = new isVersion(ua);
  } catch {
    console.info('expected exception for the test.');
  }

  return async function () {
    let conditionalCreate: boolean | undefined = false;
    let conditionalGet: boolean | undefined = false;
    // `hybridTransport` is unsupported since it requires Bluetooth
    // detection.
    let hybridTransport: boolean | undefined = undefined;
    // `passkeyPlatformAuthenticator` is unsupported either since
    // `hybridTransport` is unavailable.
    let passkeyPlatformAuthenticator: boolean | undefined = undefined;
    let relatedOrigins: boolean | undefined = false;
    let signalAllAcceptedCredentials: boolean | undefined = false;
    let signalCurrentUserDetails: boolean | undefined = false;
    let signalUnknownCredential: boolean | undefined = false;
    let userVerifyingPlatformAuthenticator: boolean | undefined = false;

    // If this is above macOS Safari 17.4 and below Safari 18.2, or above iOS 17.4 and below iOS 18.2, there's a spec glitch.
    const capabilities = version.safari174To182 || version.iOS174To182
      // @ts-ignore: We're polyfilling this, so ignore whether TS knows about this or not
      ? await PublicKeyCredential.getClientCapabilities()
      : undefined;

    if (PublicKeyCredential?.isUserVerifyingPlatformAuthenticatorAvailable) {
      // Are UVPAA and conditional UI available on this browser?
      userVerifyingPlatformAuthenticator = await PublicKeyCredential
        .isUserVerifyingPlatformAuthenticatorAvailable();
    }

    if (PublicKeyCredential?.isConditionalMediationAvailable) {
      // Are UVPAA and conditional UI available on this browser?
      conditionalGet = await PublicKeyCredential.isConditionalMediationAvailable();
    }

    if (capabilities) {
      hybridTransport = capabilities?.hybridTransport;
      passkeyPlatformAuthenticator = capabilities?.passkeyPlatformAuthenticator;
    }

    // @ts-ignore: It's okay if this doesn't exist
    if (typeof PublicKeyCredential?.signalAllAcceptedCredentials === 'function') {
      signalAllAcceptedCredentials = true;
    }

    // @ts-ignore: It's okay if this doesn't exist
    if (typeof PublicKeyCredential?.signalCurrentUserDetails === 'function') {
      signalCurrentUserDetails = true;
    }

    // @ts-ignore: It's okay if this doesn't exist
    if (typeof PublicKeyCredential?.signalUknownCredential === 'function') {
      signalUnknownCredential = true;
    }

    // `conditionalCreate` is `true` on Safari 18+
    conditionalCreate = capabilities !== undefined
      ? capabilities?.conditionalCreate
      : version.iOS18OrLater
      ? true
      : false;

    // `relatedOrigins` is `true` on Chromium 128+ or Safari 18+
    relatedOrigins = capabilities !== undefined
      ? capabilities?.relatedOrigins
      : version.blink128OrLater || version.iOS18OrLater
      ? true
      : false;

    return Promise.resolve({
      conditionalCreate,
      conditionalGet,
      hybridTransport,
      passkeyPlatformAuthenticator,
      relatedOrigins,
      signalAllAcceptedCredentials,
      signalCurrentUserDetails,
      signalUnknownCredential,
      userVerifyingPlatformAuthenticator,
    });
  };
}

const getClientCapabilities = prepareGetClientCapabilities();

/**
 * Make sure at least PublicKeyCredential is defined before trying to polyfill anything on it
 */
if (globalThis.PublicKeyCredential) {
  /**
   * Polyfill `PublicKeyCredential.getClientCapabilities`
   *
   * See https://w3c.github.io/webauthn/#sctn-getClientCapabilities
   */
  // @ts-ignore: We're polyfilling this, so ignore whether TS knows about this or not
  if (!PublicKeyCredential.getClientCapabilities) {
    Object.defineProperty(PublicKeyCredential, 'getClientCapabilities', {
      value: getClientCapabilities,
    });
  }
}
