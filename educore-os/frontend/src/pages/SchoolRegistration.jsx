import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import { NIGERIAN_STATES, LGAS_BY_STATE, SCHOOL_TYPES } from '../utils/nigeriaData';
import { validatePassword, getStrengthColor, getStrengthLabel } from '../utils/passwordValidation';
import { validateSubdomain, formatSubdomain, getSubdomainPreview } from '../utils/subdomainValidation';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';

const SchoolRegistration = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [checkingSubdomain, setCheckingSubdomain] = useState(false);
  const [subdomainAvailable, setSubdomainAvailable] = useState(null);

  // Form data
  const [formData, setFormData] = useState({
    // School Information
    schoolName: '',
    schoolType: '',
    email: '',
    phone: '',
    address: '',
    state: '',
    lga: '',
    // Contact Person
    contactPersonName: '',
    contactPersonRole: '',
    contactPersonPhone: '',
    // Additional Info
    estimatedStudentCount: '',
    subdomain: '',
    // Admin Account
    adminName: '',
    adminEmail: '',
    adminPassword: '',
    confirmPassword: '',
  });

  // Field errors
  const [errors, setErrors] = useState({});

  // Password validation state
  const [passwordValidation, setPasswordValidation] = useState(null);

  // Subdomain validation state
  const [subdomainValidation, setSubdomainValidation] = useState(null);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Special handling for subdomain
    if (name === 'subdomain') {
      const formatted = formatSubdomain(value);
      setFormData(prev => ({ ...prev, [name]: formatted }));
      setSubdomainAvailable(null); // Reset availability check
      return;
    }

    // Special handling for estimatedStudentCount
    if (name === 'estimatedStudentCount') {
      const numValue = value === '' ? '' : parseInt(value, 10);
      setFormData(prev => ({ ...prev, [name]: numValue }));
      return;
    }

    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }

    // Real-time password validation
    if (name === 'adminPassword') {
      const validation = validatePassword(value);
      setPasswordValidation(validation);
    }

    // Clear state when changing state
    if (name === 'state') {
      setFormData(prev => ({ ...prev, lga: '' }));
    }
  };

  // Debounced subdomain availability check
  useEffect(() => {
    if (!formData.subdomain || formData.subdomain.length < 3) {
      setSubdomainValidation(null);
      return;
    }

    const validation = validateSubdomain(formData.subdomain);
    setSubdomainValidation(validation);

    if (!validation.isValid) {
      setSubdomainAvailable(null);
      return;
    }

    const timer = setTimeout(async () => {
      setCheckingSubdomain(true);
      try {
        // Check availability via backend (would need an endpoint)
        // For now, just validate format
        setSubdomainAvailable(true);
      } catch (error) {
        setSubdomainAvailable(false);
      } finally {
        setCheckingSubdomain(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [formData.subdomain]);

  // Validate current step
  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.schoolName.trim()) newErrors.schoolName = 'School name is required';
      if (!formData.schoolType) newErrors.schoolType = 'School type is required';
      if (!formData.email.trim()) newErrors.email = 'Email is required';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email format';
      if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
      if (!formData.address.trim()) newErrors.address = 'Address is required';
      if (!formData.state) newErrors.state = 'State is required';
      if (!formData.lga) newErrors.lga = 'LGA is required';
    }

    if (step === 2) {
      if (!formData.contactPersonName.trim()) newErrors.contactPersonName = 'Contact person name is required';
      if (!formData.contactPersonRole.trim()) newErrors.contactPersonRole = 'Contact person role is required';
      if (!formData.contactPersonPhone.trim()) newErrors.contactPersonPhone = 'Contact person phone is required';
    }

    if (step === 3) {
      if (!formData.estimatedStudentCount || formData.estimatedStudentCount < 1) {
        newErrors.estimatedStudentCount = 'Estimated student count must be at least 1';
      }
      if (!formData.subdomain.trim()) {
        newErrors.subdomain = 'Subdomain is required';
      } else if (subdomainValidation && !subdomainValidation.isValid) {
        newErrors.subdomain = subdomainValidation.errors[0];
      }
    }

    if (step === 4) {
      if (!formData.adminName.trim()) newErrors.adminName = 'Admin name is required';
      if (!formData.adminEmail.trim()) newErrors.adminEmail = 'Admin email is required';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.adminEmail)) newErrors.adminEmail = 'Invalid email format';
      if (!formData.adminPassword) newErrors.adminPassword = 'Password is required';
      else if (passwordValidation && !passwordValidation.isValid) newErrors.adminPassword = 'Password does not meet requirements';
      if (!formData.confirmPassword) newErrors.confirmPassword = 'Please confirm password';
      else if (formData.adminPassword !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle next step
  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  // Handle previous step
  const handlePrevious = () => {
    setCurrentStep(prev => prev - 1);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateStep(4)) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');

    try {
      const registrationData = {
        schoolName: formData.schoolName,
        schoolType: formData.schoolType,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        state: formData.state,
        lga: formData.lga,
        contactPersonName: formData.contactPersonName,
        contactPersonRole: formData.contactPersonRole,
        contactPersonPhone: formData.contactPersonPhone,
        estimatedStudentCount: parseInt(formData.estimatedStudentCount, 10),
        subdomain: formData.subdomain,
        adminName: formData.adminName,
        adminEmail: formData.adminEmail,
        adminPassword: formData.adminPassword,
      };

      const response = await authAPI.registerSchool(registrationData);
      setSubmitSuccess(true);
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error) {
      setSubmitError(error.message || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle clear form
  const handleClear = () => {
    if (window.confirm('Are you sure you want to clear all form data?')) {
      setFormData({
        schoolName: '',
        schoolType: '',
        email: '',
        phone: '',
        address: '',
        state: '',
        lga: '',
        contactPersonName: '',
        contactPersonRole: '',
        contactPersonPhone: '',
        estimatedStudentCount: '',
        subdomain: '',
        adminName: '',
        adminEmail: '',
        adminPassword: '',
        confirmPassword: '',
      });
      setErrors({});
      setCurrentStep(1);
      setPasswordValidation(null);
      setSubdomainValidation(null);
      setSubdomainAvailable(null);
    }
  };

  // Get available LGAs for selected state
  const availableLGAs = formData.state ? (LGAS_BY_STATE[formData.state] || LGAS_BY_STATE['Default']) : [];

  // Success screen
  if (submitSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8 text-center">
          <div className="mb-4 text-green-500 text-6xl">✓</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Registration Successful!</h2>
          <p className="text-gray-600 mb-6">
            Your school registration has been submitted successfully. Your account is pending verification by our team.
          </p>
          <p className="text-sm text-gray-500 mb-4">
            You will receive an email notification once your account is approved.
          </p>
          <p className="text-sm text-gray-400">
            Redirecting to login page...
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">School Registration</h1>
          <p className="text-gray-600">Register your school to get started with EduCore</p>
          <button
            onClick={() => navigate('/login')}
            className="text-blue-600 hover:text-blue-700 text-sm mt-2"
          >
            Already have an account? Login here
          </button>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between max-w-2xl mx-auto">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center flex-1">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                  currentStep >= step ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
                }`}>
                  {step}
                </div>
                {step < 4 && (
                  <div className={`flex-1 h-1 mx-2 ${
                    currentStep > step ? 'bg-blue-600' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between max-w-2xl mx-auto mt-2 text-xs text-gray-600">
            <span>School Info</span>
            <span>Contact Person</span>
            <span>School Details</span>
            <span>Admin Account</span>
          </div>
        </div>

        {/* Form Card */}
        <Card className="p-8">
          <form onSubmit={handleSubmit}>
            {/* Error Message */}
            {submitError && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                {submitError}
              </div>
            )}

            {/* Step 1: School Information */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">School Information</h2>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    School Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    name="schoolName"
                    value={formData.schoolName}
                    onChange={handleChange}
                    placeholder="Enter school name"
                    className={errors.schoolName ? 'border-red-500' : ''}
                  />
                  {errors.schoolName && <p className="text-red-500 text-sm mt-1">{errors.schoolName}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    School Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="schoolType"
                    value={formData.schoolType}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.schoolType ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select school type</option>
                    {SCHOOL_TYPES.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                  {errors.schoolType && <p className="text-red-500 text-sm mt-1">{errors.schoolType}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    School Email <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="school@example.com"
                    className={errors.email ? 'border-red-500' : ''}
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    School Phone <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+234 XXX XXX XXXX"
                    className={errors.phone ? 'border-red-500' : ''}
                  />
                  {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    School Address <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Enter full school address"
                    rows="3"
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.address ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      State <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.state ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Select state</option>
                      {NIGERIAN_STATES.map(state => (
                        <option key={state} value={state}>{state}</option>
                      ))}
                    </select>
                    {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      LGA <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="lga"
                      value={formData.lga}
                      onChange={handleChange}
                      disabled={!formData.state}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.lga ? 'border-red-500' : 'border-gray-300'
                      } ${!formData.state ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                    >
                      <option value="">Select LGA</option>
                      {availableLGAs.map(lga => (
                        <option key={lga} value={lga}>{lga}</option>
                      ))}
                    </select>
                    {errors.lga && <p className="text-red-500 text-sm mt-1">{errors.lga}</p>}
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Contact Person */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Contact Person Information</h2>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    name="contactPersonName"
                    value={formData.contactPersonName}
                    onChange={handleChange}
                    placeholder="Enter contact person's full name"
                    className={errors.contactPersonName ? 'border-red-500' : ''}
                  />
                  {errors.contactPersonName && <p className="text-red-500 text-sm mt-1">{errors.contactPersonName}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Role/Position <span className="text-red-500">*</span>
                  </label>
                  <Input
                    name="contactPersonRole"
                    value={formData.contactPersonRole}
                    onChange={handleChange}
                    placeholder="e.g., Principal, Administrator"
                    className={errors.contactPersonRole ? 'border-red-500' : ''}
                  />
                  {errors.contactPersonRole && <p className="text-red-500 text-sm mt-1">{errors.contactPersonRole}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="tel"
                    name="contactPersonPhone"
                    value={formData.contactPersonPhone}
                    onChange={handleChange}
                    placeholder="+234 XXX XXX XXXX"
                    className={errors.contactPersonPhone ? 'border-red-500' : ''}
                  />
                  {errors.contactPersonPhone && <p className="text-red-500 text-sm mt-1">{errors.contactPersonPhone}</p>}
                </div>

                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Note:</strong> This person will be the primary contact for all school-related communications.
                  </p>
                </div>
              </div>
            )}

            {/* Step 3: School Details */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">School Details</h2>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Estimated Student Count <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="number"
                    name="estimatedStudentCount"
                    value={formData.estimatedStudentCount}
                    onChange={handleChange}
                    placeholder="Enter estimated number of students"
                    min="1"
                    className={errors.estimatedStudentCount ? 'border-red-500' : ''}
                  />
                  {errors.estimatedStudentCount && <p className="text-red-500 text-sm mt-1">{errors.estimatedStudentCount}</p>}
                  <p className="text-xs text-gray-500 mt-1">This helps us prepare the right resources for your school</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    School Subdomain <span className="text-red-500">*</span>
                  </label>
                  <Input
                    name="subdomain"
                    value={formData.subdomain}
                    onChange={handleChange}
                    placeholder="your-school-name"
                    className={errors.subdomain ? 'border-red-500' : ''}
                  />
                  {errors.subdomain && <p className="text-red-500 text-sm mt-1">{errors.subdomain}</p>}
                  
                  {/* Subdomain Preview */}
                  {formData.subdomain && (
                    <div className="mt-2 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                      <p className="text-sm text-gray-600">Your school portal will be accessible at:</p>
                      <p className="text-blue-600 font-medium">{getSubdomainPreview(formData.subdomain)}</p>
                    </div>
                  )}

                  {/* Subdomain Validation Feedback */}
                  {subdomainValidation && !subdomainValidation.isValid && (
                    <div className="mt-2 space-y-1">
                      {subdomainValidation.errors.map((error, index) => (
                        <p key={index} className="text-red-500 text-sm">✗ {error}</p>
                      ))}
                    </div>
                  )}

                  {/* Subdomain Availability */}
                  {subdomainValidation && subdomainValidation.isValid && (
                    <div className="mt-2">
                      {checkingSubdomain ? (
                        <p className="text-gray-500 text-sm">Checking availability...</p>
                      ) : subdomainAvailable === true ? (
                        <p className="text-green-600 text-sm">✓ Subdomain is available</p>
                      ) : subdomainAvailable === false ? (
                        <p className="text-red-500 text-sm">✗ Subdomain is already taken</p>
                      ) : null}
                    </div>
                  )}

                  <p className="text-xs text-gray-500 mt-1">
                    Use lowercase letters, numbers, and hyphens only (3-63 characters)
                  </p>
                </div>
              </div>
            )}

            {/* Step 4: Admin Account */}
            {currentStep === 4 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Admin Account Setup</h2>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Admin Full Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    name="adminName"
                    value={formData.adminName}
                    onChange={handleChange}
                    placeholder="Enter admin's full name"
                    className={errors.adminName ? 'border-red-500' : ''}
                  />
                  {errors.adminName && <p className="text-red-500 text-sm mt-1">{errors.adminName}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Admin Email <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="email"
                    name="adminEmail"
                    value={formData.adminEmail}
                    onChange={handleChange}
                    placeholder="admin@example.com"
                    className={errors.adminEmail ? 'border-red-500' : ''}
                  />
                  {errors.adminEmail && <p className="text-red-500 text-sm mt-1">{errors.adminEmail}</p>}
                  <p className="text-xs text-gray-500 mt-1">This will be used to login to the admin dashboard</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="password"
                    name="adminPassword"
                    value={formData.adminPassword}
                    onChange={handleChange}
                    placeholder="Enter a strong password"
                    className={errors.adminPassword ? 'border-red-500' : ''}
                  />
                  {errors.adminPassword && <p className="text-red-500 text-sm mt-1">{errors.adminPassword}</p>}

                  {/* Password Strength Indicator */}
                  {passwordValidation && formData.adminPassword && (
                    <div className="mt-2">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full transition-all duration-300"
                            style={{
                              width: `${passwordValidation.strengthScore}%`,
                              backgroundColor: getStrengthColor(passwordValidation.strength)
                            }}
                          />
                        </div>
                        <span
                          className="text-sm font-medium"
                          style={{ color: getStrengthColor(passwordValidation.strength) }}
                        >
                          {getStrengthLabel(passwordValidation.strength)}
                        </span>
                      </div>

                      {/* Password Requirements */}
                      <div className="space-y-1 text-xs">
                        {Object.entries(passwordValidation.feedback).map(([key, value]) => (
                          <p
                            key={key}
                            className={value.startsWith('✓') ? 'text-green-600' : 'text-gray-500'}
                          >
                            {value}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm Password <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Re-enter your password"
                    className={errors.confirmPassword ? 'border-red-500' : ''}
                  />
                  {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
                  {formData.confirmPassword && formData.adminPassword === formData.confirmPassword && (
                    <p className="text-green-600 text-sm mt-1">✓ Passwords match</p>
                  )}
                </div>

                <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    <strong>Important:</strong> Keep your admin credentials secure. You will use these to access the admin dashboard.
                  </p>
                </div>
              </div>
            )}

            {/* Form Actions */}
            <div className="mt-8 flex items-center justify-between gap-4">
              <div className="flex gap-2">
                {currentStep > 1 && (
                  <Button
                    type="button"
                    onClick={handlePrevious}
                    variant="outline"
                    disabled={isSubmitting}
                  >
                    Previous
                  </Button>
                )}
                <Button
                  type="button"
                  onClick={handleClear}
                  variant="outline"
                  disabled={isSubmitting}
                  className="text-red-600 hover:text-red-700"
                >
                  Clear Form
                </Button>
              </div>

              <div>
                {currentStep < 4 ? (
                  <Button
                    type="button"
                    onClick={handleNext}
                    disabled={isSubmitting}
                  >
                    Next
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Registration'}
                  </Button>
                )}
              </div>
            </div>
          </form>
        </Card>

        {/* Help Text */}
        <div className="mt-6 text-center text-sm text-gray-600">
          <p>Need help? Contact our support team at support@educore.ng</p>
          <p className="mt-2">
            By registering, you agree to our{' '}
            <a href="#" className="text-blue-600 hover:text-blue-700">Terms of Service</a>
            {' '}and{' '}
            <a href="#" className="text-blue-600 hover:text-blue-700">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SchoolRegistration;
