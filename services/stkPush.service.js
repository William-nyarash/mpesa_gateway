const axios = require("axios");
const { generateAccessToken } = require("./mpesaAuth.service");
const {
  MPESA_BASE_URL,
  MPESA_SHORTCODE,
  MPESA_PASSKEY,
  CALLBACK_URL,
} = require("../config/env.js");
const { getTimestamp } = require("../utils/timestamp.js");


async function initiatePayment(
  amount,
  phoneNumber,
  accountReference,
  transactionDesc
) {
  const accessToken = await generateAccessToken();
  const timestamp = getTimestamp();

  const password = Buffer.from(
    `${MPESA_SHORTCODE}${MPESA_PASSKEY}${timestamp}`
  ).toString("base64");

  let formattedPhone = phoneNumber;
  if (phoneNumber.startsWith("0")) {
    formattedPhone = `254${phoneNumber.slice(1)}`;
  } else if (phoneNumber.startsWith("+254")) {
    formattedPhone = phoneNumber.slice(1);
  }

  const payload = {
    BusinessShortCode: MPESA_SHORTCODE,
    Password: password,
    Timestamp: timestamp,
    TransactionType: "CustomerPayBillOnline",
    Amount: amount,
    PartyA: formattedPhone,
    PartyB: MPESA_SHORTCODE,
    PhoneNumber: formattedPhone,
    CallBackURL: CALLBACK_URL,
    AccountReference: accountReference,
    TransactionDesc: transactionDesc,
  };

  try {
    const response = await axios.post(
      `${MPESA_BASE_URL}/mpesa/stkpush/v1/processrequest`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error(
      "Error initiating payment:",
      error.response?.data || error.message
    );
    throw new Error("Failed to initiate payment");
  }
}

module.exports = { initiatePayment };
