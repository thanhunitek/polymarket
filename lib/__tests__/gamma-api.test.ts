import { fetchPremierLeagueEvents } from '@/services/gamma-api';
import { GammaEvent } from '@/types';

// Mock fetch to avoid actual API calls during tests
global.fetch = jest.fn();

describe('Gamma API Service', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it('should handle fetch errors gracefully', async () => {
    // Mock a failed fetch response
    (global.fetch as jest.Mock).mockRejectedValue(new TypeError('Failed to fetch'));
    
    await expect(fetchPremierLeagueEvents()).rejects.toThrow('Failed to fetch');
  });

  it('should handle network errors with proper error messages', async () => {
    // Mock a network error
    (global.fetch as jest.Mock).mockRejectedValue(new TypeError('Failed to fetch'));
    
    try {
      await fetchPremierLeagueEvents();
    } catch (error) {
      expect(error).toBeInstanceOf(TypeError);
      expect((error as Error).message).toContain('Failed to fetch');
    }
  });
});