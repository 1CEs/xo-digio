import { NextResponse } from 'next/server';

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}

export class ApiResponseHelper {
  static success<T>(data: T, message: string = 'Success', status: number = 200) {
    return NextResponse.json({
      success: true,
      message,
      data
    } as ApiResponse<T>, { status });
  }

  static error(message: string, status: number = 400, errors?: Array<{ field: string; message: string }>) {
    return NextResponse.json({
      success: false,
      message,
      errors
    } as ApiResponse, { status });
  }

  static validationError(errors: Array<{ field: string; message: string }>) {
    return NextResponse.json({
      success: false,
      message: 'Validation failed',
      errors
    } as ApiResponse, { status: 400 });
  }

  static serverError(message: string = 'Internal server error') {
    return NextResponse.json({
      success: false,
      message
    } as ApiResponse, { status: 500 });
  }

  static conflict(message: string) {
    return NextResponse.json({
      success: false,
      message
    } as ApiResponse, { status: 409 });
  }

  static created<T>(data: T, message: string = 'Created successfully') {
    return NextResponse.json({
      success: true,
      message,
      data
    } as ApiResponse<T>, { status: 201 });
  }
}
