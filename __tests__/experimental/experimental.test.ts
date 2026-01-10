import { expect, test, describe, beforeEach } from 'bun:test';
import { Analytics } from '../../src';
import { mockOptions } from '../helpers/mockClient';
import { setupMockFetch } from '../helpers/mockFetch';

describe('BentoExperimental', () => {
  let analytics: Analytics;

  beforeEach(() => {
    analytics = new Analytics(mockOptions);
  });

  describe('validateEmail', () => {
    test('successfully validates email with basic info', async () => {
      setupMockFetch({ valid: true });

      const result = await analytics.V1.Experimental.validateEmail({
        email: 'test@example.com',
      });

      expect(result).toBe(true);
    });

    test('successfully validates email with full info', async () => {
      setupMockFetch({ valid: true });

      const result = await analytics.V1.Experimental.validateEmail({
        email: 'test@example.com',
        ip: '192.168.1.1',
        name: 'John Doe',
        userAgent: 'Mozilla/5.0',
      });

      expect(result).toBe(true);
    });

    test('handles invalid email', async () => {
      setupMockFetch({ valid: false });

      const result = await analytics.V1.Experimental.validateEmail({
        email: 'invalid@email',
      });

      expect(result).toBe(false);
    });

    test('handles server error gracefully', async () => {
      setupMockFetch({ error: 'Server Error' }, 500);

      await expect(
        analytics.V1.Experimental.validateEmail({
          email: 'test@example.com',
        })
      ).rejects.toThrow();
    });
  });

  describe('guessGender', () => {
    test('successfully guesses gender with high confidence', async () => {
      setupMockFetch({
        gender: 'female',
        confidence: 0.95,
      });

      const result = await analytics.V1.Experimental.guessGender({
        name: 'Elizabeth',
      });

      expect(result.gender).toBe('female');
      expect(result.confidence).toBe(0.95);
    });

    test('handles unknown gender', async () => {
      setupMockFetch({
        gender: null,
        confidence: null,
      });

      const result = await analytics.V1.Experimental.guessGender({
        name: 'Unknown',
      });

      expect(result.gender).toBeNull();
      expect(result.confidence).toBeNull();
    });

    test('handles low confidence result', async () => {
      setupMockFetch({
        gender: 'male',
        confidence: 0.3,
      });

      const result = await analytics.V1.Experimental.guessGender({
        name: 'Pat',
      });

      expect(result.gender).toBe('male');
      expect(result.confidence).toBe(0.3);
    });
  });

  describe('getBlacklistStatus', () => {
    test('successfully checks domain blacklist status', async () => {
      const mockResponse = {
        description: 'Domain blacklist check',
        query: 'example.com',
        results: {
          'blacklist1.com': false,
          'blacklist2.com': true,
        },
      };

      setupMockFetch(mockResponse);

      const result = await analytics.V1.Experimental.getBlacklistStatus({
        domain: 'example.com',
      });

      expect(result.query).toBe('example.com');
      expect(result.results['blacklist1.com']).toBe(false);
      expect(result.results['blacklist2.com']).toBe(true);
    });

    test('successfully checks IP blacklist status', async () => {
      const mockResponse = {
        description: 'IP blacklist check',
        query: '192.168.1.1',
        results: {
          'blacklist1.com': false,
          'blacklist2.com': false,
        },
      };

      setupMockFetch(mockResponse);

      const result = await analytics.V1.Experimental.getBlacklistStatus({
        ipAddress: '192.168.1.1',
      });

      expect(result.query).toBe('192.168.1.1');
      expect(Object.values(result.results)).not.toContain(true);
    });

    test('handles empty results', async () => {
      const mockResponse = {
        description: 'Empty check result',
        query: 'example.com',
        results: {},
      };

      setupMockFetch(mockResponse);

      const result = await analytics.V1.Experimental.getBlacklistStatus({
        domain: 'example.com',
      });

      expect(result.results).toEqual({});
    });

    test('handles server error gracefully', async () => {
      setupMockFetch({ error: 'Server Error' }, 500);

      await expect(
        analytics.V1.Experimental.getBlacklistStatus({
          domain: 'example.com',
        })
      ).rejects.toThrow();
    });
  });

  describe('getContentModeration', () => {
    test('successfully moderates safe content', async () => {
      const mockResponse = {
        flagged: false,
        categories: {
          hate: false,
          'hate/threatening': false,
          'self-harm': false,
          sexual: false,
          'sexual/minors': false,
          violence: false,
          'violence/graphic': false,
        },
        category_scores: {
          hate: 0.01,
          'hate/threatening': 0.01,
          'self-harm': 0.01,
          sexual: 0.01,
          'sexual/minors': 0.01,
          violence: 0.01,
          'violence/graphic': 0.01,
        },
      };

      setupMockFetch(mockResponse);

      const result = await analytics.V1.Experimental.getContentModeration(
        'Hello world, this is a test message.'
      );

      expect(result.flagged).toBe(false);
      expect(result.categories.hate).toBe(false);
      expect(result.category_scores.hate).toBeLessThan(0.1);
    });

    test('successfully flags problematic content', async () => {
      const mockResponse = {
        flagged: true,
        categories: {
          hate: true,
          'hate/threatening': false,
          'self-harm': false,
          sexual: false,
          'sexual/minors': false,
          violence: false,
          'violence/graphic': false,
        },
        category_scores: {
          hate: 0.92,
          'hate/threatening': 0.01,
          'self-harm': 0.01,
          sexual: 0.01,
          'sexual/minors': 0.01,
          violence: 0.01,
          'violence/graphic': 0.01,
        },
      };

      setupMockFetch(mockResponse);

      const result = await analytics.V1.Experimental.getContentModeration(
        'Test content with problematic material'
      );

      expect(result.flagged).toBe(true);
      expect(result.categories.hate).toBe(true);
      expect(result.category_scores.hate).toBeGreaterThan(0.9);
    });

    test('handles server error gracefully', async () => {
      setupMockFetch({ error: 'Server Error' }, 500);

      await expect(
        analytics.V1.Experimental.getContentModeration('Test content')
      ).rejects.toThrow();
    });
  });

  describe('geolocate', () => {
    test('successfully geolocates IP address', async () => {
      const mockResponse = {
        city_name: 'San Francisco',
        continent_code: 'NA',
        country_code2: 'US',
        country_code3: 'USA',
        country_name: 'United States',
        ip: '192.168.1.1',
        latitude: 37.7749,
        longitude: -122.4194,
        postal_code: '94105',
        real_region_name: 'California',
        region_name: 'CA',
        request: '192.168.1.1',
      };

      setupMockFetch(mockResponse);

      const result = await analytics.V1.Experimental.geolocate({
        ip: '192.168.1.1',
      });

      expect(result).toBeDefined();
      expect(result?.city_name).toBe('San Francisco');
      expect(result?.country_name).toBe('United States');
    });

    test('returns null for empty response', async () => {
      setupMockFetch({});

      const result = await analytics.V1.Experimental.geolocate({
        ip: '192.168.1.1',
      });

      expect(result).toBeNull();
    });

    test('handles server error gracefully', async () => {
      setupMockFetch({ error: 'Server Error' }, 500);

      await expect(
        analytics.V1.Experimental.geolocate({
          ip: '192.168.1.1',
        })
      ).rejects.toThrow();
    });
  });

  describe('checkBlacklist', () => {
    test('successfully checks blacklist status', async () => {
      const mockResponse = {
        description: 'Blacklist check',
        query: 'example.com',
        results: {
          'blacklist1.com': false,
          'blacklist2.com': true,
        },
      };

      setupMockFetch(mockResponse);

      const result = await analytics.V1.Experimental.checkBlacklist({
        ip: '192.0.2.1',
      });

      expect(result.query).toBe('example.com');
      expect(result.results['blacklist2.com']).toBe(true);
    });

    test('handles server error gracefully', async () => {
      setupMockFetch({ error: 'Server Error' }, 500);

      await expect(
        analytics.V1.Experimental.checkBlacklist({
          ip: '192.168.1.1',
        })
      ).rejects.toThrow();
    });
  });

  describe('geoLocateIP', () => {
    test('successfully geolocates IP address', async () => {
      const mockResponse = {
        city_name: 'San Francisco',
        continent_code: 'NA',
        country_code2: 'US',
        country_code3: 'USA',
        country_name: 'United States',
        ip: '192.168.1.1',
        latitude: 37.7749,
        longitude: -122.4194,
        postal_code: '94105',
        real_region_name: 'California',
        region_name: 'CA',
        request: '192.168.1.1',
      };

      setupMockFetch(mockResponse);

      const result = await analytics.V1.Experimental.geoLocateIP('192.168.1.1');

      expect(result.city_name).toBe('San Francisco');
      expect(result.country_name).toBe('United States');
      expect(result.latitude).toBe(37.7749);
      expect(result.longitude).toBe(-122.4194);
    });

    test('handles invalid IP address', async () => {
      setupMockFetch({ error: 'Invalid IP' }, 400);

      await expect(analytics.V1.Experimental.geoLocateIP('invalid-ip')).rejects.toThrow();
    });

    test('handles server error gracefully', async () => {
      setupMockFetch({ error: 'Server Error' }, 500);

      await expect(analytics.V1.Experimental.geoLocateIP('192.168.1.1')).rejects.toThrow();
    });
  });
});
