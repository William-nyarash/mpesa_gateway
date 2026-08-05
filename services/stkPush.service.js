const axios = require("axios");
const { generateAccessToken } = require("./mpesaAuth.service");
const {
  MPESA_BASE_URL,
  MPESA_SHORTCODE,
  MPESA_PASSKEY,
  CALLBACK_URL,
  MPESA_CONSUMER_KEY,
  MPESA_CONSUMER_SECRET
} = require("../config/env");
const { getTimestamp } = require("../utils/timestamp");
async function initiatePayment(
  amount,
  phoneNumber,
  accountReference,
  transactionDesc
) {
  try {
    const accessToken = await generateAccessToken();
    const timestamp = getTimestamp();
    const password = Buffer.from(
      `${MPESA_SHORTCODE}${MPESA_PASSKEY}${timestamp}`
    ).toString("base64");
    
    // Format phone number to 2547XXXXXXXX
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
      Amount: Number(amount),
      PartyA: formattedPhone,
      PartyB: MPESA_SHORTCODE,
      PhoneNumber: formattedPhone,
      CallBackURL: CALLBACK_URL,
      AccountReference: accountReference,
      TransactionDesc: transactionDesc,
    };

    const response = await axios.post(
      `${MPESA_BASE_URL}/mpesa/stkpush/v1/processrequest`,
      payload,
      {
        headers: {
          "Authorization": `Bearer ${accessToken.trim()}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("===== STK PUSH ERROR =====");
    console.error("Status:", error.response?.status);
    console.error("Response:", error.response?.data);
    console.error("Message:", error.message);

    throw error;
  }
}


module.exports = { initiatePayment };

if (require.main === module) {
  (async () => {
    try {
      const response = await initiatePayment(
        10,
        "0114692825",
        "Test Payment",
        "Payment for test transaction"
      );

      console.log("STK Push Response:");
      console.log(response);
    } catch (err) {
      console.error("Payment failed.");
    }
  })();
}