import { RESERVED_SUBDOMAINS } from './nigeriaData';

/**
 * Validate subdomain format
 */
export const validateSubdomain = (subdomain) => {
  const errors = [];

  if (!subdomain || subdomain.length < 3) {
    errors.push('Subdomain must be at least 3 characters long');
  }

  if (subdomain && subdomain.length > 63) {
    errors.push('Subdomain must be at most 63 characters long');
  }

  if (subdomain && !/^[a-z0-9-]+$/.test(subdomain)) {
    errors.push('Subdomain can only contain lowercase letters, numbers, and hyphens');
  }

  if (subdomain && (subdomain.startsWith('-') || subdomain.endsWith('-'))) {
    errors.push('Subdomain cannot start or end with a hyphen');
  }

  if (subdomain && subdomain.includes('--')) {
    errors.push('Subdomain cannot contain consecutive hyphens');
  }

  if (subdomain && RESERVED_SUBDOMAINS.includes(subdomain.toLowerCase())) {
    errors.push('This subdomain is reserved and cannot be used');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Format subdomain (convert to lowercase, remove invalid chars)
 */
export const formatSubdomain = (value) => {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '')
    .replace(/^-+|-+$/g, '')
    .replace(/--+/g, '-');
};

/**
 * Get subdomain preview URL
 */
export const getSubdomainPreview = (subdomain) => {
  if (!subdomain) return '';
  return `${subdomain}.skoolar.com`;
};
