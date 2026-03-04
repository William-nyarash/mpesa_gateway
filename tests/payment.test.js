const axios = require('axios');
const { initiatePayment } = require('../services/stkPush.service');
const authService = require('../services/mpesaAuth.service');

jest.mock('axios');
jest.mock('../services/mpesaAuth.service');

describe('STK Push Payment Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initiate payment and return success response', async () => {
    const mockAccessToken = 'test_token';
    const mockResponseData = {
      MerchantRequestID: '12345',
      CheckoutRequestID: '67890',
      ResponseCode: '0',
      ResponseDescription: 'Success. Request accepted for processing',
      CustomerMessage: 'Success message to customer'
    };

    authService.generateAccessToken.mockResolvedValue(mockAccessToken);
    axios.post.mockResolvedValue({ data: mockResponseData });

    const result = await initiatePayment(
      '100',
      '254712345678',
      'TestAccount',
      'Payment for testing'
    );

    expect(authService.generateAccessToken).toHaveBeenCalled();
    expect(axios.post).toHaveBeenCalledWith(
      expect.stringContaining('/mpesa/stkpush/v1/processrequest'),
      expect.objectContaining({
        Amount: '100',
        PhoneNumber: '254712345678',
        AccountReference: 'TestAccount',
        TransactionDesc: 'Payment for testing'
      }),
      expect.objectContaining({
        headers: {
          Authorization: `Bearer ${mockAccessToken}`,
          'Content-Type': 'application/json'
        }
      })
    );

    expect(result).toEqual(mockResponseData);
  });

  it('should throw an error if payment initiation fails', async () => {
    authService.generateAccessToken.mockResolvedValue('test_token');
    axios.post.mockRejectedValue({
      response: {
        data: { errorMessage: 'Invalid request' }
      }
    });

    await expect(
      initiatePayment('100', '254712345678', 'TestAccount', 'Failing test')
    ).rejects.toThrow('Failed to initiate payment');
  });
});
