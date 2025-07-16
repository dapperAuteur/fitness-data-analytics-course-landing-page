"use client"
import React, { useState, useEffect } from 'react';
import { Heart, Activity, BarChart3, TrendingUp, Users, BookOpen, ArrowRight, Check, Star, Clock, Target, Zap, Linkedin, Facebook, Mail } from 'lucide-react';
import clientLogger from '@/logging/clientLogger'; // Adjust path if needed

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
const phoneRegex = /^\+?[1-9]\d{1,14}$/;
const emailRegex = /.+\@.+\..+/;



function Form() {

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
    // Capture referrer URL on component mount
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
    if (!formData.phone) {
        newErrors.phone = 'Phone number is required.';
    } else if (!phoneRegex.test(formData.phone)) {
        newErrors.phone = 'Please enter a valid phone number (e.g., +11234567890).';
    }
    
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
        clientLogger.warn('Client-side validation failed', { errors: newErrors });
    }
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setServerError('');
    if (!validate()) {
      return;
    }

    setIsSubmitting(true);
    clientLogger.info('Submitting waitlist form', { formData });

    try {
        const response = await fetch('/api/waitlist', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...formData, referrer }),
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || 'An unknown error occurred.');
        }

        clientLogger.info('Waitlist submission successful');
        setIsSubmitted(true);
    } catch (error: any) {
        clientLogger.error('Waitlist submission failed', { error: error.message });
        setServerError(error.message as string);
    } finally {
        setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  
  const shareUrl = "YOUR_WEBSITE_URL"; // IMPORTANT: Replace with your actual URL
  const shareTitle = "Foundations of Fitness and Health Metrics Course";
  return (
          <form onSubmit={handleSubmit} noValidate>
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">First Name *</label>
                  <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} className={`w-full px-4 py-3 border rounded-lg focus:ring-2 ${errors.firstName ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-purple-500'}`} placeholder="Enter your first name" />
                  {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                  <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} className={`w-full px-4 py-3 border rounded-lg focus:ring-2 ${errors.lastName ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-purple-500'}`} placeholder="Enter your last name" />
                  {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                <input type="email" name="email" value={formData.email} onChange={handleInputChange} className={`w-full px-4 py-3 border rounded-lg focus:ring-2 ${errors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-purple-500'}`} placeholder="Enter your email" />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className={`w-full px-4 py-3 border rounded-lg focus:ring-2 ${errors.phone ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-purple-500'}`} placeholder="+11234567890" />
                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
              </div>
              {serverError && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">{serverError}</div>}
              <button type="submit" disabled={isSubmitting} className="w-full bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white font-bold py-4 px-8 rounded-lg hover:from-purple-700 hover:to-fuchsia-700 transition-all duration-200 flex items-center justify-center gap-2 text-lg disabled:opacity-50">
                {isSubmitting ? 'Submitting...' : 'Join the Waitlist'}
                {!isSubmitting && <ArrowRight className="w-5 h-5" />}
              </button>
            </div>
          </form>
  )
}

export default Form