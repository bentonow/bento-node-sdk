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
        email: 'test@example.com'
      });

      expect(result).toBe(true);
    });

    test('successfully validates email with full info', async () => {
      setupMockFetch({ valid: true });

      const result = await analytics.V1.Experimental.validateEmail({
        email: 'test@example.com',
        ip: '192.168.1.1',
        name: 'John Doe',
        userAgent: 'Mozilla/5.0'
      });

      expect(result).toBe(true);
    });

    test('handles invalid email', async () => {
      setupMockFetch({ valid: false });

      const result = await analytics.V1.Experimental.validateEmail({
        email: 'invalid@email'
      });

      expect(result).toBe(false);
    });

    test('handles server error gracefully', async () => {
      setupMockFetch({ error: 'Server Error' }, 500);

      await expect(
        analytics.V1.Experimental.validateEmail({
          email: 'test@example.com'
        })
      ).rejects.toThrow();
    });
  });

  describe('guessGender', () => {
    test('successfully guesses gender with high confidence', async () => {
      setupMockFetch({
        gender: 'female',
        confidence: 0.95
      });

      const result = await analytics.V1.Experimental.guessGender({
        name: 'Elizabeth'
      });

      expect(result.gender).toBe('female');
      expect(result.confidence).toBe(0.95);
    });

    test('handles unknown gender', async () => {
      setupMockFetch({
        gender: null,
        confidence: null
      });

      const result = await analytics.V1.Experimental.guessGender({
        name: 'Unknown'
      });

      expect(result.gender).toBeNull();
      expect(result.confidence).toBeNull();
    });

    test('handles low confidence result', async () => {
      setupMockFetch({
        gender: 'male',
        confidence: 0.3
      });

      const result = await analytics.V1.Experimental.guessGender({
        name: 'Pat'
      });

      expect(result.gender).toBe('male');
      expect(result.confidence).toBe(0.3);
    });
  });

  describe('geolocate', () => {
    test('successfully geolocates IP address', async () => {
      const mockLocation = {
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
        request: '192.168.1.1'
      };

      setupMockFetch(mockLocation);

      const result = await analytics.V1.Experimental.geolocate({
        ip: '192.168.1.1'
      });

      expect(result).toEqual(mockLocation);
    });

    test('returns null for unknown IP', async () => {
      setupMockFetch({});

      const result = await analytics.V1.Experimental.geolocate({
        ip: 'unknown'
      });

      expect(result).toBeNull();
    });

    test('handles partial location data', async () => {
      const partialLocation = {
        city_name: '',  // provide empty strings for required fields
        continent_code: '',
        country_code2: '',
        country_code3: '',
        country_name: 'United States',
        ip: '192.168.1.1',
        latitude: 0,
        longitude: 0,
        postal_code: '',
        real_region_name: '',
        region_name: '',
        request: '192.168.1.1'
      };

      setupMockFetch(partialLocation);

      const result = await analytics.V1.Experimental.geolocate({
        ip: '192.168.1.1'
      });

      expect(result).toEqual(partialLocation);
    });
  });

  describe('checkBlacklist', () => {
    test('successfully checks domain blacklist', async () => {
      const mockResponse = {
        description: 'Domain check result',
        query: 'example.com',
        results: {
          'blacklist1.com': false,
          'blacklist2.com': true
        }
      };

      setupMockFetch(mockResponse);

      const result = await analytics.V1.Experimental.checkBlacklist({
        domain: 'example.com'
      });

      expect(result.description).toBe('Domain check result');
      expect(result.query).toBe('example.com');
      expect(result.results).toEqual({
        'blacklist1.com': false,
        'blacklist2.com': true
      });
    });

    test('successfully checks IP blacklist', async () => {
      const mockResponse = {
        description: 'IP check result',
        query: '192.168.1.1',
        results: {
          'blacklist1.com': false,
          'blacklist2.com': false
        }
      };

      setupMockFetch(mockResponse);

      const result = await analytics.V1.Experimental.checkBlacklist({
        ip: '192.168.1.1'
      });

      expect(result.description).toBe('IP check result');
      expect(result.query).toBe('192.168.1.1');
      expect(result.results).toEqual({
        'blacklist1.com': false,
        'blacklist2.com': false
      });
    });

    test('handles empty results', async () => {
      const mockResponse = {
        description: 'Empty check result',
        query: 'example.com',
        results: {}
      };

      setupMockFetch(mockResponse);

      const result = await analytics.V1.Experimental.checkBlacklist({
        domain: 'example.com'
      });

      expect(result.results).toEqual({});
    });

    test('handles server error gracefully', async () => {
      setupMockFetch({ error: 'Server Error' }, 500);

      await expect(
        analytics.V1.Experimental.checkBlacklist({
          domain: 'example.com'
        })
      ).rejects.toThrow();
    });
  });
});