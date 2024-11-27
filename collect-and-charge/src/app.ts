import path from "path";
import express from "express";
import { AddressInfo } from "net";
import { promises as fs } from "fs";
import { defaultPvaultApiKey, runVault } from "./vault.js";
import { ADYEN_URL, payWithAdyen } from "./adyen.js";
import { STRIPE_URL, payWithStripe } from "./stripe.js";

async function main() {

  let vaultUrl = process.env.VAULT_URL;
  if (!vaultUrl) {
    // Run and initialize Vault.
    vaultUrl = await runVault([ADYEN_URL, STRIPE_URL].join(","));
    console.log(`Vault initialized at ${vaultUrl}`);
  }

  let vaultClientApiKey = process.env.VAULT_CLIENT_API_KEY;
  if (!vaultClientApiKey) {
    vaultClientApiKey = defaultPvaultApiKey;
  }

  let vaultServerApiKey = process.env.VAULT_SERVER_API_KEY;
  if (!vaultServerApiKey) {
    vaultServerApiKey = defaultPvaultApiKey;
  }

  const app = express()
    .disable("x-powered-by") // Disable x-powered-by express header
    .use(express.json());

  app.post("/api/payment", async (req, res) => {
    const tokenID = req.body.data;
    console.log("token: ", tokenID);

    try {
      let resp: any;
      if (Math.random() < 0.5) {
        console.log("Pay with Stripe");
        resp = await payWithStripe(vaultUrl, vaultServerApiKey, tokenID);
      } else {
        console.log("Pay with Adyen");
        resp = await payWithAdyen(vaultUrl, vaultServerApiKey, tokenID);
      }
      const result = await resp.json();

      console.log("Success:", result);
      res.json({ status: "success" });
    } catch (error) {
      console.error("Error:", error);
      res.json({ status: "error" });
    }
  });

  const staticPath = path.join(import.meta.dirname, "public");

  // Intercept requests for a specific file
  app.get(
    "/",
    async (_: express.Request, res: express.Response): Promise<void> => {
      const filePath: string = path.join(staticPath, "index.html");

      try {
        // Read the file dynamically
        let data: string = await fs.readFile(filePath, "utf8");

        // Modify the file content (example: adding a dynamic script)
        const modifiedContent: string = data.replace(
          "{{ VAULT_URL }}",
          vaultUrl
        ).replace(
          "{{ VAULT_CLIENT_API_KEY }}",
          vaultClientApiKey
        );

        // Send the modified content
        res.send(modifiedContent);
      } catch (err) {
        console.error("Error reading file:", err);
        res.status(500).send("Internal Server Error");
      }

      return;
    }
  );

  app.use(express.static(staticPath));

  const server = app.listen("3000", () => {
    console.log(
      `Server is running: http://localhost:${
        (server.address() as AddressInfo).port
      }.`
    );
  });
}

main();
