# webauthn-polyfills

Polyfills for advanced WebAuthn methods not yet supported in evergreen browsers.

A polyfill is a piece of code used to provide modern functionality on older
browsers that do not natively support it.

## Installation

This package can be installed from NPM:

```
npm install webauthn-polyfills
```

This package is also available from JSR.io:

```
deno add jsr:@passkeys/webauthn-polyfills
```

```
npx jsr add @passkeys/webauthn-polyfills
```

## Supported APIs

Just by importing webauthn-polyfills, your WebAuthn implementation will get the
following support so you don't have to worry about backward compatibility:

### JSON serialization

WebAuthn request and response objects have multiple fields that contain raw
binary data in an ArrayBuffer, such as the credential ID, user ID, or challenge.
If a website wants to use JSON to exchange this data with its server, the binary
data must first be encoded, for example with Base64URL. This adds unnecessary
complexity for developers that want to start using passkeys on their websites.

WebAuthn offers APIs to parse `PublicKeyCredentialCreationOptions` and
`PublicKeyCredentialRequestOptions` WebAuthn request objects directly from JSON,
and serialize the `PublicKeyCredential` response directly into JSON. All
ArrayBuffer-valued fields that carry raw binary data are automatically converted
from or to their Base64URL-encoded values.

- [`PublicKeyCredential.parseCreationOptionsFromJSON`](https://developer.mozilla.org/docs/Web/API/PublicKeyCredential/parseCreationOptionsFromJSON_static)
- [`PublicKeyCredential.parseRequestOptionsFromJSON`](https://developer.mozilla.org/docs/Web/API/PublicKeyCredential/parseRequestOptionsFromJSON_static)
- [`PublicKeyCredential.prototype.toJSON`](https://developer.mozilla.org/docs/Web/API/PublicKeyCredential/toJSON)

### getClientCapabilities()

`getClientCapabilities()` method allows to determine which WebAuthn features are
supported by the user's client. The method returns a list of supported
capabilities, allowing developers to tailor authentication experiences and
workflows based on the client's specific functionality. Expected results include:

- [`PublicKeyCredential.getClientCapabilities`](https://web.dev/articles/webauthn-client-capabilities)

This polyfill returns static results based on the user agent information except
for `hybridTransport` and `passkeyPlatformAuthenticaator`.

## Contributing

**Requirements:**

- Deno v2.1.x

```sh
# Install dependencies
$ deno install

# Run tests once
$ deno task test

# Re-run tests on changes
$ deno task test:watch
```

## Publishing

🚨 **Increment `"version"` in deno.json before proceeding!** 🚨

### NPM

To publish to NPM, run the following command:

```sh
deno task publish:npm
```

### JSR

The following command will publish to JSR.io:

```sh
deno task publish:jsr
```
