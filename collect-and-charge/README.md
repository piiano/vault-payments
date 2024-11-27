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

ℹ️ This application is for demo purposes. Do not pass real credit card numbers. 
It works on a local Vault instance or against a sandbox Vault instance to demonstrate the usage. 
Refer to online documentation how to run this against a real Vault instance in a PCI scope.

## Vault
A local vault is being set up for you to run this application.

To run against a sandbox Vault instance you need to follow the steps in the [payment-orchestration guide](https://docs.piiano.com/tutorials/how-to/payment-orchestration#steps).

From the steps above set the following environment variables:

`VAULT_URL` - the URL of the Vault.

`VAULT_CLIENT_API_KEY` - the API key from https://docs.piiano.com/tutorials/how-to/payment-orchestration#step-1-create-piiano-vault-api-key-for-the-client

`VAULT_SERVER_API_KEY` - the API key from https://docs.piiano.com/tutorials/how-to/payment-orchestration#step-4-create-piiano-vault-api-key-for-the-server


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
