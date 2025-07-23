// src/s3Client.ts

import { S3Client } from "@aws-sdk/client-s3";

// const R2_ACCOUNT_ID = import.meta.env.VITE_R2_ACCOUNT_ID;
// const R2_ACCESS_KEY_ID = import.meta.env.VITE_R2_ACCESS_KEY_ID;
// const R2_SECRET_ACCESS_KEY = import.meta.env.VITE_R2_SECRET_ACCESS_KEY;

const R2 = new S3Client({
  region: "auto",
  endpoint: "https://c2f2cdfe9d4dbc18d4547ca9405994c1.r2.cloudflarestorage.com",
  credentials: {
    accessKeyId: "cb24da4b34c372367667e990b446103d",
    secretAccessKey:
      "469b4a19665c3b614eeca5e189e93e5d9c1900ff9b66d31a855774872a7b89b9",
  },
});

export { R2 };
export default R2;
