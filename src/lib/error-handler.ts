import { NextResponse } from 'next/server';

export interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

export class ApiError extends Error implements AppError {
  statusCode: number;
  isOperational: boolean;

  constructor(statusCode: number, message: string, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
}

export function handleError(error: unknown): NextResponse {
  console.error('Error occurred:', error);

  if (error instanceof ApiError) {
    return NextResponse.json(
      { 
        error: error.message,
        statusCode: error.statusCode 
      },
      { status: error.statusCode }
    );
  }

  if (error instanceof Error) {
    // Log to monitoring service in production
    if (process.env.NODE_ENV === 'production') {
      console.error('Unhandled error:', {
        message: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString()
      });
    }

    return NextResponse.json(
      { 
        error: process.env.NODE_ENV === 'production' 
          ? 'Internal server error' 
          : error.message 
      },
      { status: 500 }
    );
  }

  return NextResponse.json(
    { error: 'An unexpected error occurred' },
    { status: 500 }
  );
}

// Validation errors
export class ValidationError extends ApiError {
  constructor(message: string) {
    super(400, message);
  }
}

// Authentication errors
export class AuthenticationError extends ApiError {
  constructor(message = 'Authentication failed') {
    super(401, message);
  }
}

// Authorization errors
export class AuthorizationError extends ApiError {
  constructor(message = 'Access forbidden') {
    super(403, message);
  }
}

// Not found errors
export class NotFoundError extends ApiError {
  constructor(resource: string) {
    super(404, `${resource} not found`);
  }
}

// Conflict errors
export class ConflictError extends ApiError {
  constructor(message: string) {
    super(409, message);
  }
}

// Rate limit errors
export class RateLimitError extends ApiError {
  constructor(message = 'Too many requests') {
    super(429, message);
  }
}