import { NextResponse } from 'next/server';

const message =
  'API route not found. Please verify the endpoint path and HTTP method, and use one of the supported /api/* routes.';

export async function GET() {
  return NextResponse.json({ success: false, error: message }, { status: 404 });
}

export async function POST() {
  return NextResponse.json({ success: false, error: message }, { status: 404 });
}

export async function PUT() {
  return NextResponse.json({ success: false, error: message }, { status: 404 });
}

export async function PATCH() {
  return NextResponse.json({ success: false, error: message }, { status: 404 });
}

export async function DELETE() {
  return NextResponse.json({ success: false, error: message }, { status: 404 });
}

export async function OPTIONS() {
  return NextResponse.json({ success: false, error: message }, { status: 404 });
}
