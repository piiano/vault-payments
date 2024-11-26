
export const ADYEN_URL = 'https://checkout-test.adyen.com';
const ADYEN_PAYMENT_ENDPOINT = ADYEN_URL + '/v71/payments';

const ADYEN_API_KEY = process.env.ADYEN_API_KEY;
const ADYEN_MERCHANT_ACCOUNT = process.env.ADYEN_MERCHANT_ACCOUNT;

export async function payWithAdyen(vaultUrl: string, tokenId: string) {
  return fetch(vaultUrl + '/api/pvlt/1.0/data/actions/http_call?reason=AppFunctionality', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer pvaultauth',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      template_variables: {
        card: `pvlt:detokenize:payments::${tokenId}:`
      },
      request: {
        url: ADYEN_PAYMENT_ENDPOINT,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'x-API-key': ADYEN_API_KEY
        },
        body: JSON.stringify({
          "amount": {
            "currency": "USD",
            "value": 1800
          },
          "reference": "order number",
          "paymentMethod": {
            "type": "scheme",
            "number": "{{ .card.number }}",
            "expiryMonth": "{{ .card.expiration | substr 0 2 }}",
            "expiryYear": "{{ .card.expiration | substr 3 8 }}",
            "holderName": "{{ .card.holder_name }}",
            "cvc": "{{ .card.cvv }}"
          },
          "shopperReference": "SHOPPER_REFERENCE",
          "storePaymentMethod": true,
          "shopperInteraction": "Ecommerce",
          "recurringProcessingModel": "CardOnFile",
          "returnUrl": "https://shopper.com/",
          "merchantAccount": ADYEN_MERCHANT_ACCOUNT,
        })
      },
      include_response_body: true,
    }),
  })
}
