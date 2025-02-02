// src/client.ts
import { createThirdwebClient } from "thirdweb";

export const client = createThirdwebClient({
  clientId: process.env.THIRDWEB_CLIENT_ID!,
});
