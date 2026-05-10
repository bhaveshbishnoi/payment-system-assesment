import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { transactionId } = body;

    // Simulate network delay
    const random = Math.random();

    if (random < 0.15) {
      // Timeout case: respond after 8 seconds
      await new Promise((resolve) => setTimeout(resolve, 8000));
      return NextResponse.json({
        success: false,
        status: 'timeout',
        message: 'Gateway timeout',
      });
    }

    // Simulate processing time for other cases
    await new Promise((resolve) => setTimeout(resolve, 2000));

    if (random < 0.75) {
      // Success case (60% relative to total, but random < 0.15 was timeout, so 0.15 to 0.75 is 60%)
      return NextResponse.json({
        success: true,
        status: 'success',
        transactionId,
      });
    } else {
      // Failed case (25% relative to total, 0.75 to 1.0)
      const reasons = [
        'Insufficient funds',
        'Card declined by issuer',
        'Incorrect CVV',
        'Security violation',
      ];
      const reason = reasons[Math.floor(Math.random() * reasons.length)];
      
      return NextResponse.json({
        success: false,
        status: 'failed',
        message: reason,
        transactionId,
      }, { status: 400 });
    }
  } catch (_error) {
    return NextResponse.json({
      success: false,
      status: 'failed',
      message: 'Internal server error',
    }, { status: 500 });
  }
}
