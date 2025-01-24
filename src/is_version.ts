// @deno-types="npm:@types/ua-parser-js@^0.7.39"
import { UAParser } from 'ua-parser-js';
import { compare } from 'compare-versions';

export class isVersion {
  public iOS174To182: boolean;
  public safari174To182: boolean;
  public iOS18OrLater: boolean;
  public blink128OrLater: boolean;

  constructor(ua?: string) {
    const { browser, engine, os } = UAParser(ua);

    if (!browser?.version || !browser?.name) {
      throw new Error('Browser version not found.');
    }

    if (!engine?.version || !engine?.name) {
      throw new Error('Engine version not found.');
    }

    if (!os?.version || !os?.name) {
      throw new Error('OS version not found.');
    }

    this.iOS174To182 = os.name === 'iOS' &&
      compare(os.version, '17.4', '>=') &&
      compare(os.version, '18.2', '<');

    this.safari174To182 = os.name === 'Mac OS' &&
      browser.name === 'Safari' &&
      compare(browser.version, '17.4', '>=') &&
      compare(browser.version, '18.2', '<');

    this.iOS18OrLater = os.name === 'iOS' && compare(os.version, '18', '>=');

    this.blink128OrLater = engine.name === 'Blink' && compare(engine.version, '128', '>=');
  }
}
