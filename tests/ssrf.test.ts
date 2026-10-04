import { describe, it, expect } from 'vitest';
import {
  normalizeHostname,
  hostnameIsBlocked,
  isWikiHost,
  isWhitelistedHost,
  isPrivateIP,
  ipv4FromWeirdLiteral,
  hostLooksPrivate,
  parsePublicHttpsUrl
} from '../src/engine/ssrf';

describe('SSRF Guards', () => {
  describe('normalizeHostname', () => {
    it('trims, lowercases, and removes trailing dots', () => {
      expect(normalizeHostname(' Example.COM. ')).toBe('example.com');
      expect(normalizeHostname('test..')).toBe('test');
      expect(normalizeHostname('test.')).toBe('test');
      expect(normalizeHostname(undefined as any)).toBe('');
    });
  });

  describe('hostnameIsBlocked', () => {
    it('blocks known localhost and internal hosts', () => {
      expect(hostnameIsBlocked('localhost')).toBe(true);
      expect(hostnameIsBlocked('kubernetes.default')).toBe(true);
      expect(hostnameIsBlocked('metadata.google.internal')).toBe(true);
      expect(hostnameIsBlocked('0.0.0.0')).toBe(true);
      expect(hostnameIsBlocked('0')).toBe(true);
    });

    it('blocks known suffixes', () => {
      expect(hostnameIsBlocked('my-db.local')).toBe(true);
      expect(hostnameIsBlocked('test.localhost')).toBe(true);
      expect(hostnameIsBlocked('server.internal')).toBe(true);
    });

    it('allows public hosts', () => {
      expect(hostnameIsBlocked('example.com')).toBe(false);
      expect(hostnameIsBlocked('wikipedia.org')).toBe(false);
    });
  });

  describe('isWikiHost', () => {
    it('matches exact wiki roots', () => {
      expect(isWikiHost('wikipedia.org')).toBe(true);
      expect(isWikiHost('wikimedia.org')).toBe(true);
    });

    it('matches subdomains of wiki roots', () => {
      expect(isWikiHost('en.wikipedia.org')).toBe(true);
    });

    it('rejects generic substrings', () => {
      expect(isWikiHost('notwikipedia.org')).toBe(false);
      expect(isWikiHost('wikipedia.org.com')).toBe(false);
    });
  });

  describe('isWhitelistedHost', () => {
    it('matches vetted whitelist roots and their subdomains', () => {
      expect(isWhitelistedHost('news.google.com')).toBe(true);
      expect(isWhitelistedHost('en.wikipedia.org')).toBe(true);
    });

    it('rejects unwhitelisted domains', () => {
      expect(isWhitelistedHost('example.com')).toBe(false);
      expect(isWhitelistedHost('malicious.com')).toBe(false);
    });

    it('rejects blocked hosts even if they somehow match', () => {
      expect(isWhitelistedHost('localhost')).toBe(false);
    });
  });

  describe('isPrivateIP', () => {
    it('matches IPv4 private ranges', () => {
      expect(isPrivateIP('127.0.0.1')).toBe(true); // loopback
      expect(isPrivateIP('10.0.0.1')).toBe(true); // 10.x.x.x
      expect(isPrivateIP('192.168.1.1')).toBe(true); // 192.168.x.x
      expect(isPrivateIP('172.16.0.1')).toBe(true); // 172.16.x.x - 172.31.x.x
      expect(isPrivateIP('172.31.255.255')).toBe(true);
      expect(isPrivateIP('169.254.0.1')).toBe(true); // link local
    });

    it('matches IPv6 private/local ranges', () => {
      expect(isPrivateIP('::1')).toBe(true);
      expect(isPrivateIP('fc00::1')).toBe(true);
      expect(isPrivateIP('fe80::1')).toBe(true);
    });

    it('allows legitimate public IPs', () => {
      expect(isPrivateIP('8.8.8.8')).toBe(false);
      expect(isPrivateIP('1.1.1.1')).toBe(false);
      expect(isPrivateIP('142.250.190.46')).toBe(false);
    });

    it('handles IPv4-mapped IPv6 addresses', () => {
      expect(isPrivateIP('::ffff:127.0.0.1')).toBe(true);
      expect(isPrivateIP('::ffff:8.8.8.8')).toBe(false);
    });
  });

  describe('ipv4FromWeirdLiteral', () => {
    it('converts decimal literals', () => {
      expect(ipv4FromWeirdLiteral('2130706433')).toBe('127.0.0.1'); // 127.0.0.1 in dec
    });

    it('converts hex literals', () => {
      expect(ipv4FromWeirdLiteral('0x7f000001')).toBe('127.0.0.1'); // 127.0.0.1 in hex
    });

    it('returns null for invalid literals', () => {
      expect(ipv4FromWeirdLiteral('999999999999')).toBeNull(); // Out of bounds
      expect(ipv4FromWeirdLiteral('notanumber')).toBeNull();
    });
  });

  describe('hostLooksPrivate', () => {
    it('catches blocked hostnames', () => {
      expect(hostLooksPrivate('localhost')).toBe(true);
    });

    it('catches weird literals that map to private IPs', () => {
      expect(hostLooksPrivate('2130706433')).toBe(true);
      expect(hostLooksPrivate('0x7f000001')).toBe(true);
    });

    it('catches direct private IPs', () => {
      expect(hostLooksPrivate('127.0.0.1')).toBe(true);
      expect(hostLooksPrivate('::1')).toBe(true);
    });

    it('allows safe public hosts and IPs', () => {
      expect(hostLooksPrivate('example.com')).toBe(false);
      expect(hostLooksPrivate('8.8.8.8')).toBe(false);
    });
  });

  describe('parsePublicHttpsUrl', () => {
    it('rejects blocked schemes', () => {
      expect(parsePublicHttpsUrl('file:///etc/passwd').ok).toBe(false);
      expect(parsePublicHttpsUrl('javascript:alert(1)').ok).toBe(false);
      expect(parsePublicHttpsUrl('data:text/plain,hello').ok).toBe(false);
      expect(parsePublicHttpsUrl('ftp://example.com').ok).toBe(false);
    });

    it('rejects credentials in URL', () => {
      expect(parsePublicHttpsUrl('https://user:pass@example.com').ok).toBe(false);
    });

    it('rejects non-standard ports', () => {
      expect(parsePublicHttpsUrl('https://example.com:8443').ok).toBe(false);
      expect(parsePublicHttpsUrl('http://example.com:8080').ok).toBe(false);
    });

    it('rejects private hosts', () => {
      expect(parsePublicHttpsUrl('https://localhost').ok).toBe(false);
      expect(parsePublicHttpsUrl('https://127.0.0.1').ok).toBe(false);
    });

    it('forces https for http URLs', () => {
      const result = parsePublicHttpsUrl('http://example.com');
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.url.protocol).toBe('https:');
      }
    });

    it('parses safe URLs successfully', () => {
      const result = parsePublicHttpsUrl('https://example.com/path?query=1');
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.url.hostname).toBe('example.com');
      }
    });
  });
});
