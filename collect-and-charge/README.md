<p>
  <a href="https://piiano.com/pii-data-privacy-vault/">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://docs.piiano.com/img/logo-developers-dark.svg">
      <source media="(prefers-color-scheme: light)" srcset="https://docs.piiano.com/img/logo-developers.svg">
      <img alt="Piiano Vault" src="https://docs.piiano.com/img/logo-developers.svg" height="40" />
    </picture>
  </a>
</p>

# Collect and Charge

Collect credit card information in a PCI scoped iframe and charge it later using Stripe or Adyen.

ℹ️ This application is for demo purposes. Do not pass real credit card numbers. This works on a local Vault instance to demonstrate the usage. 
Refer to online documentation how to run this against a real Vault instance in a PCI scope.

## Set environment variables

### Adyen

`ADYEN_API_KEY` - The credentials to authenticate requests to Adyen API. See [Adyen's documentation](https://docs.adyen.com/development-resources/api-credentials/) for more details.

`ADYEN_MERCHANT_ACCOUNT` - An Adyens's [merchant account](https://www.adyen.com/knowledge-hub/merchant-account).

### Stripe

`STRIPE_API_KEY` - The credentials to authenticate requests to Stripe API. See [Stripe's dumentation](https://docs.stripe.com/keys) for more details.

## Install prerequisites

Install dependencies: `npm install`.

## Run

Run using: `npm run dev` and navigate to the URL shown.

