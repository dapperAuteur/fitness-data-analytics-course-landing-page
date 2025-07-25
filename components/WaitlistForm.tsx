"use client"

import React, { useCallback, useState, useEffect } from 'react';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import clientLogger from '../logging/clientLogger';
import ShareButtons from '@/components/ShareButtons';

interface FormValues {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
}

interface FormErrors {
    [key: string]: string | undefined;
}

// Phone regex for client-side validation
const phoneRegex = /^\+?[1-9]\d{6,14}$/;
const emailRegex = /.+\@.+\..+/;

// --- Form Component with reCAPTCHA Logic ---
export default function WaitlistForm({ pageSource }: { pageSource: string }) {
  // NEW: Get the reCAPTCHA execution function
  const { executeRecaptcha } = useGoogleReCaptcha();

  const [formData, setFormData] = useState<FormValues>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [referrer, setReferrer] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string>('');
  const [pageSourceState, setpageSourceState] = useState(pageSource)

  const validate = () => {
    const newErrors: FormErrors = {};
    if (!formData.firstName) newErrors.firstName = 'First name is required.';
    if (!formData.lastName) newErrors.lastName = 'Last name is required.';
    if (!formData.email) {
        newErrors.email = 'Email is required.';
    } else if (!emailRegex.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address.';
    }
    // Phone number is optional, if phone validate.
    if (formData.phone.length > 0 && !phoneRegex.test(formData.phone)) {
        newErrors.phone = 'Please enter a valid phone number (e.g., +11234567890).';
    }
    
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
        clientLogger.warn('Client-side validation failed', { errors: newErrors });
    }
    return Object.keys(newErrors).length === 0;
  };

  // UPDATED: handleSubmit is now wrapped in useCallback and includes reCAPTCHA
  const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    console.log('referrer :>> ', referrer);
    e.preventDefault();
    setServerError('');
    if (!validate()) {
      return;
    }

    // NEW: Check if reCAPTCHA is ready
    if (!executeRecaptcha) {
      clientLogger.error("reCAPTCHA not available yet");
      setServerError("Verification service is not ready. Please try again in a moment.");
      return;
    }

    setIsSubmitting(true);
    clientLogger.info('Submitting waitlist form', { formData });

    // NEW: Get reCAPTCHA token
    const token = await executeRecaptcha('3pageEbook');

    try {
        const response = await fetch('/api/waitlist', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            // NEW: Send token with the form data
            body: JSON.stringify({ ...formData, pageSourceState, referrer, token }),
        });
        console.log('pageSourceState :>> ', pageSourceState);

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || 'An unknown error occurred.');
        }

        clientLogger.info('Waitlist submission successful');

        // --- NEW: If successful, also send to Keap ---
        // This is a "fire-and-forget" call so it doesn't slow down the UI.
        // sendToKeap(formData);

        setIsSubmitted(true);
    } catch (error: any) {
        clientLogger.error('Waitlist submission failed', { error: error.message });
        setServerError(error.message as string);
    } finally {
        setIsSubmitting(false);
    }
  }, [executeRecaptcha, formData, referrer]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const resetFormAndGoBack = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
    });
    setErrors({});
    setServerError('');
    setIsSubmitted(false);
  };

  useEffect(() => {
    setReferrer(document.referrer);
    setpageSourceState(pageSource);
    clientLogger.info('Landing page loaded', { referrer: document.referrer });
    console.log('referrer :>> ', referrer);
    console.log('pageSource :>> ', pageSource);
  }, [pageSource]);

  if (isSubmitted) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-3xl font-bold text-gray-900 mb-4">Thank You!</h3>
        <p className="text-xl text-gray-600 mb-6">You're on the waitlist!</p>
        <button
          type="button"
          onClick={resetFormAndGoBack}
          className="w-full bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white font-bold py-4 px-8 rounded-lg"
        >
          <ArrowLeft className="inline w-5 h-5 mr-2" />
          Submit Another Response
        </button>
        <div className="mt-8">
          <p className="text-gray-600 mb-4">Share with others!</p>
          <ShareButtons />
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="text-center mb-8">
        <h2 className="rounded-2xl text-4xl font-bold text-gray-900 mb-4">Start Your Centenarian Journey Today</h2>
        <p className="text-xl text-gray-600">Join our waitlist to be the first to know when enrollment opens.</p>
      </div>
      <form onSubmit={handleSubmit} noValidate>
        <div className="space-y-6 text-gray-900">
          <div className="grid md:grid-cols-2 gap-6 text-gray-950">
            <div>
              <label className="block text-sm font-medium mb-2">First Name *</label>
              <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} className={`w-full px-4 py-3 border rounded-lg focus:ring-2 ${errors.firstName ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-purple-500'}`} placeholder="Enter your first name" />
              {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Last Name *</label>
              <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} className={`w-full px-4 py-3 border rounded-lg focus:ring-2 ${errors.lastName ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-purple-500'}`} placeholder="Enter your last name" />
              {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Email Address *</label>
            <input type="email" name="email" value={formData.email} onChange={handleInputChange} className={`w-full px-4 py-3 border rounded-lg focus:ring-2 ${errors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-purple-500'}`} placeholder="Enter your email" />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Phone Number</label>
            <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className={`w-full px-4 py-3 border rounded-lg focus:ring-2 ${errors.phone ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-purple-500'}`} placeholder="+11234567890" />
            {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
          </div>
          {serverError && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">{serverError}</div>}
          <button type="submit" disabled={isSubmitting} className="w-full bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white font-bold py-4 px-8 rounded-lg hover:from-purple-700 hover:to-fuchsia-700 transition-all duration-200 flex items-center justify-center gap-2 text-lg disabled:opacity-50">
            {isSubmitting ? 'Submitting...' : 'Join the Waitlist'}
            {!isSubmitting && <ArrowRight className="w-5 h-5" />}
          </button>
        </div>
        <ShareButtons />
      </form>
    </>
  );
}