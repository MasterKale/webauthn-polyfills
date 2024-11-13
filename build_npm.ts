/// <reference lib="deno.ns" />
import { build, emptyDir } from '@deno/dnt';

const outDir = './npm';

await emptyDir(outDir);

await build({
  entryPoints: ['./src/index.ts'],
  outDir,
  importMap: 'deno.json',
  shims: {
    deno: {
      test: 'dev',
    },
  },
  compilerOptions: {
    lib: ['ESNext', 'DOM'],
  },
  package: {
    // package.json properties
    name: 'webauthn-polyfills',
    version: '1.0.0',
    description: 'Polyfills for advanced WebAuthn methods not yet supported in evergreen browsers',
    license: 'Apache-2.0',
    repository: {
      type: 'git',
      url: 'git+https://github.com/passkeydeveloper/webauthn-polyfills.git',
    },
    bugs: {
      url: 'https://github.com/passkeydeveloper/webauthn-polyfills/issues',
    },
    devDependencies: {
      '@types/ua-parser-js': '^0.7.39',
    },
  },
  postBuild() {
    // steps to run after building and before running the tests
    Deno.copyFileSync('LICENSE', `${outDir}/LICENSE`);
    Deno.copyFileSync('README.md', `${outDir}/README.md`);
  },
});
