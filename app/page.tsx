"use client"
import React, { useCallback, useState, useEffect } from 'react';
import { GoogleReCaptchaProvider, useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import clientLogger from '../logging/clientLogger';
import Hero from '@/components/Hero';
import Header from '@/components/Header';
import CourseOverview from '@/components/CourseOverview';
import WeeklyBreakdown from '@/components/WeeklyBreakdown';
import Specialization from '@/components/Specialization';
import Footer from '@/components/Footer';
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
const WaitlistForm = () => {
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

  useEffect(() => {
    setReferrer(document.referrer);
    clientLogger.info('Landing page loaded', { referrer: document.referrer });
  }, []);

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
    const token = await executeRecaptcha('waitlistSubmit');

    try {
        const response = await fetch('/api/waitlist', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            // NEW: Send token with the form data
            body: JSON.stringify({ ...formData, referrer, token }),
        });

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

  return (
    <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-2xl">
      {!isSubmitted ? (
        <>
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Start Your Centenarian Journey Today</h2>
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
      ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Thank You!</h3>
            <p className="text-xl text-gray-600 mb-6">You're on the waitlist! We'll notify you when enrollment opens.</p>
            <p className="text-gray-600 mb-8">In the meantime, share this opportunity with others!</p>
            <button
              type="button"
              onClick={resetFormAndGoBack}
              className="w-full bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white font-bold py-4 px-8 rounded-lg hover:from-purple-700 hover:to-fuchsia-700 transition-all duration-200 flex items-center justify-center gap-2 text-lg disabled:opacity-50"
            >
              <ArrowLeft className="w-5 h-5" />
              Submit Another Response
            </button>
            <ShareButtons />
        </div>
      )}
    </div>
  );
}

const FitnessAnalyticsLanding = () => {

  const recaptchaSiteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

  if (!recaptchaSiteKey) {
    // A simple error message if the key is missing
    return (
        <div className="flex items-center justify-center h-screen">
            <p className="text-red-500 bg-red-100 p-4 rounded-lg">reCAPTCHA Site Key is not configured. Please check your environment variables.</p>
        </div>
    );
  }
  // const [formData, setFormData] = useState<FormValues>({
  //   firstName: '',
  //   lastName: '',
  //   email: '',
  //   phone: '',
  // });
  // const [errors, setErrors] = useState<FormErrors>({});
  // const [referrer, setReferrer] = useState('');
  // const [isSubmitted, setIsSubmitted] = useState(false);
  // const [isSubmitting, setIsSubmitting] = useState(false);
  // const [serverError, setServerError] = useState<string>('');

  // useEffect(() => {
  //   // Capture referrer URL on component mount
  //   setReferrer(document.referrer);
  //   clientLogger.info('Landing page loaded', { referrer: document.referrer });
  // }, []);

  // const validate = () => {
  //   const newErrors: FormErrors = {};
  //   if (!formData.firstName) newErrors.firstName = 'First name is required.';
  //   if (!formData.lastName) newErrors.lastName = 'Last name is required.';
  //   if (!formData.email) {
  //       newErrors.email = 'Email is required.';
  //   } else if (!emailRegex.test(formData.email)) {
  //       newErrors.email = 'Please enter a valid email address.';
  //   }
    // if (!formData.phone) {
    //     newErrors.phone = 'Phone number is required.';
    // } else if (!phoneRegex.test(formData.phone)) {
    //     newErrors.phone = 'Please enter a valid phone number (e.g., +11234567890).';
    // }
    
  //   setErrors(newErrors);
  //   if (Object.keys(newErrors).length > 0) {
  //       clientLogger.warn('Client-side validation failed', { errors: newErrors });
  //   }
  //   return Object.keys(newErrors).length === 0;
  // };

  // const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   setServerError('');
  //   if (!validate()) {
  //     return;
  //   }

  //   setIsSubmitting(true);
  //   clientLogger.info('Submitting waitlist form', { formData });

  //   try {
  //       const response = await fetch('/api/waitlist', {
  //           method: 'POST',
  //           headers: { 'Content-Type': 'application/json' },
  //           body: JSON.stringify({ ...formData, referrer }),
  //       });

  //       const result = await response.json();

  //       if (!response.ok) {
  //           throw new Error(result.message || 'An unknown error occurred.');
  //       }

  //       clientLogger.info('Waitlist submission successful');
  //       setIsSubmitted(true);
  //   } catch (error: any) {
  //       clientLogger.error('Waitlist submission failed', { error: error.message });
  //       setServerError(error.message as string);
  //   } finally {
  //       setIsSubmitting(false);
  //   }
  // };

  // const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setFormData({
  //     ...formData,
  //     [e.target.name]: e.target.value
  //   });
  // };

  // const resetFormAndGoBack = () => {
  //   setFormData({
  //     firstName: '',
  //     lastName: '',
  //     email: '',
  //     phone: '',
  //   });
  //   setErrors({});
  //   setServerError('');
  //   setIsSubmitted(false);
  // };
  
  // const shareUrl = "YOUR_WEBSITE_URL"; // IMPORTANT: Replace with your actual URL
  // const shareTitle = "Foundations of Fitness and Health Metrics Course";

  return (
    <GoogleReCaptchaProvider reCaptchaKey={recaptchaSiteKey}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-orange-50">
        <section className="relative overflow-hidden bg-gradient-to-br from-purple-600 via-fuchsia-600 to-pink-500 text-white">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <Header />
            <Hero />
          </div>
        </div>
      </section>
      <CourseOverview />
      <WeeklyBreakdown />
      <Specialization />
          
        {/* Lead Magnet Form Section */}
        <section id="join-waitlist" className="py-20 bg-gradient-to-br from-purple-600 via-fuchsia-600 to-pink-500">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-2xl">
              {!isSubmitted ? (
                <>
                  <div className="text-center mb-8">
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">Start Your Centenarian Journey Today</h2>
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
              ) : (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Check className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900 mb-4">Thank You!</h3>
                    <p className="text-xl text-gray-600 mb-6">You're on the waitlist! We'll notify you when enrollment opens.</p>
                    <p className="text-gray-600 mb-8">In the meantime, share this opportunity with others!</p>
                    <button
                      type="button"
                      onClick={resetFormAndGoBack}
                      className="w-full bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white font-bold py-4 px-8 rounded-lg hover:from-purple-700 hover:to-fuchsia-700 transition-all duration-200 flex items-center justify-center gap-2 text-lg disabled:opacity-50"
                    >
                      <ArrowLeft className="w-5 h-5" />
                      Submit Another Response
                    </button>
                    <ShareButtons />
                </div>
              )}
            </div> */}
            <WaitlistForm />
          </div>
        </section>
          
          {/* ... Footer remains the same ... */}
        <Footer />
      </div>
    </GoogleReCaptchaProvider>
  );
};

export default FitnessAnalyticsLanding;