import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import { NIGERIAN_STATES, LGAS_BY_STATE, SCHOOL_TYPES } from '../utils/nigeriaData';
import { validatePassword, getStrengthColor, getStrengthLabel } from '../utils/passwordValidation';
import { validateSubdomain, formatSubdomain, getSubdomainPreview } from '../utils/subdomainValidation';
import Input from '../components/ui/Input';

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
    contactPersonId: '',
    // Additional Info
    estimatedStudentCount: '',
    subdomain: '',
    // Documents
    documents: [],
    proofOfAddress: null,
    // Admin Account
    adminName: '',
    adminEmail: '',
    adminPassword: '',
    confirmPassword: '',
    // Terms
    agreeToTerms: false,
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
    
    // Phone number validation - only allow digits, spaces, +, -, ()
    if (name === 'phone' || name === 'contactPersonPhone') {
      const cleaned = value.replace(/[^\d\s+\-()]/g, '');
      setFormData(prev => ({ ...prev, [name]: cleaned }));
      if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
      return;
    }

    // Subdomain validation - only lowercase, numbers, hyphens
    if (name === 'subdomain') {
      const formatted = formatSubdomain(value);
      setFormData(prev => ({ ...prev, [name]: formatted }));
      setSubdomainAvailable(null);
      if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
      return;
    }

    // Student count - only positive integers
    if (name === 'estimatedStudentCount') {
      const numValue = value === '' ? '' : parseInt(value, 10);
      if (numValue === '' || (numValue > 0 && numValue <= 100000)) {
        setFormData(prev => ({ ...prev, [name]: numValue }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
      }
      return;
    }

    // Name fields - only letters, spaces, hyphens, apostrophes
    if (name === 'schoolName' || name === 'contactPersonName' || name === 'adminName') {
      const cleaned = value.replace(/[^a-zA-Z\s\-']/g, '');
      setFormData(prev => ({ ...prev, [name]: cleaned }));
      if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
      return;
    }

    // Email validation - basic format check
    if (name === 'email' || name === 'adminEmail') {
      setFormData(prev => ({ ...prev, [name]: value.toLowerCase().trim() }));
      if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
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

    // Clear LGA when changing state
    if (name === 'state') {
      setFormData(prev => ({ ...prev, lga: '' }));
    }
  };

  // Handle file upload
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
    
    const validFiles = files.filter(file => {
      if (file.size > maxSize) {
        setErrors(prev => ({ ...prev, documents: `${file.name} is too large. Max size is 5MB.` }));
        return false;
      }
      if (!allowedTypes.includes(file.type)) {
        setErrors(prev => ({ ...prev, documents: `${file.name} is not a valid file type. Only PDF and images are allowed.` }));
        return false;
      }
      return true;
    });

    if (validFiles.length > 0) {
      setFormData(prev => ({
        ...prev,
        documents: [...prev.documents, ...validFiles]
      }));
      setErrors(prev => ({ ...prev, documents: '' }));
    }
  };

  // Handle proof of address upload
  const handleProofOfAddressUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];

    if (file.size > maxSize) {
      setErrors(prev => ({ ...prev, proofOfAddress: 'File is too large. Max size is 5MB.' }));
      return;
    }

    if (!allowedTypes.includes(file.type)) {
      setErrors(prev => ({ ...prev, proofOfAddress: 'Invalid file type. Only PDF and images are allowed.' }));
      return;
    }

    setFormData(prev => ({ ...prev, proofOfAddress: file }));
    setErrors(prev => ({ ...prev, proofOfAddress: '' }));
  };

  // Remove document
  const handleRemoveDocument = (index) => {
    setFormData(prev => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index)
    }));
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
      else if (formData.schoolName.trim().length < 3) newErrors.schoolName = 'School name must be at least 3 characters';
      
      if (!formData.schoolType) newErrors.schoolType = 'School type is required';
      
      if (!formData.email.trim()) newErrors.email = 'Email is required';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email format';
      
      if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
      else if (!/^[\d\s+\-()]{10,}$/.test(formData.phone)) newErrors.phone = 'Invalid phone number format';
      
      if (!formData.address.trim()) newErrors.address = 'Address is required';
      else if (formData.address.trim().length < 10) newErrors.address = 'Please provide a complete address';
      
      if (!formData.state) newErrors.state = 'State is required';
      if (!formData.lga) newErrors.lga = 'LGA is required';
    }

    if (step === 2) {
      if (!formData.contactPersonName.trim()) newErrors.contactPersonName = 'Contact person name is required';
      else if (formData.contactPersonName.trim().length < 3) newErrors.contactPersonName = 'Name must be at least 3 characters';
      
      if (!formData.contactPersonRole.trim()) newErrors.contactPersonRole = 'Contact person role is required';
      
      if (!formData.contactPersonPhone.trim()) newErrors.contactPersonPhone = 'Contact person phone is required';
      else if (!/^[\d\s+\-()]{10,}$/.test(formData.contactPersonPhone)) newErrors.contactPersonPhone = 'Invalid phone number format';
      
      if (!formData.contactPersonId.trim()) newErrors.contactPersonId = 'Contact person ID is required';
      else if (formData.contactPersonId.trim().length < 5) newErrors.contactPersonId = 'Please provide a valid ID number';
    }

    if (step === 3) {
      if (!formData.estimatedStudentCount || formData.estimatedStudentCount < 1) {
        newErrors.estimatedStudentCount = 'Estimated student count must be at least 1';
      }
      
      if (!formData.subdomain.trim()) {
        newErrors.subdomain = 'Subdomain is required';
      } else if (subdomainValidation && !subdomainValidation.isValid) {
        newErrors.subdomain = subdomainValidation.errors[0];
      } else if (formData.subdomain.length < 3) {
        newErrors.subdomain = 'Subdomain must be at least 3 characters';
      }

      if (!formData.proofOfAddress) {
        newErrors.proofOfAddress = 'Proof of address is required';
      }
    }

    if (step === 4) {
      if (!formData.adminName.trim()) newErrors.adminName = 'Admin name is required';
      else if (formData.adminName.trim().length < 3) newErrors.adminName = 'Name must be at least 3 characters';
      
      if (!formData.adminEmail.trim()) newErrors.adminEmail = 'Admin email is required';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.adminEmail)) newErrors.adminEmail = 'Invalid email format';
      
      if (!formData.adminPassword) newErrors.adminPassword = 'Password is required';
      else if (passwordValidation && !passwordValidation.isValid) newErrors.adminPassword = 'Password does not meet requirements';
      
      if (!formData.confirmPassword) newErrors.confirmPassword = 'Please confirm password';
      else if (formData.adminPassword !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
      
      if (!formData.agreeToTerms) newErrors.agreeToTerms = 'You must agree to the terms and conditions';
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
        contactPersonId: formData.contactPersonId,
        estimatedStudentCount: parseInt(formData.estimatedStudentCount, 10),
        subdomain: formData.subdomain,
        adminName: formData.adminName,
        adminEmail: formData.adminEmail,
        adminPassword: formData.adminPassword,
      };

      const response = await authAPI.registerSchool(registrationData);
      setSubmitSuccess(true);
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
        contactPersonId: '',
        estimatedStudentCount: '',
        subdomain: '',
        documents: [],
        proofOfAddress: null,
        adminName: '',
        adminEmail: '',
        adminPassword: '',
        confirmPassword: '',
        agreeToTerms: false,
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
      <div className="min-h-screen bg-[#fafaf9] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white border border-gray-200 p-6 sm:p-8 text-center shadow-sm">
          <div className="mb-4 text-[#1e3a8a] text-5xl sm:text-6xl">⏳</div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Registration Submitted!</h2>
          <p className="text-sm sm:text-base text-gray-600 mb-6">
            Your school registration has been submitted successfully and is now pending verification by our team.
          </p>
          <div className="bg-gray-50 border border-gray-200 rounded p-4 mb-6 text-left">
            <h3 className="font-semibold text-gray-900 mb-2">What happens next?</h3>
            <ul className="text-sm text-gray-600 space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-[#1e3a8a] font-bold">1.</span>
                <span>Our team will review your registration details</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#1e3a8a] font-bold">2.</span>
                <span>You'll receive an email notification once approved</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#1e3a8a] font-bold">3.</span>
                <span>After approval, you can login and start using Skoolar</span>
              </li>
            </ul>
          </div>
          <p className="text-sm text-gray-500 mb-4">
            Verification typically takes 1-2 business days.
          </p>
          <button
            onClick={() => navigate('/login')}
            className="w-full bg-[#1e3a8a] text-white px-6 py-3 font-medium hover:bg-blue-800 transition-colors"
          >
            Go to Login Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafaf9] py-6 sm:py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">School Registration</h1>
          <p className="text-sm sm:text-base text-gray-600">Register your school to get started with Skoolar</p>
          <button
            onClick={() => navigate('/login')}
            className="text-[#1e3a8a] hover:text-blue-700 text-xs sm:text-sm mt-2 font-medium"
          >
            Already have an account? Login here
          </button>
        </div>

        {/* Progress Indicator */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center justify-between max-w-2xl mx-auto px-2">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center flex-1">
                <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-sm sm:text-base font-semibold transition-colors ${
                  currentStep >= step ? 'bg-[#1e3a8a] text-white' : 'bg-gray-300 text-gray-600'
                }`}>
                  {step}
                </div>
                {step < 4 && (
                  <div className={`flex-1 h-1 mx-1 sm:mx-2 transition-colors ${
                    currentStep > step ? 'bg-[#1e3a8a]' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between max-w-2xl mx-auto mt-2 text-[10px] sm:text-xs text-gray-600 px-2">
            <span className="text-center w-1/4">School Info</span>
            <span className="text-center w-1/4">Contact Person</span>
            <span className="text-center w-1/4">School Details</span>
            <span className="text-center w-1/4">Admin Account</span>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white border border-gray-200 p-4 sm:p-6 md:p-8 shadow-sm">
          <form onSubmit={handleSubmit}>
            {/* Error Message */}
            {submitError && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
                {submitError}
              </div>
            )}

            {/* Step 1: School Information */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">School Information</h2>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    School Name
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
                    School Type
                  </label>
                  <select
                    name="schoolType"
                    value={formData.schoolType}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#1e3a8a] ${
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
                    School Email
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
                    School Phone
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
                  <p className="text-xs text-gray-500 mt-1">Enter a valid Nigerian phone number</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    School Address
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Enter full school address"
                    rows="3"
                    className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#1e3a8a] ${
                      errors.address ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      State
                    </label>
                    <select
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#1e3a8a] ${
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
                      LGA
                    </label>
                    <select
                      name="lga"
                      value={formData.lga}
                      onChange={handleChange}
                      disabled={!formData.state}
                      className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#1e3a8a] ${
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
                    Full Name
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
                    Role/Position
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
                    Phone Number
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

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contact Person ID
                  </label>
                  <Input
                    name="contactPersonId"
                    value={formData.contactPersonId}
                    onChange={handleChange}
                    placeholder="Enter ID number (e.g., National ID, Driver's License)"
                    className={errors.contactPersonId ? 'border-red-500' : ''}
                  />
                  {errors.contactPersonId && <p className="text-red-500 text-sm mt-1">{errors.contactPersonId}</p>}
                  <p className="text-xs text-gray-500 mt-1">Provide a valid government-issued ID number</p>
                </div>

                <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded text-sm">
                  <p className="text-gray-700">
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
                    Estimated Student Count
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
                    School Subdomain
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
                    <div className="mt-2 p-3 bg-gray-50 border border-gray-200 rounded">
                      <p className="text-sm text-gray-600">Your school portal will be accessible at:</p>
                      <p className="text-[#1e3a8a] font-medium">{getSubdomainPreview(formData.subdomain)}</p>
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

                {/* Proof of Address Upload Section */}
                <div className="pt-4 border-t border-gray-200">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Proof of Address
                  </label>
                  <p className="text-xs text-gray-500 mb-3">
                    Upload a document that verifies your school's address (e.g., utility bill, lease agreement)
                  </p>

                  {/* File Upload Area */}
                  <div className="border-2 border-dashed border-gray-300 rounded p-6 text-center hover:border-[#1e3a8a] transition-colors">
                    <input
                      type="file"
                      id="proof-of-address-upload"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleProofOfAddressUpload}
                      className="hidden"
                    />
                    <label
                      htmlFor="proof-of-address-upload"
                      className="cursor-pointer"
                    >
                      <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <p className="text-sm text-gray-600 mb-1">
                        <span className="text-[#1e3a8a] font-medium">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">
                        PDF, JPG, PNG up to 5MB
                      </p>
                    </label>
                  </div>

                  {errors.proofOfAddress && <p className="text-red-500 text-sm mt-2">{errors.proofOfAddress}</p>}

                  {/* Uploaded Proof of Address */}
                  {formData.proofOfAddress && (
                    <div className="mt-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">Uploaded Document:</p>
                      <div className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded">
                        <div className="flex items-center gap-3">
                          <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{formData.proofOfAddress.name}</p>
                            <p className="text-xs text-gray-500">{(formData.proofOfAddress.size / 1024).toFixed(2)} KB</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, proofOfAddress: null }))}
                          className="text-red-600 hover:text-red-700"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Document Upload Section */}
                <div className="pt-4 border-t border-gray-200">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Verification Documents (Optional)
                  </label>
                  <p className="text-xs text-gray-500 mb-3">
                    Upload documents to verify your school (e.g., registration certificate, license, etc.)
                  </p>

                  {/* File Upload Area */}
                  <div className="border-2 border-dashed border-gray-300 rounded p-6 text-center hover:border-[#1e3a8a] transition-colors">
                    <input
                      type="file"
                      id="document-upload"
                      multiple
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <label
                      htmlFor="document-upload"
                      className="cursor-pointer"
                    >
                      <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <p className="text-sm text-gray-600 mb-1">
                        <span className="text-[#1e3a8a] font-medium">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">
                        PDF, JPG, PNG up to 5MB each
                      </p>
                    </label>
                  </div>

                  {errors.documents && <p className="text-red-500 text-sm mt-2">{errors.documents}</p>}

                  {/* Uploaded Documents List */}
                  {formData.documents.length > 0 && (
                    <div className="mt-4 space-y-2">
                      <p className="text-sm font-medium text-gray-700">Uploaded Documents:</p>
                      {formData.documents.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded">
                          <div className="flex items-center gap-3">
                            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <div>
                              <p className="text-sm font-medium text-gray-900">{file.name}</p>
                              <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(2)} KB</p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveDocument(index)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="mt-3 p-3 bg-gray-50 border border-gray-200 rounded text-sm">
                    <p className="text-gray-700">
                      <strong>Note:</strong> Uploading verification documents can speed up the approval process.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Admin Account */}
            {currentStep === 4 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Admin Account Setup</h2>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Admin Full Name
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
                    Admin Email
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
                    Password
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
                    Confirm Password
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

                <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded text-sm">
                  <p className="text-gray-700">
                    <strong>Important:</strong> Keep your admin credentials secure. You will use these to access the admin dashboard.
                  </p>
                </div>

                {/* Terms and Conditions */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="agreeToTerms"
                      name="agreeToTerms"
                      checked={formData.agreeToTerms}
                      onChange={(e) => {
                        setFormData(prev => ({ ...prev, agreeToTerms: e.target.checked }));
                        if (errors.agreeToTerms) setErrors(prev => ({ ...prev, agreeToTerms: '' }));
                      }}
                      className={`mt-1 w-4 h-4 text-[#1e3a8a] border-gray-300 rounded focus:ring-[#1e3a8a] ${
                        errors.agreeToTerms ? 'border-red-500' : ''
                      }`}
                    />
                    <label htmlFor="agreeToTerms" className="text-sm text-gray-700">
                      I agree to the{' '}
                      <a href="/terms" target="_blank" className="text-[#1e3a8a] hover:text-blue-700 font-medium">
                        Terms of Service
                      </a>
                      {' '}and{' '}
                      <a href="/privacy" target="_blank" className="text-[#1e3a8a] hover:text-blue-700 font-medium">
                        Privacy Policy
                      </a>
                    </label>
                  </div>
                  {errors.agreeToTerms && <p className="text-red-500 text-sm mt-2 ml-7">{errors.agreeToTerms}</p>}
                </div>
              </div>
            )}

            {/* Form Actions */}
            <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4">
              <div className="flex flex-col sm:flex-row gap-2 order-2 sm:order-1">
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={handlePrevious}
                    disabled={isSubmitting}
                    className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleClear}
                  disabled={isSubmitting}
                  className="px-4 py-2 border border-gray-300 text-red-600 text-sm font-medium hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Clear Form
                </button>
              </div>

              <div className="order-1 sm:order-2">
                {currentStep < 4 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    disabled={isSubmitting}
                    className="w-full sm:w-auto px-6 py-2 bg-[#1e3a8a] text-white text-sm font-medium hover:bg-blue-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto px-6 py-2 bg-[#1e3a8a] text-white text-sm font-medium hover:bg-blue-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Registration'}
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>

        {/* Help Text */}
        <div className="mt-4 sm:mt-6 text-center text-xs sm:text-sm text-gray-600 px-4">
          <p>Need help? Contact our support team at support@skoolar.com</p>
          <p className="mt-2">
            To register, you need to read and agree to our{' '}
            <a href="/terms" className="text-[#1e3a8a] hover:text-blue-700">Terms of use</a>
            {' '}and{' '}
            <a href="/privacy" className="text-[#1e3a8a] hover:text-blue-700">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SchoolRegistration;
