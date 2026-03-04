const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'M-Pesa Gateway API',
      version: '1.0.0',
      description: 'A Node.js API for M-Pesa STK Push integration',
      contact: {
        name: 'API Support',
        email: 'support@example.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000/api',
        description: 'Development server',
      },
    ],
    components: {
      schemas: {
        PaymentRequest: {
          type: 'object',
          required: ['amount', 'phoneNumber', 'accountReference', 'transactionDesc'],
          properties: {
            amount: {
              type: 'number',
              description: 'Payment amount in KES',
              example: 10,
            },
            phoneNumber: {
              type: 'string',
              description: 'Phone number in format 0XXXXXXXXX or 254XXXXXXXXX',
              example: '0702499923',
            },
            accountReference: {
              type: 'string',
              description: 'Account reference for the payment',
              example: 'Test Payment',
            },
            transactionDesc: {
              type: 'string',
              description: 'Description of the transaction',
              example: 'Payment for test transaction',
            },
          },
        },
        PaymentResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true,
            },
            message: {
              type: 'string',
              example: 'STK Push initiated successfully',
            },
            data: {
              type: 'object',
              properties: {
                MerchantRequestID: {
                  type: 'string',
                  example: '209b-47e1-a420-e9fc70356b4a17473',
                },
                CheckoutRequestID: {
                  type: 'string',
                  example: 'ws_CO_020920250524038702499923',
                },
                ResponseCode: {
                  type: 'string',
                  example: '0',
                },
                ResponseDescription: {
                  type: 'string',
                  example: 'Success. Request accepted for processing',
                },
                CustomerMessage: {
                  type: 'string',
                  example: 'Success. Request accepted for processing',
                },
              },
            },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false,
            },
            message: {
              type: 'string',
              example: 'Failed to initiate payment',
            },
            error: {
              type: 'string',
              example: 'Error message details',
            },
            errors: {
              type: 'object',
              nullable: true,
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
              example: '2025-09-02T02:23:38.249Z',
            },
          },
        },
        HealthResponse: {
          type: 'object',
          properties: {
            status: {
              type: 'string',
              example: 'ok',
            },
          },
        },
        CallbackRequest: {
          type: 'object',
          properties: {
            Body: {
              type: 'object',
              properties: {
                stkCallback: {
                  type: 'object',
                  properties: {
                    MerchantRequestID: {
                      type: 'string',
                    },
                    CheckoutRequestID: {
                      type: 'string',
                    },
                    ResultCode: {
                      type: 'number',
                    },
                    ResultDesc: {
                      type: 'string',
                    },
                    CallbackMetadata: {
                      type: 'object',
                      properties: {
                        Item: {
                          type: 'array',
                          items: {
                            type: 'object',
                            properties: {
                              Name: {
                                type: 'string',
                              },
                              Value: {
                                oneOf: [
                                  { type: 'string' },
                                  { type: 'number' }
                                ],
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  apis: ['./routes/*.js'], // Path to the API docs
};

const specs = swaggerJSDoc(options);

module.exports = {
  specs,
  swaggerUi,
};
