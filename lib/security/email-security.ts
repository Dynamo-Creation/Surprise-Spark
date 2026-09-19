/**
 * Email Security and Disposable/Temporary Email Filtering
 * Prevents disposable email providers, bots, and invalid email domains.
 */

// Popular disposable and temporary email domains
const DISPOSABLE_EMAIL_DOMAINS = new Set([
  // Popular services
  "mailinator.com",
  "10minutemail.com",
  "10minutemail.net",
  "tempmail.com",
  "temp-mail.org",
  "temp-mail.io",
  "guerrillamail.com",
  "guerrillamailblock.com",
  "guerrillamail.net",
  "guerrillamail.biz",
  "guerrillamail.org",
  "sharklasers.com",
  "grr.la",
  "yopmail.com",
  "yopmail.fr",
  "yopmail.net",
  "dispostable.com",
  "throwawaymail.com",
  "trashmail.com",
  "trashmail.net",
  "trashmail.me",
  "getairmail.com",
  "fakeinbox.com",
  "generator.email",
  "mytemp.email",
  "tempinbox.com",
  "getnada.com",
  "crazymailing.com",
  "mohmal.com",
  "emailondeck.com",
  "inboxkitten.com",
  "maildrop.cc",
  "nada.ltd",
  "abcvg.com",
  "burnermail.io",
  "dropmail.me",
  "harakirimail.com",
  "minuteinbox.com",
  "mohmal.in",
  "mytempemail.com",
  "nowmymail.com",
  "spambog.com",
  "tmailor.com",
  "trash-mail.com",
  "fakemailgenerator.com",
  "armyspy.com",
  "cuvox.de",
  "dayrep.com",
  "fleckens.hu",
  "gustr.com",
  "jourrapide.com",
  "rhyta.com",
  "superrito.com",
  "teleworm.us",
  "einrot.com",
  "chacuo.net",
  "discard.email",
  "spambox.us",
  "tempemail.co",
  "tempr.email",
  "trashmail.org",
  "mytempemail.com",
]);

export interface EmailValidationResult {
  isValid: boolean;
  error?: string;
  domain?: string;
}

/**
 * Validates email format and screens against temporary/disposable email services.
 */
export function validateEmailSecurity(rawEmail: string): EmailValidationResult {
  const email = (rawEmail || "").trim().toLowerCase();

  if (!email) {
    return {
      isValid: false,
      error: "Please enter your email address.",
    };
  }

  // Standard RFC 5322 regex check
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  if (!emailRegex.test(email)) {
    return {
      isValid: false,
      error: "Please enter a valid email address.",
    };
  }

  const parts = email.split("@");
  if (parts.length !== 2) {
    return {
      isValid: false,
      error: "Invalid email format.",
    };
  }

  const domain = parts[1];

  // Check against known disposable domain list
  if (DISPOSABLE_EMAIL_DOMAINS.has(domain)) {
    return {
      isValid: false,
      domain,
      error: "Temporary and disposable email addresses are not permitted. Please use your personal or work email.",
    };
  }

  // Check for common disposable keywords in domain
  const disposablePatterns = ["tempmail", "disposable", "fakeinbox", "trashmail", "throwaway", "10minute", "guerrilla"];
  for (const pattern of disposablePatterns) {
    if (domain.includes(pattern)) {
      return {
        isValid: false,
        domain,
        error: "Disposable email providers are blocked. Please provide a permanent email address.",
      };
    }
  }

  return {
    isValid: true,
    domain,
  };
}
