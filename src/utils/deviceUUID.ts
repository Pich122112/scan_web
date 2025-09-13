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
        console.error('Error reading UUID from localStorage:', e);
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
        console.error('Error saving UUID to localStorage:', e);
      }
    }

    return newUuid;
  }

  private static generateUUIDv4(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
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
        console.error('Error clearing UUID from localStorage:', e);
      }
    }
  }
}

//Correct with 72 line code cahnges
