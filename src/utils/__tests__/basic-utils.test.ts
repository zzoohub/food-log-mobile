/**
 * Basic utility function tests that don't require React Native dependencies
 */

describe('Basic Utility Functions', () => {
  describe('String utilities', () => {
    it('should capitalize strings correctly', () => {
      const capitalize = (str: string): string => {
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
      };
      
      expect(capitalize('hello')).toBe('Hello');
      expect(capitalize('WORLD')).toBe('World');
      expect(capitalize('tESt')).toBe('Test');
      expect(capitalize('')).toBe('');
    });

    it('should truncate text correctly', () => {
      const truncateText = (text: string, maxLength: number): string => {
        if (text.length <= maxLength) return text;
        return text.slice(0, maxLength).trim() + '...';
      };

      expect(truncateText('Hello World', 5)).toBe('Hello...');
      expect(truncateText('Short', 10)).toBe('Short');
      expect(truncateText('Exactly 10', 10)).toBe('Exactly 10');
    });

    it('should generate unique IDs', () => {
      const generateId = (): string => {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
      };

      const id1 = generateId();
      const id2 = generateId();
      
      expect(id1).toBeDefined();
      expect(id2).toBeDefined();
      expect(id1).not.toBe(id2);
      expect(typeof id1).toBe('string');
      expect(id1.length).toBeGreaterThan(0);
    });
  });

  describe('Number utilities', () => {
    it('should format calories correctly', () => {
      const formatCalories = (calories: number): string => {
        return `${Math.round(calories)} cal`;
      };

      expect(formatCalories(150.7)).toBe('151 cal');
      expect(formatCalories(99.4)).toBe('99 cal');
      expect(formatCalories(0)).toBe('0 cal');
    });

    it('should clamp numbers correctly', () => {
      const clamp = (value: number, min: number, max: number): number => {
        return Math.min(Math.max(value, min), max);
      };

      expect(clamp(5, 0, 10)).toBe(5);
      expect(clamp(-5, 0, 10)).toBe(0);
      expect(clamp(15, 0, 10)).toBe(10);
      expect(clamp(10, 0, 10)).toBe(10);
      expect(clamp(0, 0, 10)).toBe(0);
    });
  });

  describe('Array utilities', () => {
    it('should shuffle arrays', () => {
      const shuffleArray = <T>(array: T[]): T[] => {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          const temp = shuffled[i]!;
          shuffled[i] = shuffled[j]!;
          shuffled[j] = temp;
        }
        return shuffled;
      };

      const original = [1, 2, 3, 4, 5];
      const shuffled = shuffleArray(original);
      
      expect(shuffled).toHaveLength(original.length);
      expect(shuffled).toEqual(expect.arrayContaining(original));
      expect(original).toEqual([1, 2, 3, 4, 5]); // Original unchanged
    });

    it('should group arrays by key', () => {
      const groupBy = <T, K extends keyof T>(array: T[], key: K): Record<string, T[]> => {
        return array.reduce((groups, item) => {
          const groupKey = String(item[key]);
          groups[groupKey] = groups[groupKey] || [];
          groups[groupKey].push(item);
          return groups;
        }, {} as Record<string, T[]>);
      };

      const items = [
        { type: 'fruit', name: 'apple' },
        { type: 'vegetable', name: 'carrot' },
        { type: 'fruit', name: 'banana' },
      ];

      const grouped = groupBy(items, 'type');
      
      expect(grouped.fruit).toHaveLength(2);
      expect(grouped.vegetable).toHaveLength(1);
      expect(grouped.fruit[0].name).toBe('apple');
      expect(grouped.fruit[1].name).toBe('banana');
    });
  });

  describe('Validation utilities', () => {
    it('should validate email addresses', () => {
      const validateEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email.trim());
      };

      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('user.name@domain.co.uk')).toBe(true);
      expect(validateEmail('invalid-email')).toBe(false);
      expect(validateEmail('@example.com')).toBe(false);
      expect(validateEmail('test@')).toBe(false);
      expect(validateEmail('')).toBe(false);
    });

    it('should validate passwords', () => {
      const validatePassword = (password: string): boolean => {
        return password.length >= 8 && /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password);
      };

      expect(validatePassword('Password123')).toBe(true);
      expect(validatePassword('StrongPass1')).toBe(true);
      expect(validatePassword('weak')).toBe(false);
      expect(validatePassword('NoNumbers')).toBe(false);
      expect(validatePassword('nonumbersorUPPER')).toBe(false);
    });
  });

  describe('Function utilities', () => {
    it('should debounce function calls', () => {
      jest.useFakeTimers();
      
      const debounce = <T extends (...args: any[]) => any>(
        func: T,
        delay: number,
      ): ((...args: Parameters<T>) => void) => {
        let timeoutId: NodeJS.Timeout;

        return (...args: Parameters<T>) => {
          clearTimeout(timeoutId);
          timeoutId = setTimeout(() => func(...args), delay);
        };
      };

      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 100);

      debouncedFn('test1');
      debouncedFn('test2');
      debouncedFn('test3');

      expect(mockFn).not.toHaveBeenCalled();

      jest.advanceTimersByTime(100);

      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(mockFn).toHaveBeenCalledWith('test3');

      jest.useRealTimers();
    });

    it('should throttle function calls', () => {
      jest.useFakeTimers();
      
      const throttle = <T extends (...args: any[]) => any>(
        func: T,
        delay: number,
      ): ((...args: Parameters<T>) => void) => {
        let lastCall = 0;

        return (...args: Parameters<T>) => {
          const now = Date.now();
          if (now - lastCall >= delay) {
            lastCall = now;
            func(...args);
          }
        };
      };

      const mockFn = jest.fn();
      const throttledFn = throttle(mockFn, 100);

      throttledFn('test1');
      throttledFn('test2');
      throttledFn('test3');

      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(mockFn).toHaveBeenCalledWith('test1');

      jest.advanceTimersByTime(100);
      throttledFn('test4');

      expect(mockFn).toHaveBeenCalledTimes(2);
      expect(mockFn).toHaveBeenCalledWith('test4');

      jest.useRealTimers();
    });
  });
});