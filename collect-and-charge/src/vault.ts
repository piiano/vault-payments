import { Vault } from "@piiano/testcontainers-vault";
import { VaultClient } from "@piiano/vault-client";

export async function runVault(allowedDestinations: string) {
  const vault = new Vault({
    env: {
      PVAULT_SENTRY_ENABLE: false,
      PVAULT_LOG_DATADOG_ENABLE: 'none',
      PVAULT_SERVICE_ALLOWED_PCI_HTTP_DESTINATIONS: allowedDestinations,
      PVAULT_SERVICE_ALLOWED_HTTP_DESTINATIONS: allowedDestinations,
    }
  });

  const port = await vault.start();
  console.log("Vault started on port: ", port);
  process.env.VITE_PVAULT_URL = `http://localhost:${port}`;

  const vaultClient = new VaultClient({
    vaultURL: `http://localhost:${port}`,
    apiKey: "pvaultauth",
  })

  await vaultClient.collections.addCollection({
    requestBody: {
      name: 'payments',
      type: 'DATA',
      properties: [
        {
          name: 'holder_name',
          data_type_name: 'CC_HOLDER_NAME',
          description: 'Credit card holder name',
          is_encrypted: true,
          is_index: false,
          is_nullable: false,
          is_unique: false,
        },
        {
          name: 'number',
          data_type_name: 'CC_NUMBER',
          description: 'Credit card number',
          is_encrypted: true,
          is_index: false,
          is_nullable: false,
          is_unique: false,
        },
        {
          name: 'expiration',
          data_type_name: 'CC_EXPIRATION_STRING',
          description: 'Credit card expiration',
          is_encrypted: true,
          is_index: false,
          is_nullable: false,
          is_unique: false,
        },
        {
          name: 'cvv',
          data_type_name: 'CC_CVV',
          description: 'Credit card CVV',
          is_encrypted: true,
          is_index: false,
          is_nullable: false,
          is_unique: false,
        },
      ],
    },
  })
}