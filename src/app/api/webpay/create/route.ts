import { NextRequest, NextResponse } from 'next/server'
import { createTransaction } from '@/lib/transbank'

export async function POST(req: NextRequest) {
  try {
    const { buyOrder, sessionId, amount, returnUrl } = await req.json()

    if (!buyOrder || !sessionId || !amount || !returnUrl) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos' },
        { status: 400 }
      )
    }

    const response = await createTransaction(buyOrder, sessionId, amount, returnUrl)

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error creating Webpay transaction:', error)
    return NextResponse.json(
      { error: 'Error al crear la transacción' },
      { status: 500 }
    )
  }
}
