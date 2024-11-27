export const STRIPE_URL = "https://api.stripe.com";
const STRIPE_API_KEY = process.env.STRIPE_API_KEY;

export async function payWithStripe(vaultUrl: string, tokenId: string) {
  const auth = btoa(`${STRIPE_API_KEY}:`);

  const resp = await fetch(
    vaultUrl + "/api/pvlt/1.0/data/actions/http_call?reason=AppFunctionality",
    {
      method: "POST",
      headers: {
        Authorization: "Bearer pvaultauth",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        template_variables: {
          card: `pvlt:detokenize:payments::${tokenId}:`,
        },
        request: {
          url: STRIPE_URL + "/v1/payment_methods",
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Basic ${auth}`,
          },
          body: new URLSearchParams({
            "type": "card",
            "card[number]": "{{ .card.number }}",
            "card[cvc]": "{{ .card.cvc }}",
            "card[exp_month]": "{{ .card.expiration | substr 0 2 }}",
            "card[exp_year]": "{{ .card.expiration | substr 3 8 }}",
            // TBD: cardholder: { name: "{{ .card.holder_name }}" },
          }).toString(),
        },
        include_response_body: true,
      }),
    }
  );

  const paymentMethod = await resp.json();

  return await fetch(STRIPE_URL + "/v1/payment_intents",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${auth}`,
      },
      body: new URLSearchParams({
        "amount": "20",
        "currency": "USD",
        "payment_method": paymentMethod.id,
        "automatic_payment_methods": "{\"enabled\": false, \"allow_redirects\": \"never\"}",
        "payment_method_options": "{\"card\": {\"request_three_d_secure\": \"any\"}}",
      }).toString(),
    }
  );
}
