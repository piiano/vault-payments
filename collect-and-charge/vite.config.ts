import {defineConfig} from "vite";
import express from "express";
import {AddressInfo} from "net";
import {runVault} from "./vault";
import {ADYEN_URL, payWithAdyen} from "./adyen";

// run and initialize vault
await runVault(ADYEN_URL);

const app = express();
app.use(express.json());
app.post("/api/payment", (req, res) => {
  const tokenID = req.body.data;
  console.log("token: ", tokenID);

  // pay with adyen
  payWithAdyen(tokenID)
    .then((response) => {
      return response.json();
    })
    .then((result) => {
      console.log('Success:', result);
      res.json({ status: "success" });
    })
    .catch((error) => {
      console.error('Error:', error);
      res.json({ status: "error" });
    });
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
