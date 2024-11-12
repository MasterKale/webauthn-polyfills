import { assertEquals } from '@std/assert';
import { describe, it } from '@std/testing/bdd';

import { Base64URL } from './index.ts';

describe('Base64URL', () => {
  it('should encode to string', () => {
    assertEquals(
      Base64URL.encode(new Uint8Array([0, 0, 0, 0])),
      'AAAAAA',
    );
  });

  it('should decode to array buffer', () => {
    assertEquals(
      Base64URL.decode('AAAAAA'),
      new Uint8Array([0, 0, 0, 0]).buffer,
    );
  });
});
