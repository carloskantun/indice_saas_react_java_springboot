import {
  AsYouType,
  parsePhoneNumberFromString,
  type CountryCode,
} from 'libphonenumber-js/max';

import {
  getDialCodeForProfileCountry,
  isProfileCountry,
  type ProfileCountry,
} from '../profileCountries';

export type PhoneValidationError =
  | 'unsupported_country'
  | 'invalid_phone';

export type PhoneValidationResult =
  | {
      ok: true;
      country: ProfileCountry;
      e164: string;
      international: string;
      national: string;
    }
  | {
      ok: false;
      error: PhoneValidationError;
    };

const toLibPhoneCountryCode = (country: ProfileCountry): CountryCode => (
  country as unknown as CountryCode
);

const PHONE_DIGIT_LIMITS: Record<ProfileCountry, number> = {
  AR: 11,
  BR: 11,
  CA: 10,
  CL: 9,
  CO: 10,
  ES: 9,
  MX: 10,
  PE: 9,
  US: 10,
};

function stripToDigits(rawNumber: string): string {
  return rawNumber.replace(/\D/g, '');
}

export function getPhoneDigitLimitForCountry(country?: string): number | undefined {
  if (!country || !isProfileCountry(country)) {
    return undefined;
  }

  return PHONE_DIGIT_LIMITS[country];
}

export function normalizePhoneInputForCountry(
  rawNumber: string,
  country?: string,
): string {
  if (!country || !isProfileCountry(country)) {
    return rawNumber;
  }

  const digitLimit = PHONE_DIGIT_LIMITS[country];
  let digits = stripToDigits(rawNumber ?? '');

  if (!digits) {
    return '';
  }

  const dialCodeDigits = getDialCodeForProfileCountry(country).replace(/\D/g, '');

  // If the user pastes a full international number while a country is already selected,
  // keep only the national number because the UI shows the dial code separately.
  if (digits.length > digitLimit && digits.startsWith(dialCodeDigits)) {
    digits = digits.slice(dialCodeDigits.length);
  }

  const normalizedDigits = digits.slice(0, digitLimit);
  return new AsYouType(toLibPhoneCountryCode(country)).input(normalizedDigits);
}

/**
 * Validates a phone number using libphonenumber metadata for the given country.
 * Accepts national numbers (e.g. "416 555 1234") and full international numbers (e.g. "+1 416 555 1234").
 */
export function validatePhoneForCountry(
  rawNumber: string,
  country: ProfileCountry,
): PhoneValidationResult {
  const normalized = rawNumber.trim();
  if (!normalized) {
    return { ok: false, error: 'invalid_phone' };
  }

  const phoneNumber = parsePhoneNumberFromString(normalized, toLibPhoneCountryCode(country));
  if (!phoneNumber || !phoneNumber.isValid()) {
    return { ok: false, error: 'invalid_phone' };
  }

  return {
    ok: true,
    country,
    e164: phoneNumber.number,
    international: phoneNumber.formatInternational(),
    national: phoneNumber.formatNational(),
  };
}

export function validatePhoneForProfileCountry(
  rawNumber: string,
  country?: string,
): PhoneValidationResult {
  if (!country || !isProfileCountry(country)) {
    return { ok: false, error: 'unsupported_country' };
  }

  return validatePhoneForCountry(rawNumber, country);
}

export function formatPhoneAsYouType(
  rawNumber: string,
  country?: string,
): string {
  const normalized = rawNumber ?? '';

  if (!country || !isProfileCountry(country)) {
    return normalized;
  }

  return new AsYouType(toLibPhoneCountryCode(country)).input(normalized);
}
