import { WebpayPlus, Options, Environment, IntegrationCommerceCodes, IntegrationApiKeys } from 'transbank-sdk'

const getOptions = () => {
  if (process.env.WEBPAY_COMMERCE_CODE && process.env.WEBPAY_API_KEY) {
    return new Options(
      process.env.WEBPAY_COMMERCE_CODE,
      process.env.WEBPAY_API_KEY,
      Environment.Production
    )
  }
  return new Options(
    IntegrationCommerceCodes.WEBPAY_PLUS,
    IntegrationApiKeys.WEBPAY,
    Environment.Integration
  )
}

export const createTransaction = async (
  buyOrder: string,
  sessionId: string,
  amount: number,
  returnUrl: string
) => {
  const tx = new WebpayPlus.Transaction(getOptions())
  return tx.create(buyOrder, sessionId, amount, returnUrl)
}

export const commitTransaction = async (token: string) => {
  const tx = new WebpayPlus.Transaction(getOptions())
  return tx.commit(token)
}
