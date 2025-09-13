import crypto from "crypto-js";

const secretKey = "K8r$1!dJ2x^Lz#Wm9QpVt@7f&uYiHcZsBnOa4Xg5Ej6Rk3Tl";

export class CodeValidator {
  // Validate the code in the URL or raw string
  static isValidCode(fullUrl: string): boolean {
    try {
      const codeWithSuffix = this.extractCodeWithSuffix(fullUrl);
      if (!codeWithSuffix) return false;

      const parts = codeWithSuffix.split(",");
      if (parts.length === 0) return false;

      const codePart = parts[0];
      if (codePart.length !== 18) return false;

      const naturalCode = codePart.substring(0, 11);
      const providedSignature = codePart.substring(11);

      const expectedSignature = this.generateSignature(naturalCode);

      return providedSignature === expectedSignature;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return false;
    }
  }

  static generateSignature(naturalCode: string): string {
    const hmac = crypto.HmacSHA256(naturalCode, secretKey);
    const base64 = crypto.enc.Base64.stringify(hmac);
    let signature = base64
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '')
      .replace(/[^a-zA-Z0-9]/g, '')
      .substring(0, 7);

    if (signature.length < 7) {
      const hexString = hmac.toString();
      const extraBytes = hexString.substring(20, 34);
      const extraHmac = crypto.HmacSHA256(extraBytes, secretKey);
      const extraBase64 = crypto.enc.Base64.stringify(extraHmac);
      const extraSig = extraBase64
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '')
        .replace(/[^a-zA-Z0-9]/g, '');
      signature += extraSig.substring(0, 7 - signature.length);
    }
    return signature.substring(0, 7);
  }

  static extractCodeWithSuffix(fullUrl: string): string {
    try {
      if (fullUrl.includes('/t/')) {
        const urlParts = fullUrl.split('/t/');
        if (urlParts.length > 1) {
          return urlParts[1];
        }
      }
      return fullUrl;
    } catch {
      return fullUrl;
    }
  }

  static getNaturalCode(fullUrl: string): string {
    const codeWithSuffix = this.extractCodeWithSuffix(fullUrl);
    if (!codeWithSuffix) return "";
    const parts = codeWithSuffix.split(",");
    if (!parts[0] || parts[0].length < 11) return "";
    return parts[0].substring(0, 11);
  }
}

//Correct with 77 line code changes
