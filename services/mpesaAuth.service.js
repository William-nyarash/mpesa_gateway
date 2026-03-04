// OAuth token logic
const axios = require("axios");
const path = require("path");
const logger = require("../utils/logger");

require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
require("dotenv").config();

const generateAccessToken = async () => {
  const consumerKey = process.env.MPESA_CONSUMER_KEY;
  const consumerSecret = process.env.MPESA_CONSUMER_SECRET;

  const url =
    "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials";

  try {
    const encodedCredentials = Buffer.from(
      `${consumerKey}:${consumerSecret}`
    ).toString("base64");

    const headers = {
      Authorization: `Basic ${encodedCredentials}`,
      "Content-Type": "application/json",
    };

    const response = await axios.get(url, { headers });
    const token = response.data.access_token;
    return token;
  } catch (error) {
    logger.error("Error fetching M-Pesa access token", {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    throw new Error("Failed to get access token.");
  }
};

module.exports = { generateAccessToken };
