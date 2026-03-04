// Combine all routes here
const express = require("express");
const paymentRoutes = require('./payment.routes');

const router = express.Router();

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check endpoint
 *     description: Returns the health status of the API
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: API is healthy
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HealthResponse'
 */
router.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

router.use('/payments', paymentRoutes);

module.exports = router;
