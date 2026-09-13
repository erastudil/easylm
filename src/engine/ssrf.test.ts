import { describe, expect, it } from 'vitest';
import {
  hostLooksPrivate,
  hostnameIsBlocked,
  isPrivateIP,
  isWhitelistedHost,
  isWikiHost,
  parsePublicHttpsUrl
} from './ssrf';

describe('isPrivateIP', () => {
  it('blocks loopback, RFC1918, link-local, CGNAT, docs', () => {
    expect(isPrivateIP('127.0.0.1')).toBe(true);
    expect(isPrivateIP('10.0.0.1')).toBe(true);
    expect(isPrivateIP('192.168.1.1')).toBe(true);
    expect(isPrivateIP('172.16.0.1')).toBe(true);
    expect(isPrivateIP('169.254.169.254')).toBe(true);
    expect(isPrivateIP('100.64.0.1')).toBe(true);
    expect(isPrivateIP('0.0.0.0')).toBe(true);
    expect(isPrivateIP('::1')).toBe(true);
    expect(isPrivateIP('::ffff:127.0.0.1')).toBe(true);
    expect(isPrivateIP('fc00::1')).toBe(true);
    expect(isPrivateIP('fe80::1')).toBe(true);
    expect(isPrivateIP('fec0::1')).toBe(true);
  });

  it('allows public v4', () => {
    expect(isPrivateIP('1.1.1.1')).toBe(false);
    expect(isPrivateIP('8.8.8.8')).toBe(false);
    expect(isPrivateIP('93.184.216.34')).toBe(false);
  });
});

describe('hostnameIsBlocked / hostLooksPrivate', () => {
  it('blocks localhost names and decimal loopback', () => {
    expect(hostnameIsBlocked('localhost')).toBe(true);
    expect(hostnameIsBlocked('foo.localhost')).toBe(true);
    expect(hostnameIsBlocked('metadata.google.internal')).toBe(true);
    expect(hostLooksPrivate('2130706433')).toBe(true);
    expect(hostLooksPrivate('0x7f000001')).toBe(true);
    expect(hostLooksPrivate('127.0.0.1')).toBe(true);
  });
});

describe('isWikiHost', () => {
  it('suffix-matches, never substring-matches', () => {
    expect(isWikiHost('en.wikipedia.org')).toBe(true);
    expect(isWikiHost('wikipedia.org')).toBe(true);
    expect(isWikiHost('not-wikipedia.org')).toBe(false);
    expect(isWikiHost('wikipedia.org.evil.com')).toBe(false);
  });
});

describe('isWhitelistedHost', () => {
  it('allows safe vetted news, sports, finance, and open data hosts', () => {
    // news & rss
    expect(isWhitelistedHost('news.google.com')).toBe(true);
    expect(isWhitelistedHost('feeds.bbci.co.uk')).toBe(true);
    expect(isWhitelistedHost('feeds.npr.org')).toBe(true);

    // sports & scores
    expect(isWhitelistedHost('site.api.espn.com')).toBe(true);
    expect(isWhitelistedHost('espn.com')).toBe(true);

    // finance & stocks
    expect(isWhitelistedHost('query1.finance.yahoo.com')).toBe(true);
    expect(isWhitelistedHost('finance.yahoo.com')).toBe(true);
    expect(isWhitelistedHost('data.sec.gov')).toBe(true);

    // Qwen open data & metrology
    expect(isWhitelistedHost('physics.nist.gov')).toBe(true);
    expect(isWhitelistedHost('webbook.nist.gov')).toBe(true);
    expect(isWhitelistedHost('pubchem.ncbi.nlm.nih.gov')).toBe(true);
    expect(isWhitelistedHost('api.census.gov')).toBe(true);
    expect(isWhitelistedHost('govinfo.gov')).toBe(true);
    expect(isWhitelistedHost('arxiv.org')).toBe(true);
    expect(isWhitelistedHost('conceptnet.io')).toBe(true);
    expect(isWhitelistedHost('wikidata.org')).toBe(true);
    expect(isWhitelistedHost('api.worldbank.org')).toBe(true);
    expect(isWhitelistedHost('openstax.org')).toBe(true);
    expect(isWhitelistedHost('ocw.mit.edu')).toBe(true);
    expect(isWhitelistedHost('phet.colorado.edu')).toBe(true);
    expect(isWhitelistedHost('libretexts.org')).toBe(true);
  });

  it('rejects arbitrary external hosts and local/private domains', () => {
    expect(isWhitelistedHost('evil.com')).toBe(false);
    expect(isWhitelistedHost('attacker.io')).toBe(false);
    expect(isWhitelistedHost('localhost')).toBe(false);
    expect(isWhitelistedHost('metadata.google.internal')).toBe(false);
  });
});

describe('parsePublicHttpsUrl', () => {
  it('rejects private, file, credentials, odd ports', () => {
    expect(parsePublicHttpsUrl('http://127.0.0.1/').ok).toBe(false);
    expect(parsePublicHttpsUrl('https://localhost/secret').ok).toBe(false);
    expect(parsePublicHttpsUrl('file:///etc/passwd').ok).toBe(false);
    expect(parsePublicHttpsUrl('https://user:pass@example.com/').ok).toBe(false);
    expect(parsePublicHttpsUrl('https://example.com:8443/').ok).toBe(false);
  });

  it('accepts public https and upgrades http', () => {
    const a = parsePublicHttpsUrl('https://example.com/path');
    expect(a.ok).toBe(true);
    if (a.ok) expect(a.url.hostname).toBe('example.com');
    const b = parsePublicHttpsUrl('example.com');
    expect(b.ok).toBe(true);
    if (b.ok) expect(b.url.protocol).toBe('https:');
  });
});
