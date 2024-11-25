import path from "path";
import express from "express";
import { AddressInfo } from "net";
import { promises as fs } from 'fs';
import { runVault } from "./vault.js";
import { ADYEN_URL, payWithAdyen } from "./adyen.js";
import { STRIPE_URL, payWithStripe } from "./stripe.js";

async function main() {
    // Run and initialize Vault.
    const vaultUrl = await runVault([ADYEN_URL, STRIPE_URL].join(","));

    const app = express()
        .disable('x-powered-by'). // Disable x-powered-by express header
        use(express.json());

    app.post("/api/payment", async (req, res) => {
        const tokenID = req.body.data;
        console.log("token: ", tokenID);

        try {
            let resp: any;
            if (Math.random() < 0.5) {
                console.log("Pay with Stripe");
                resp = await payWithStripe(vaultUrl, tokenID);
            } else {
                console.log("Pay with Adyen");
                resp = await payWithAdyen(vaultUrl, tokenID);
            }
            const result = await resp.json();

            console.log("Success:", result);
            res.json({ status: "success" });
        } catch (error) {
            console.error("Error:", error);
            res.json({ status: "error" });
        }
    });

    const staticPath = path.join(import.meta.dirname, 'public');

    // Intercept requests for a specific file
    app.get('/', async (_: express.Request, res: express.Response): Promise<void> => {
        const filePath: string = path.join(staticPath, 'index.html');

        try {
            // Read the file dynamically
            let data: string = await fs.readFile(filePath, 'utf8');

            // Modify the file content (example: adding a dynamic script)
            const modifiedContent: string = data.replace(
                "{{ VAULT_URL }}",
                vaultUrl,
            );

            // Send the modified content
            res.send(modifiedContent);
        } catch (err) {
            console.error('Error reading file:', err);
            res.status(500).send('Internal Server Error');
        }

        return;
    });

    app.use(express.static(staticPath));

    const server = app.listen("3000", () => {
        console.log(`Server is running: http://localhost:${(server.address() as AddressInfo).port}.`);
    });
}

main();