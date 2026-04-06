import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true }
  },
  { timestamps: true }
)

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    orderItems: [
      {
        name: { type: String, required: true },
        qty: { type: Number, required: true },
        image: { type: String, required: true },
        price: { type: Number, required: true },
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true }
      }
    ],
    shippingAddress: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true }
    },
    totalPrice: { type: Number, required: true },
    isPaid: { type: Boolean, default: false },
    paidAt: { type: Date },
    paymentResult: {
      id: { type: String },
      status: { type: String },
    },
    isDelivered: { type: Boolean, default: false },
    deliveredAt: { type: Date },
    isCancelled: { type: Boolean, default: false },
    cancelledAt: { type: Date },
    returnRequested: { type: Boolean, default: false },
    returnType: { type: String, enum: ["return", "replace", ""], default: "" },
    returnReason: { type: String, default: "" },
    returnStatus: { type: String, enum: ["none", "pending", "approved", "rejected"], default: "none" },
    reviews: [reviewSchema],
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;