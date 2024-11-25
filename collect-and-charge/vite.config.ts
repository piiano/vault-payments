import { defineConfig } from "vite";
import express from "express";
import { AddressInfo } from "net";
import { runVault } from "./src/vault";
import { ADYEN_URL, payWithAdyen } from "./src/adyen";
import { STRIPE_URL, payWithStripe } from "./src/stripe";

// Run and initialize Vault.
await runVault(`${ADYEN_URL},${STRIPE_URL}`);

const app = express();
app.use(express.json());
app.post("/api/payment", async (req, res) => {
  const tokenID = req.body.data;
  console.log("token: ", tokenID);

  // Pay with Adyen.
  try {
    let resp: any;
    if (Math.random() < 0.5) {
      console.log("Pay with Stripe");
      resp = await payWithStripe(tokenID);
    } else {
      console.log("Pay with Adyen");
      resp = await payWithAdyen(tokenID);
    }
    const result = await resp.json();

    console.log("Success:", result);
    res.json({ status: "success" });
  } catch (error) {
    console.error("Error:", error);
    res.json({ status: "error" });
  }
});
let server = app.listen();

export default defineConfig({
  server: {
    port: 3000,
    proxy: {
      "/api": `http://localhost:${(server.address() as AddressInfo).port}`,
    },
  },
});
