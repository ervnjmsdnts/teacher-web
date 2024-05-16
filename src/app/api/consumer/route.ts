import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    console.log('REQUEST: ', JSON.stringify(request, undefined, 4));
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
