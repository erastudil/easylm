import { describe, expect, it } from 'vitest';
import { isWhitelistedHost, VETTED_WHITELIST_ROOTS } from './ssrf';

describe('Vetted Whitelist Hosts', () => {
  it('covers all major public real-time data and open-source science domains', () => {
    // Real-Time Sports
    expect(isWhitelistedHost('site.api.espn.com')).toBe(true);
    expect(isWhitelistedHost('espn.com')).toBe(true);

    // Real-Time Finance
    expect(isWhitelistedHost('query1.finance.yahoo.com')).toBe(true);
    expect(isWhitelistedHost('finance.yahoo.com')).toBe(true);
    expect(isWhitelistedHost('stooq.com')).toBe(true);
    expect(isWhitelistedHost('data.sec.gov')).toBe(true);

    // Real-Time News RSS
    expect(isWhitelistedHost('news.google.com')).toBe(true);
    expect(isWhitelistedHost('feeds.bbci.co.uk')).toBe(true);
    expect(isWhitelistedHost('feeds.npr.org')).toBe(true);

    // Qwen Open Data Survey Portals
    expect(isWhitelistedHost('physics.nist.gov')).toBe(true);
    expect(isWhitelistedHost('webbook.nist.gov')).toBe(true);
    expect(isWhitelistedHost('pubchem.ncbi.nlm.nih.gov')).toBe(true);
    expect(isWhitelistedHost('api.census.gov')).toBe(true);
    expect(isWhitelistedHost('govinfo.gov')).toBe(true);
    expect(isWhitelistedHost('uscode.house.gov')).toBe(true);
    expect(isWhitelistedHost('conceptnet.io')).toBe(true);
    expect(isWhitelistedHost('wikidata.org')).toBe(true);
    expect(isWhitelistedHost('dbpedia.org')).toBe(true);
    expect(isWhitelistedHost('openstreetmap.org')).toBe(true);
    expect(isWhitelistedHost('arxiv.org')).toBe(true);
  });

  it('rejects untrusted domains and internal infrastructure', () => {
    expect(isWhitelistedHost('localhost')).toBe(false);
    expect(isWhitelistedHost('metadata.google.internal')).toBe(false);
    expect(isWhitelistedHost('169.254.169.254')).toBe(false);
    expect(isWhitelistedHost('random-unvetted-proxy.com')).toBe(false);
  });

  it('has at least 25 vetted roots', () => {
    expect(VETTED_WHITELIST_ROOTS.length).toBeGreaterThanOrEqual(25);
  });
});
