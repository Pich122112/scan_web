// utils/deviceUUID.ts
export class DeviceUUID {
  private static readonly STORAGE_KEY = 'device_uuid';
  private static cachedUUID: string | null = null;

  // Simple regex to validate UUID v4 format
  private static readonly uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  static async getUUID(): Promise<string> {
    // Return cached UUID if valid
    if (this.cachedUUID && this.isValidUUID(this.cachedUUID)) {
      return this.cachedUUID;
    }

    // Try to get from localStorage
    if (typeof window !== 'undefined') {
      try {
        const storedUUID = localStorage.getItem(this.STORAGE_KEY);
        if (storedUUID && this.isValidUUID(storedUUID)) {
          this.cachedUUID = storedUUID;
          return storedUUID;
        }
      } catch (e) {
        // Silent fail - will generate new UUID
        if (process.env.NODE_ENV === 'development') {
          console.error('Error reading UUID from localStorage:', e);
        }
      }
    }

    // Generate new UUID
    return await this.regenerateUUID();
  }

  static async regenerateUUID(): Promise<string> {
    const newUuid = this.generateUUIDv4();
    this.cachedUUID = newUuid;

    // Save to localStorage
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(this.STORAGE_KEY, newUuid);
      } catch (e) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Error saving UUID to localStorage:', e);
        }
      }
    }

    return newUuid;
  }

  // ✅ FIXED: Use cryptographically secure random UUID
  private static generateUUIDv4(): string {
    // Use Web Crypto API for cryptographically secure random UUID
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID();
    }

    // Fallback for older browsers (still more secure than Math.random)
    return this.generateFallbackUUID();
  }

  // Fallback for browsers that don't support crypto.randomUUID()
  private static generateFallbackUUID(): string {
    // Use crypto.getRandomValues as fallback (cryptographically secure)
    const array = new Uint32Array(4);
    if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
      crypto.getRandomValues(array);
    } else {
      // Last resort fallback (still better than Math.random alone)
      for (let i = 0; i < array.length; i++) {
        array[i] = (Math.random() * 0x100000000) >>> 0;
      }
    }

    // Format as UUID v4
    return `${(array[0] & 0xffffffff).toString(16).padStart(8, '0')}-${(array[1] & 0xffff).toString(16).padStart(4, '0')}-4${(array[1] >>> 16 & 0xfff).toString(16).padStart(3, '0')}-${(array[2] & 0x3fff | 0x8000).toString(16).padStart(4, '0')}-${(array[3] & 0xffffffff).toString(16).padStart(12, '0')}`;
  }

  private static isValidUUID(uuid: string): boolean {
    return this.uuidRegex.test(uuid);
  }

  static async clearUUID(): Promise<void> {
    this.cachedUUID = null;
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem(this.STORAGE_KEY);
      } catch (e) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Error clearing UUID from localStorage:', e);
        }
      }
    }
  }
}

//Correct with 99 line code changes
