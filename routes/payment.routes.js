// Payment routes
const express = require("express");
const router = express.Router();
const { initiatePayment } = require("../services/stkPush.service");
const logger = require("../utils/logger");

/**
 * @swagger
 * tags:
 *   name: Payments
 *   description: M-Pesa payment processing endpoints
 */

/**
 * @swagger
 * /payments/stkpush:
 *   post:
 *     summary: Initiate M-Pesa STK Push payment
 *     description: Initiates an M-Pesa STK Push payment request to the customer's phone
 *     tags: [Payments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PaymentRequest'
 *           example:
 *             amount: 10
 *             phoneNumber: "0702499923"
 *             accountReference: "Test Payment"
 *             transactionDesc: "Payment for test transaction"
 *     responses:
 *       200:
 *         description: STK Push initiated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaymentResponse'
 *       400:
 *         description: Bad request - Missing required fields
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "Missing required fields: amount, phoneNumber, accountReference, transactionDesc"
 *               errors: null
 *               timestamp: "2025-09-02T02:23:38.249Z"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post("/stkpush", async (req, res, next) => {
  try {
    const { amount, phoneNumber, accountReference, transactionDesc } = req.body;

    if (!amount || !phoneNumber || !accountReference || !transactionDesc) {
      return res.status(400).json({
        success: false,
        message:
          "Missing required fields: amount, phoneNumber, accountReference, transactionDesc",
      });
    }

    const response = await initiatePayment(
      amount,
      phoneNumber,
      accountReference,
      transactionDesc
    );

    res.status(200).json({
      success: true,
      message: "STK Push initiated successfully",
      data: response,
    });
  } catch (error) {
    logger.error("Error in STK Push initiation", { error: error.message });
    next(error);
  }
});

/**
 * @swagger
 * /payments/callback:
 *   post:
 *     summary: M-Pesa callback endpoint
 *     description: Receives callback notifications from M-Pesa after payment processing
 *     tags: [Payments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CallbackRequest'
 *           example:
 *             Body:
 *               stkCallback:
 *                 MerchantRequestID: "29115-34620561-1"
 *                 CheckoutRequestID: "ws_CO_191220191020363925"
 *                 ResultCode: 0
 *                 ResultDesc: "The service request is processed successfully."
 *                 CallbackMetadata:
 *                   Item:
 *                     - Name: "Amount"
 *                       Value: 1.00
 *                     - Name: "MpesaReceiptNumber"
 *                       Value: "NLJ7RT61SV"
 *                     - Name: "TransactionDate"
 *                       Value: 20191219102115
 *                     - Name: "PhoneNumber"
 *                       Value: 254708374149
 *     responses:
 *       200:
 *         description: Callback processed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ResultCode:
 *                   type: number
 *                   example: 0
 *                 ResultDesc:
 *                   type: string
 *                   example: "Accepted"
 */
router.post("/callback", (req, res) => {
  try {
    const callbackData = req.body.Body.stkCallback;

    res.json({ ResultCode: 0, ResultDesc: "Accepted" });

    if (callbackData.ResultCode === 0) {
      // Payment successful
      const transactionDetails = callbackData.CallbackMetadata?.Item || [];
      logger.info("STK Push payment successful", { transactionDetails });
      // Save to DB

      
    } else {
      // Payment failed
      logger.error("STK Push payment failed", {
        resultCode: callbackData.ResultCode,
        description: callbackData.ResultDesc,
      });
    }
  } catch (error) {
    logger.error("Error in callback processing", { error: error.message });
  }
});

module.exports = router;
