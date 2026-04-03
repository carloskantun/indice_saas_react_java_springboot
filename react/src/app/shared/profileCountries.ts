export type ProfileCountry = 'AR' | 'BR' | 'CA' | 'CL' | 'CO' | 'ES' | 'MX' | 'US';

export type ProfileCountryOption = {
  code: ProfileCountry;
  dialCode: string;
  flag: string;
  fallbackName: string;
};

export const DEFAULT_PROFILE_COUNTRY: ProfileCountry = 'MX';

export const PROFILE_COUNTRY_OPTIONS: ProfileCountryOption[] = [
  { code: 'MX', dialCode: '+52', flag: '🇲🇽', fallbackName: 'Mexico' },
  { code: 'US', dialCode: '+1', flag: '🇺🇸', fallbackName: 'United States' },
  { code: 'CA', dialCode: '+1', flag: '🇨🇦', fallbackName: 'Canada' },
  { code: 'ES', dialCode: '+34', flag: '🇪🇸', fallbackName: 'Spain' },
  { code: 'CO', dialCode: '+57', flag: '🇨🇴', fallbackName: 'Colombia' },
  { code: 'AR', dialCode: '+54', flag: '🇦🇷', fallbackName: 'Argentina' },
  { code: 'BR', dialCode: '+55', flag: '🇧🇷', fallbackName: 'Brazil' },
  { code: 'CL', dialCode: '+56', flag: '🇨🇱', fallbackName: 'Chile' },
];

const PROFILE_COUNTRY_BY_CODE = new Map(
  PROFILE_COUNTRY_OPTIONS.map((country) => [country.code, country] as const),
);

const COUNTRY_BY_DIAL_CODE: Partial<Record<string, ProfileCountry>> = {
  '+1': 'US',
  '+34': 'ES',
  '+52': 'MX',
  '+54': 'AR',
  '+55': 'BR',
  '+56': 'CL',
  '+57': 'CO',
};

const PHONE_PREFIX_PATTERN = /^(\+\d{1,3})\s*(.*)$/;

export function isProfileCountry(value: string): value is ProfileCountry {
  return PROFILE_COUNTRY_BY_CODE.has(value as ProfileCountry);
}

export function normalizeProfileCountry(value?: string): ProfileCountry | undefined {
  const normalizedValue = (value ?? '').trim().toUpperCase();
  return isProfileCountry(normalizedValue) ? normalizedValue : undefined;
}

export function getDefaultProfileCountry(): ProfileCountry {
  return DEFAULT_PROFILE_COUNTRY;
}

export function getProfileCountry(code?: string): ProfileCountryOption {
  const normalizedCode = normalizeProfileCountry(code);
  return PROFILE_COUNTRY_BY_CODE.get(normalizedCode ?? DEFAULT_PROFILE_COUNTRY)
    ?? PROFILE_COUNTRY_BY_CODE.get(DEFAULT_PROFILE_COUNTRY)
    ?? PROFILE_COUNTRY_OPTIONS[0];
}

export function getDialCodeForProfileCountry(code?: string): string {
  return getProfileCountry(code).dialCode;
}

export function splitProfilePhone(
  phone?: string,
  country?: string,
) {
  const normalizedPhone = (phone ?? '').trim();
  const normalizedCountry = normalizeProfileCountry(country);

  if (!normalizedPhone) {
    const fallbackCountry = normalizedCountry ?? getDefaultProfileCountry();
    return {
      country: fallbackCountry,
      dialCode: getDialCodeForProfileCountry(fallbackCountry),
      number: '',
    };
  }

  const phoneMatch = normalizedPhone.match(PHONE_PREFIX_PATTERN);

  if (normalizedCountry) {
    return {
      country: normalizedCountry,
      dialCode: getDialCodeForProfileCountry(normalizedCountry),
      number: phoneMatch ? phoneMatch[2] : normalizedPhone,
    };
  }

  if (phoneMatch) {
    const inferredCountry = COUNTRY_BY_DIAL_CODE[phoneMatch[1]]
      ?? getDefaultProfileCountry();

    return {
      country: inferredCountry,
      dialCode: getDialCodeForProfileCountry(inferredCountry),
      number: phoneMatch[2],
    };
  }

  const fallbackCountry = getDefaultProfileCountry();
  return {
    country: fallbackCountry,
    dialCode: getDialCodeForProfileCountry(fallbackCountry),
    number: normalizedPhone,
  };
}

export function getProfileCountryLabel(country: ProfileCountryOption, locale: string): string {
  try {
    const displayNames = new Intl.DisplayNames([locale], { type: 'region' });
    const localizedName = displayNames.of(country.code);

    if (localizedName) {
      return `${country.flag} ${localizedName}`;
    }
  } catch {
    // Fallback to the bundled English name when Intl.DisplayNames is unavailable.
  }

  return `${country.flag} ${country.fallbackName}`;
}
