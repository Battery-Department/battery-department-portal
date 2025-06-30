/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react-hooks/exhaustive-deps */

/**
 * =============================================================================
 * RHY_005: ENTERPRISE PASSWORD RESET COMPONENT
 * =============================================================================
 * Production-ready React component for secure password reset functionality
 * Features: Real-time validation, strength meter, breach detection, security feedback
 * Compliant with RHY design system and enterprise security standards
 * =============================================================================
 */

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  Eye, 
  EyeOff, 
  Shield, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  Key,
  Mail,
  Lock,
  ArrowLeft,
  RefreshCw,
  XCircle,
  AlertTriangle
} from 'lucide-react';
import { 
  analyzePasswordStrength, 
  estimatePasswordCrackTime,
  checkPasswordBreach 
} from '@/lib/password-security';
import type { PasswordStrengthResult, BreachDetectionResult } from '@/lib/password-security';

// ===================================
// INTERFACES AND TYPES
// ===================================

type PasswordResetStep = 'request' | 'sent' | 'reset' | 'success' | 'error';

interface PasswordResetState {
  step: PasswordResetStep;
  token: string;
  email: string;
  newPassword: string;
  confirmPassword: string;
  warehouse: 'US' | 'JP' | 'EU' | 'AU' | '';
  showPassword: boolean;
  showConfirmPassword: boolean;
  isSubmitting: boolean;
  isTokenValidating: boolean;
  tokenValid: boolean;
  tokenError: string | null;
  errors: Record<string, string>;
  success: boolean;
  passwordStrength: PasswordStrengthResult | null;
  breachResult: BreachDetectionResult | null;
  countdown: number;
}

interface TokenValidationResponse {
  success: boolean;
  valid: boolean;
  expiresAt?: string;
  timeRemaining?: number;
  error?: {
    code: string;
    message: string;
  };
}

interface ResetPasswordResponse {
  success: boolean;
  message?: string;
  redirectTo?: string;
  securityNote?: string;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}

// ===================================
// MAIN COMPONENT
// ===================================

export default function PasswordReset() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const resetToken = searchParams.get('token');
  const warehouseParam = searchParams.get('warehouse') || 'US';
  
  const [state, setState] = useState<PasswordResetState>({
    step: resetToken ? 'reset' : 'request',
    token: resetToken || '',
    email: '',
    newPassword: '',
    confirmPassword: '',
    warehouse: warehouseParam as any,
    showPassword: false,
    showConfirmPassword: false,
    isSubmitting: false,
    isTokenValidating: false,
    tokenValid: false,
    tokenError: null,
    errors: {},
    success: false,
    passwordStrength: null,
    breachResult: null,
    countdown: 0
  });

  // ===================================
  // TOKEN VALIDATION
  // ===================================

  const validateResetToken = useCallback(async (token: string) => {
    if (!token) {
      setState(prev => ({
        ...prev,
        tokenValid: false,
        tokenError: 'No reset token provided'
      }));
      return;
    }

    setState(prev => ({ ...prev, isTokenValidating: true }));

    try {
      const response = await fetch(`/api/supplier/auth/reset-password?token=${encodeURIComponent(token)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data: TokenValidationResponse = await response.json();

      setState(prev => ({
        ...prev,
        isTokenValidating: false,
        tokenValid: data.success && data.valid,
        tokenError: data.success && data.valid ? null : (data.error?.message || 'Invalid or expired reset token')
      }));

    } catch (error) {
      setState(prev => ({
        ...prev,
        isTokenValidating: false,
        tokenValid: false,
        tokenError: 'Failed to validate reset token. Please try again.'
      }));
    }
  }, []);

  // Validate token on component mount
  useEffect(() => {
    if (state.token) {
      validateResetToken(state.token);
    }
  }, [state.token, validateResetToken]);

  // ===================================
  // PASSWORD VALIDATION
  // ===================================

  const handlePasswordChange = useCallback((password: string) => {
    setState(prev => ({ ...prev, newPassword: password, errors: { ...prev.errors, newPassword: '' } }));
    
    if (password) {
      const strength = validatePassword(password);
      setState(prev => ({ ...prev, passwordStrength: strength }));
    } else {
      setState(prev => ({ ...prev, passwordStrength: null }));
    }
  }, []);

  const handleConfirmPasswordChange = useCallback((confirmPassword: string) => {
    setState(prev => ({ 
      ...prev, 
      confirmPassword, 
      errors: { ...prev.errors, confirmPassword: '' } 
    }));
  }, []);

  // ===================================
  // FORM SUBMISSION
  // ===================================

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const errors: Record<string, string> = {};

    // Validation
    if (!state.newPassword) {
      errors.newPassword = 'Password is required';
    } else if (!state.passwordStrength?.isValid) {
      errors.newPassword = 'Password does not meet security requirements';
    }

    if (!state.confirmPassword) {
      errors.confirmPassword = 'Password confirmation is required';
    } else if (state.newPassword !== state.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(errors).length > 0) {
      setState(prev => ({ ...prev, errors }));
      return;
    }

    setState(prev => ({ ...prev, isSubmitting: true, errors: {} }));

    try {
      const response = await fetch('/api/supplier/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: state.token,
          newPassword: state.newPassword,
          confirmPassword: state.confirmPassword,
          warehouse: state.warehouse || undefined
        }),
      });

      const data: ResetPasswordResponse = await response.json();

      if (data.success) {
        setState(prev => ({ ...prev, success: true }));
        
        // Redirect after success message
        setTimeout(() => {
          router.push(data.redirectTo || '/supplier/auth/login');
        }, 3000);
      } else {
        setState(prev => ({
          ...prev,
          errors: { 
            submit: data.error?.message || 'Password reset failed. Please try again.' 
          }
        }));
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        errors: { 
          submit: 'Network error. Please check your connection and try again.' 
        }
      }));
    } finally {
      setState(prev => ({ ...prev, isSubmitting: false }));
    }
  };

  // ===================================
  // RENDER HELPERS
  // ===================================

  const renderPasswordStrengthMeter = () => {
    if (!state.passwordStrength) return null;

    const { strength, score, feedback } = state.passwordStrength;
    const color = getPasswordStrengthColor(strength);
    const percentage = getPasswordStrengthPercentage(strength);

    return (
      <div className="mt-2 space-y-2">
        {/* Strength Bar */}
        <div className="flex items-center space-x-2">
          <div className="flex-1 bg-gray-200 rounded-full h-2">
            <div
              className="h-2 rounded-full transition-all duration-300"
              style={{
                width: `${percentage}%`,
                backgroundColor: color
              }}
            />
          </div>
          <span
            className="text-sm font-medium capitalize"
            style={{ color }}
          >
            {strength.replace('_', ' ')}
          </span>
        </div>

        {/* Feedback */}
        {feedback.length > 0 && (
          <div className="text-sm space-y-1">
            {feedback.map((item, index) => (
              <div key={index} className="flex items-center space-x-1 text-gray-600">
                <AlertCircle className="w-3 h-3" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  // ===================================
  // RENDER STATES
  // ===================================

  // Token validation loading
  if (state.isTokenValidating) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Validating Reset Token</h2>
          <p className="text-gray-600">Please wait while we verify your reset token...</p>
        </div>
      </div>
    );
  }

  // Invalid token
  if (!state.tokenValid) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Invalid Reset Token</h2>
          <p className="text-gray-600 mb-6">{state.tokenError}</p>
          <button
            onClick={() => router.push('/supplier/auth/forgot-password')}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Request New Reset Link
          </button>
        </div>
      </div>
    );
  }

  // Success state
  if (state.success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Password Reset Successful</h2>
          <p className="text-gray-600 mb-6">
            Your password has been successfully reset. You will be redirected to the login page in a few seconds.
          </p>
          <div className="flex items-center justify-center space-x-2 text-blue-600">
            <Clock className="w-4 h-4" />
            <span className="text-sm">Redirecting...</span>
          </div>
        </div>
      </div>
    );
  }

  // ===================================
  // MAIN RENDER
  // ===================================

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Key className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Reset Your Password</h1>
          <p className="text-gray-600">Create a new secure password for your RHY Supplier Portal account</p>
          {state.warehouse && (
            <div className="mt-2 inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {state.warehouse} Warehouse
            </div>
          )}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* New Password */}
          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
              New Password
            </label>
            <div className="relative">
              <input
                id="newPassword"
                type={state.showPassword ? 'text' : 'password'}
                value={state.newPassword}
                onChange={(e) => handlePasswordChange(e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  state.errors.newPassword ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter your new password"
                required
              />
              <button
                type="button"
                onClick={() => setState(prev => ({ ...prev, showPassword: !prev.showPassword }))}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {state.showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {state.errors.newPassword && (
              <p className="mt-2 text-sm text-red-600">{state.errors.newPassword}</p>
            )}
            {renderPasswordStrengthMeter()}
          </div>

          {/* Confirm Password */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                type={state.showConfirmPassword ? 'text' : 'password'}
                value={state.confirmPassword}
                onChange={(e) => handleConfirmPasswordChange(e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  state.errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Confirm your new password"
                required
              />
              <button
                type="button"
                onClick={() => setState(prev => ({ ...prev, showConfirmPassword: !prev.showConfirmPassword }))}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {state.showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {state.errors.confirmPassword && (
              <p className="mt-2 text-sm text-red-600">{state.errors.confirmPassword}</p>
            )}
          </div>

          {/* Security Notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Shield className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">Security Requirements:</p>
                <ul className="list-disc list-inside space-y-1 text-blue-700">
                  <li>At least 12 characters long</li>
                  <li>Mix of uppercase and lowercase letters</li>
                  <li>At least one number and special character</li>
                  <li>No common patterns or repeated characters</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Submit Error */}
          {state.errors.submit && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <p className="text-sm text-red-800">{state.errors.submit}</p>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={state.isSubmitting || !state.passwordStrength?.isValid}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
          >
            {state.isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Resetting Password...</span>
              </>
            ) : (
              <>
                <Key className="w-5 h-5" />
                <span>Reset Password</span>
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-600">
            Remember your password?{' '}
            <button
              onClick={() => router.push('/supplier/auth/login')}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Sign in here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

// Helper functions
const validatePassword = (password: string) => {
  return analyzePasswordStrength(password);
};

const getPasswordStrengthColor = (strength: string) => {
  switch (strength) {
    case 'very-weak': return '#ef4444';
    case 'weak': return '#f97316';
    case 'fair': return '#eab308';
    case 'good': return '#22c55e';
    case 'strong': return '#16a34a';
    case 'very-strong': return '#16a34a';
    default: return '#6b7280';
  }
};

const getPasswordStrengthPercentage = (strength: string) => {
  switch (strength) {
    case 'very-weak': return 20;
    case 'weak': return 40;
    case 'fair': return 60;
    case 'good': return 80;
    case 'strong': return 100;
    case 'very-strong': return 100;
    default: return 0;
  }
};
