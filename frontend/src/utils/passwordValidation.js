/**
 * Validate password strength and return detailed feedback
 */
export const validatePassword = (password) => {
  const requirements = {
    minLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };

  const metRequirements = Object.values(requirements).filter(Boolean).length;
  
  let strength = 'weak';
  let strengthScore = 0;

  if (metRequirements >= 5) {
    strength = 'strong';
    strengthScore = 100;
  } else if (metRequirements >= 3) {
    strength = 'medium';
    strengthScore = 60;
  } else {
    strength = 'weak';
    strengthScore = 30;
  }

  const isValid = Object.values(requirements).every(Boolean);

  return {
    isValid,
    strength,
    strengthScore,
    requirements,
    feedback: {
      minLength: requirements.minLength ? '✓ At least 8 characters' : '✗ At least 8 characters',
      hasUppercase: requirements.hasUppercase ? '✓ Contains uppercase letter' : '✗ Contains uppercase letter',
      hasLowercase: requirements.hasLowercase ? '✓ Contains lowercase letter' : '✗ Contains lowercase letter',
      hasNumber: requirements.hasNumber ? '✓ Contains number' : '✗ Contains number',
      hasSpecial: requirements.hasSpecial ? '✓ Contains special character' : '✗ Contains special character',
    }
  };
};

/**
 * Get password strength color
 */
export const getStrengthColor = (strength) => {
  switch (strength) {
    case 'strong':
      return '#10b981'; // green
    case 'medium':
      return '#f59e0b'; // yellow
    case 'weak':
    default:
      return '#ef4444'; // red
  }
};

/**
 * Get password strength label
 */
export const getStrengthLabel = (strength) => {
  switch (strength) {
    case 'strong':
      return 'Strong';
    case 'medium':
      return 'Medium';
    case 'weak':
    default:
      return 'Weak';
  }
};
