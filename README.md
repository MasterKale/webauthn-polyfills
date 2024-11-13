# webauthn-polyfills

Polyfills for advanced WebAuthn methods not yet supported in evergreen browsers.

## Installation

This package can be installed from NPM:

```
npm install webauthn-polyfills
```

This package is also available from JSR.io:

```
npx jsr add webauthn-polyfills
deno add jsr:webauthn-polyfills
```

## Contributing

**Requirements:**

- Deno v2.0.x

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
$ deno task publish:npm
```

### JSR

The following command will publish to JSR.io:

```sh
$ deno task publish:jsr
```
