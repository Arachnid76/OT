import { NextResponse } from 'next/server';

export function successResponse(data = {}, message = 'Success') {
    return NextResponse.json({
        success: true,
        message,
        ...data
    });
}

export function errorResponse(message = 'An error occurred', status = 500, error = null) {
    return NextResponse.json({
        success: false,
        message,
        error: error?.message || error
    }, { status });
}

export function validateRequiredFields(data, fields) {
    const missing = fields.filter(field => !data[field]);
    if (missing.length > 0) {
        throw new Error(`Missing required fields: ${missing.join(', ')}`);
    }
} 