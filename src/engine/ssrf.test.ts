import { describe, expect, it } from 'vitest';
import {
  hostLooksPrivate,
  hostnameIsBlocked,
  isPrivateIP,
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
