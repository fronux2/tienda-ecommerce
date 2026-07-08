import { NextRequest, NextResponse } from 'next/server'
import { commitTransaction } from '@/lib/transbank'

export async function POST(req: NextRequest) {
  try {
    const { token_ws } = await req.json()

    if (!token_ws) {
      return NextResponse.json(
        { error: 'Falta token_ws' },
        { status: 400 }
      )
    }

    const response = await commitTransaction(token_ws)

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error committing Webpay transaction:', error)
    return NextResponse.json(
      { error: 'Error al confirmar la transacción' },
      { status: 500 }
    )
  }
}
