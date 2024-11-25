export const STRIPE_URL = "https://api.stripe.com";
const STRIPE_API_KEY = process.env.STRIPE_API_KEY;
const STRIPE_ENDPOINT = STRIPE_URL + "/v1/payment_methods";

function urlEncode(data: Record<string, any>, parentKey: string = ""): string {
  const queryString: string[] = [];

  for (const [key, value] of Object.entries(data)) {
    const fullKey = parentKey ? `${parentKey}[${key}]` : key;
    if (typeof value === "object" && value !== null) {
      queryString.push(urlEncode(value, fullKey));
    } else {
      queryString.push(
        `${encodeURIComponent(fullKey)}=${encodeURIComponent(value)}`
      );
    }
  }

  return queryString.join("&");
}

export async function payWithStripe(tokenId: string) {
  const auth = btoa(`${STRIPE_API_KEY}:`);

  // prepare stripe body
  const body: Record<string, any> = {
    type: "card",
    card: {
      number: "{{ .card.number }}",
      cvc: "{{ .card.cvc }}",
      exp_month: 12,
      exp_year: 2028,
      //exp_month: "{{ .card.expiration | substr 0 2 }}",
      //exp_year: "{{ .card.expiration | substr 3 8 }}",
      // TBD: cardholder: { name: "{{ .card.holder_name }}" },
    },
  };

  const encodedStripeBody = urlEncode(body);

  return fetch(
    process.env.VITE_PVAULT_URL +
      "/api/pvlt/1.0/data/actions/http_call?reason=AppFunctionality",
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
          url: STRIPE_ENDPOINT,
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Basic ${auth}`,
          },
          body: encodedStripeBody,
        },
        include_response_body: true,
      }),
    }
  );
}
