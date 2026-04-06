import express from "express";
import Order from "../models/orderModel.js";
import jwt from "jsonwebtoken";

const router = express.Router();

const protect = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Not authorized" });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
};

// Place new order
router.post("/", protect, async (req, res) => {
  try {
    const { orderItems, shippingAddress, totalPrice } = req.body;
    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: "No order items" });
    }
    const order = new Order({ user: req.userId, orderItems, shippingAddress, totalPrice });
    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get logged in user's orders
router.get("/myorders", protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.userId })
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get order by ID
router.get("/:id", protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("user", "name email");
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Cancel order
router.put("/:id/cancel", protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    if (order.isDelivered) return res.status(400).json({ message: "Cannot cancel a delivered order" });
    if (order.isCancelled) return res.status(400).json({ message: "Order already cancelled" });

    order.isCancelled = true;
    order.cancelledAt = new Date();
    await order.save();
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Return or Replace request
router.put("/:id/return", protect, async (req, res) => {
  try {
    const { returnType, returnReason } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    if (!order.isDelivered) return res.status(400).json({ message: "Order not delivered yet" });
    if (order.returnRequested) return res.status(400).json({ message: "Return already requested" });

    order.returnRequested = true;
    order.returnType = returnType;
    order.returnReason = returnReason;
    order.returnStatus = "pending";
    await order.save();
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add review
router.post("/:id/review", protect, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const order = await Order.findById(req.params.id).populate("user", "name");
    if (!order) return res.status(404).json({ message: "Order not found" });
    if (!order.isDelivered) return res.status(400).json({ message: "Can only review delivered orders" });

    const alreadyReviewed = order.reviews.find(
      r => r.user.toString() === req.userId.toString()
    );
    if (alreadyReviewed) return res.status(400).json({ message: "Already reviewed this order" });

    const review = {
      user: req.userId,
      name: order.user.name,
      rating: Number(rating),
      comment
    };

    order.reviews.push(review);
    await order.save();
    res.status(201).json({ message: "Review added" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;