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

    // If the browser is above macOS Safari 17.4 and below Safari 18.2, or above
    // iOS 17.4 and below iOS 18.2, replace `conditionalMediation` with
    // `conditionalGet`.
    if (version.safari174To182 || version.iOS174To182) {
      // @ts-ignore: We're polyfilling this, so ignore whether TS knows about this or not
      const capabilities = await PublicKeyCredential.getClientCapabilities();

      conditionalCreate = capabilities?.conditionalCreate;
      // Replace `conditionalMediation` with `conditionalGet`.
      conditionalGet = capabilities?.conditionalMediation;
      hybridTransport = capabilities?.hybridTransport;
      passkeyPlatformAuthenticator = capabilities?.passkeyPlatformAuthenticator;
      relatedOrigins = capabilities?.relatedOrigins;
      signalAllAcceptedCredentials = capabilities?.signalAllAcceptedCredentials;
      signalCurrentUserDetails = capabilities?.signalCurrentUserDetails;
      signalUnknownCredential = capabilities?.signalUnknownCredential;
      userVerifyingPlatformAuthenticator = capabilities?.userVerifyingPlatformAuthenticator;

      // Otherwise, `PublicKeyCredential` exists but `getClientCapabilities`
    } else {
      if (PublicKeyCredential?.isUserVerifyingPlatformAuthenticatorAvailable) {
        // Are UVPAA and conditional UI available on this browser?
        userVerifyingPlatformAuthenticator = await PublicKeyCredential
          .isUserVerifyingPlatformAuthenticatorAvailable();
      }

      if (PublicKeyCredential?.isConditionalMediationAvailable) {
        // Are UVPAA and conditional UI available on this browser?
        conditionalGet = await PublicKeyCredential.isConditionalMediationAvailable();
      }

      // @ts-ignore: It's okay if this doesn't exist
      if (PublicKeyCredential?.signalAllAcceptedCredentials) {
        signalAllAcceptedCredentials = true;
      }

      // @ts-ignore: It's okay if this doesn't exist
      if (PublicKeyCredential?.signalCurrentUserDetails) {
        signalCurrentUserDetails = true;
      }

      // @ts-ignore: It's okay if this doesn't exist
      if (PublicKeyCredential?.signalUknownCredential) {
        signalUnknownCredential = true;
      }

      // `conditionalCreate` is `true` on Safari 18+ or Chromium 135+
      conditionalCreate = version.desktopBlink135OrLater || version.iOS18OrLater;

      // `relatedOrigins` is `true` on Chromium 128+ or Safari 18+
      relatedOrigins = version.desktopBlink128OrLater || version.iOS18OrLater;
    }

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

/**
 * Make sure at least PublicKeyCredential is defined before trying to polyfill anything on it
 */
if (globalThis.PublicKeyCredential) {
  // Prepare getClientCapabilities only if `PublicKeyCredential` is available.
  const getClientCapabilities = prepareGetClientCapabilities();

  /**
   * Polyfill `PublicKeyCredential.getClientCapabilities`
   *
   * See https://w3c.github.io/webauthn/#sctn-getClientCapabilities
   */
  // @ts-ignore: We're polyfilling this, so ignore whether TS knows about this or not
  if (!PublicKeyCredential.getClientCapabilities || version.safari174To182 || version.iOS174To182) {
    Object.defineProperty(PublicKeyCredential, 'getClientCapabilities', {
      value: getClientCapabilities,
    });
  }
}
