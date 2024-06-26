import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    console.log('REQUEST: ', request.headers.get('Authorization'));
    const test = await request.text();
    console.log('RESULTS: ', test);

    return NextResponse.json(
      { message: 'Success', body: test },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: 'Something went wrong' },
      { status: 500 },
    );
  }
}
