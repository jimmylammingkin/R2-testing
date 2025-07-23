# React + Cloudflare R2 Client-Side Demo

A simple React and TypeScript project demonstrating how to upload and download files to Cloudflare R2 using its S3-compatible API directly from the client-side. This project uses Vite for a fast development experience and the AWS SDK v3 for communication with R2.

## Key Features

* Select a file from your local machine.
* Generate a pre-signed URL for uploading.
* Upload the file directly to an R2 bucket from the browser.
* Generate a pre-signed URL for downloading.
* Download the file directly from the R2 bucket.

## Core Technologies Used

* [React](https://reactjs.org/)
* [TypeScript](https://www.typescriptlang.org/)
* [Vite](https://vitejs.dev/)
* [Cloudflare R2](https://www.cloudflare.com/products/r2/)
* [AWS SDK v3 for JavaScript](https://aws.amazon.com/sdk-for-javascript/)
  * `@aws-sdk/client-s3`
  * `@aws-sdk/s3-request-presigner`

## Setup and Installation

Follow these steps to get the project running locally.

### Prerequisites

* [Node.js](https://nodejs.org/) (version 18 or higher recommended)
* A [Cloudflare account](https://www.google.com/search?q=https://dash.cloudflare.com/sign-up) with an active R2 subscription.
* An existing R2 bucket.

### 1. Clone the Repository
git clone 


### 2. Install Dependencies

npm install


### 3. Configure Environment Variables

This project requires API credentials to connect to your R2 bucket.

1. Create a local environment file by copying the example file.
cp .env.example .env.local

2. Open the `.env.local` file and fill in the values:
* `VITE_R2_ACCOUNT_ID`: Find this in your Cloudflare dashboard under R2 -> Overview.
* `VITE_R2_ACCESS_KEY_ID` & `VITE_R2_SECRET_ACCESS_KEY`: Create an R2 API Token in R2 -> "Manage R2 API Tokens". Ensure it has **"Object Read & Write"** permissions.
* `VITE_R2_BUCKET_NAME`: The exact name of your R2 bucket.

### 4. Configure R2 Bucket CORS Policy

For the browser to be able to make requests to your R2 bucket, you must configure a CORS policy.

1. In your Cloudflare dashboard, navigate to your R2 bucket -> **Settings**.
2. Scroll down to **CORS Policy** and click **"Add CORS policy"**.
3. Paste the following JSON. This policy allows `GET` and `PUT` requests from your local development server.

[
{
"AllowedOrigins": [
"http://localhost:5173"
],
"AllowedMethods": [
"GET",
"PUT"
],
"AllowedHeaders": [
"content-type"
],
"MaxAgeSeconds": 3600
}
]


## Usage

Once the setup is complete, run the development server:

npm run dev


Open your browser and navigate to `http://localhost:5173`. You should see the application interface, allowing you to upload and download a file.

## How It Works

1. **Request** a **Pre-signed URL**: When you click "Upload" or "Download", the AWS SDK uses your embedded credentials to make an API call to Cloudflare R2, requesting a temporary, one-time-use URL.
2. **Perform the Action**:
   * For an **upload**, the SDK receives a URL that grants `PUT` access. The application then uses `fetch()` to send the file data directly to that URL.
   * For a **download**, the SDK receives a URL that grants `GET` access. This URL is used to download the file in the browser.
3. **Bypass** the **Server**: This method allows the browser to interact directly with R2 storage without needing a server to proxy the file data, but at the cost of exposing credentials client-side.
