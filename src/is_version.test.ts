import { assertEquals } from '@std/assert';
import { describe, it } from '@std/testing/bdd';

import { isVersion } from './is_version.ts';

/*
 * iOS Safari 17.4 < 18.2
 * iOS Chrome 17.4 < 18.2
 * iOS Edge 17.4 < 18.2
 * macOS Safari 17.4 < 18.2
 * macOS Chrome 128+
 * macOS Edge (Blink 128+)
 * Windows Chrome 128+
 * Windows Edge (Blink 128+)
 * Android Chrome 128+
 * Android Edge (Blink 128+)
 * Ubuntu Chrome 128+
 * Ubuntu Edge (Blink 128+)
 */

describe('iOS 17.5 Safari 17.5', () => {
  const ua =
    'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1';
  const ver = new isVersion(ua);
  it('should not be Blink 128 or later', () => {
    assertEquals(
      ver.blink128OrLater,
      false,
    );
  });
  it('should not be iOS 18 or later', () => {
    assertEquals(
      ver.iOS18OrLater,
      false,
    );
  });
  it('should not be Safari 17.4 to 18.2', () => {
    assertEquals(
      ver.safari174To182,
      false,
    );
  });
  it('should be iOS 17.4 to 18.2', () => {
    assertEquals(
      ver.iOS174To182,
      true,
    );
  });
});

describe('iOS 17.5 Chrome 118', () => {
  const ua =
    'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/118.0.5993.90 Mobile/15E148 Safari/604.1';
  const ver = new isVersion(ua);
  it('should not be Blink 128 or later', () => {
    assertEquals(
      ver.blink128OrLater,
      false,
    );
  });
  it('should not be iOS 18 or later', () => {
    assertEquals(
      ver.iOS18OrLater,
      false,
    );
  });
  it('should not be Safari 17.4 to 18.2', () => {
    assertEquals(
      ver.safari174To182,
      false,
    );
  });
  it('should be iOS 17.4 to 18.2', () => {
    assertEquals(
      ver.iOS174To182,
      true,
    );
  });
});

describe('iOS 17.5 Edge 118', () => {
  const ua =
    'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) EdgiOS/118.0.0.0 Mobile/15E148 Safari/604.1';
  const ver = new isVersion(ua);
  it('should not be Blink 128 or later', () => {
    assertEquals(
      ver.blink128OrLater,
      false,
    );
  });
  it('should not be iOS 18 or later', () => {
    assertEquals(
      ver.iOS18OrLater,
      false,
    );
  });
  it('should not be Safari 17.4 to 18.2', () => {
    assertEquals(
      ver.safari174To182,
      false,
    );
  });
  it('should be iOS 17.4 to 18.2', () => {
    assertEquals(
      ver.iOS174To182,
      true,
    );
  });
});

describe('macOS 14.0 Safari 17.5', () => {
  const ua =
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Safari/605.1.15';
  const ver = new isVersion(ua);
  it('should not be Blink 128 or later', () => {
    assertEquals(
      ver.blink128OrLater,
      false,
    );
  });
  it('should not be iOS 18 or later', () => {
    assertEquals(
      ver.iOS18OrLater,
      false,
    );
  });
  it('should be Safari 17.4 to 18.2', () => {
    assertEquals(
      ver.safari174To182,
      true,
    );
  });
  it('should not be iOS 17.4 to 18.2', () => {
    assertEquals(
      ver.iOS174To182,
      false,
    );
  });
});

describe('macOS 14.0 Chrome 128', () => {
  const ua =
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36';
  const ver = new isVersion(ua);
  it('should be Blink 128 or later', () => {
    assertEquals(
      ver.blink128OrLater,
      true,
    );
  });
  it('should not be iOS 18 or later', () => {
    assertEquals(
      ver.iOS18OrLater,
      false,
    );
  });
  it('should not be Safari 17.4 to 18.2', () => {
    assertEquals(
      ver.safari174To182,
      false,
    );
  });
  it('should not be iOS 17.4 to 18.2', () => {
    assertEquals(
      ver.iOS174To182,
      false,
    );
  });
});

describe('macOS 14.0 Edge 128', () => {
  const ua =
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36 Edg/128.0.0.0';
  const ver = new isVersion(ua);
  it('should be Blink 128 or later', () => {
    assertEquals(
      ver.blink128OrLater,
      true,
    );
  });
  it('should not be iOS 18 or later', () => {
    assertEquals(
      ver.iOS18OrLater,
      false,
    );
  });
  it('should not be Safari 17.4 to 18.2', () => {
    assertEquals(
      ver.safari174To182,
      false,
    );
  });
  it('should not be iOS 17.4 to 18.2', () => {
    assertEquals(
      ver.iOS174To182,
      false,
    );
  });
});

describe('Windows 10.0 Chrome 128', () => {
  const ua =
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36';
  const ver = new isVersion(ua);
  it('should be Blink 128 or later', () => {
    assertEquals(
      ver.blink128OrLater,
      true,
    );
  });
  it('should not be iOS 18 or later', () => {
    assertEquals(
      ver.iOS18OrLater,
      false,
    );
  });
  it('should not be Safari 17.4 to 18.2', () => {
    assertEquals(
      ver.safari174To182,
      false,
    );
  });
  it('should not be iOS 17.4 to 18.2', () => {
    assertEquals(
      ver.iOS174To182,
      false,
    );
  });
});

describe('Windows 10.0 Edge 128', () => {
  const ua =
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36 Edg/128.0.0.0';
  const ver = new isVersion(ua);
  it('should be Blink 128 or later', () => {
    assertEquals(
      ver.blink128OrLater,
      true,
    );
  });
  it('should not be iOS 18 or later', () => {
    assertEquals(
      ver.iOS18OrLater,
      false,
    );
  });
  it('should not be Safari 17.4 to 18.2', () => {
    assertEquals(
      ver.safari174To182,
      false,
    );
  });
  it('should not be iOS 17.4 to 18.2', () => {
    assertEquals(
      ver.iOS174To182,
      false,
    );
  });
});

describe('Android 13.0 Chrome 128', () => {
  const ua =
    'Mozilla/5.0 (Linux; Android 13; SM-G991B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Mobile Safari/537.36';
  const ver = new isVersion(ua);
  it('should be Blink 128 or later', () => {
    assertEquals(
      ver.blink128OrLater,
      true,
    );
  });
  it('should not be iOS 18 or later', () => {
    assertEquals(
      ver.iOS18OrLater,
      false,
    );
  });
  it('should not be Safari 17.4 to 18.2', () => {
    assertEquals(
      ver.safari174To182,
      false,
    );
  });
  it('should not be iOS 17.4 to 18.2', () => {
    assertEquals(
      ver.iOS174To182,
      false,
    );
  });
});

describe('Android 13.0 Edge 128', () => {
  const ua =
    'Mozilla/5.0 (Linux; Android 13; SM-G991B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Mobile Safari/537.36 EdgA/128.0.0.0';
  const ver = new isVersion(ua);
  it('should be Blink 128 or later', () => {
    assertEquals(
      ver.blink128OrLater,
      true,
    );
  });
  it('should not be iOS 18 or later', () => {
    assertEquals(
      ver.iOS18OrLater,
      false,
    );
  });
  it('should not be Safari 17.4 to 18.2', () => {
    assertEquals(
      ver.safari174To182,
      false,
    );
  });
  it('should not be iOS 17.4 to 18.2', () => {
    assertEquals(
      ver.iOS174To182,
      false,
    );
  });
});

describe('Ubuntu 13.0 Chrome 128', () => {
  const ua =
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36';
  const ver = new isVersion(ua);
  it('should be Blink 128 or later', () => {
    assertEquals(
      ver.blink128OrLater,
      true,
    );
  });
  it('should not be iOS 18 or later', () => {
    assertEquals(
      ver.iOS18OrLater,
      false,
    );
  });
  it('should not be Safari 17.4 to 18.2', () => {
    assertEquals(
      ver.safari174To182,
      false,
    );
  });
  it('should not be iOS 17.4 to 18.2', () => {
    assertEquals(
      ver.iOS174To182,
      false,
    );
  });
});

describe('Ubuntu 13.0 Edge 128', () => {
  const ua =
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36 Edg/128.0.0.0';
  const ver = new isVersion(ua);
  it('should be Blink 128 or later', () => {
    assertEquals(
      ver.blink128OrLater,
      true,
    );
  });
  it('should not be iOS 18 or later', () => {
    assertEquals(
      ver.iOS18OrLater,
      false,
    );
  });
  it('should not be Safari 17.4 to 18.2', () => {
    assertEquals(
      ver.safari174To182,
      false,
    );
  });
  it('should not be iOS 17.4 to 18.2', () => {
    assertEquals(
      ver.iOS174To182,
      false,
    );
  });
});
