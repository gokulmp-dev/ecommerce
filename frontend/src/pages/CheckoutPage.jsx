import { useState } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const countries = [
  "India", "United States", "United Kingdom", "Canada", "Australia",
  "Germany", "France", "Japan", "Singapore", "UAE",
  "Saudi Arabia", "Malaysia", "Sri Lanka", "Bangladesh", "Nepal",
];

export default function CheckoutPage() {
  const { cartItems, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [address, setAddress] = useState("");
  const [country, setCountry] = useState("India");
  const [pincode, setPincode] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!user) {
    navigate("/login");
    return null;
  }

  const handlePincodeBlur = async () => {
    if (!pincode) return;
    try {
      if (country === "India") {
        const res = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
        const data = await res.json();
        if (data[0].Status === "Success") {
          const place = data[0].PostOffice[0];
          setCity(place.District);
          setState(place.State);
        }
      } else {
        const res = await fetch(`https://api.zippopotam.us/${country.toLowerCase().replace(/ /g, "-")}/${pincode}`);
        const data = await res.json();
        if (data.places?.[0]) {
          setCity(data.places[0]["place name"]);
          setState(data.places[0]["state"]);
        }
      }
    } catch {}
  };

  const handlePayment = async () => {
    if (!address || !pincode || !city) {
      setError("Please fill in all address fields.");
      return;
    }
    setError("");
    setLoading(true);

    try {
      // Step 1: Create Razorpay order
      const orderRes = await fetch(`${API_URL}/api/payment/create-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ amount: totalPrice }),
      });
      const razorpayOrder = await orderRes.json();

      // Step 2: Open Razorpay checkout
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: razorpayOrder.amount,
        currency: "INR",
        name: "MyShop",
        description: "Order Payment",
        order_id: razorpayOrder.id,
        handler: async (response) => {
          try {
            // Step 3: Verify payment
            const verifyRes = await fetch(`${API_URL}/api/payment/verify`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${user.token}`,
              },
              body: JSON.stringify(response),
            });
            const verifyData = await verifyRes.json();

            if (verifyData.success) {
              // Step 4: Place order
              const placeRes = await fetch(`${API_URL}/api/orders`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${user.token}`,
                },
                body: JSON.stringify({
                  orderItems: cartItems.map((item) => ({
                    name: item.name,
                    qty: item.qty,
                    image: item.image,
                    price: item.price,
                    product: item._id,
                  })),
                  shippingAddress: { address, city, postalCode: pincode, country, state },
                  totalPrice,
                  isPaid: true,
                  paidAt: new Date(),
                  paymentResult: {
                    id: verifyData.paymentId,
                    status: "completed",
                  },
                }),
              });
              const placedOrder = await placeRes.json();
              clearCart();
              navigate(`/order/${placedOrder._id}`);
            } else {
              setError("Payment verification failed. Please try again.");
            }
          } catch {
            setError("Something went wrong after payment.");
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
        },
        theme: { color: "#f59e0b" },
        modal: {
          ondismiss: () => {
            setLoading(false);
            setError("Payment cancelled.");
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
      setLoading(false);
    } catch (err) {
      setError("Failed to initiate payment.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Shipping Form */}
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <h2 className="text-2xl font-bold mb-6">Shipping Address</h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-600 block mb-1">Street Address</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="123, Anna Nagar..."
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-400 transition-colors"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600 block mb-1">Country</label>
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-400 transition-colors"
              >
                {countries.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600 block mb-1">Pincode</label>
              <input
                type="text"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                onBlur={handlePincodeBlur}
                placeholder="Enter pincode"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-400 transition-colors"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600 block mb-1">City</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Auto-filled"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-400 transition-colors"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 block mb-1">State</label>
                <input
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  placeholder="Auto-filled"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-400 transition-colors"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
          <div className="space-y-3 mb-6">
            {cartItems.map((item) => (
              <div key={item._id} className="flex items-center gap-3">
                <img src={item.image} alt={item.name} className="w-12 h-12 rounded-xl object-cover bg-gray-100" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800 truncate">{item.name}</p>
                  <p className="text-xs text-gray-400">Qty: {item.qty}</p>
                </div>
                <p className="text-sm font-bold text-gray-800">₹{(item.price * item.qty).toLocaleString()}</p>
              </div>
            ))}
          </div>
          <div className="border-t pt-4 mb-6">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-gray-600">Total</span>
              <span className="text-2xl font-black text-amber-500">₹{totalPrice.toLocaleString()}</span>
            </div>
          </div>
          {error && (
            <div className="bg-red-50 text-red-500 text-sm rounded-xl px-4 py-3 mb-4">
              {error}
            </div>
          )}
          <button
            onClick={handlePayment}
            disabled={loading || cartItems.length === 0}
            className="w-full bg-amber-400 hover:bg-amber-300 text-black font-bold py-4 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            {loading ? "Processing..." : `Pay ₹${totalPrice.toLocaleString()} with Razorpay`}
          </button>
          <p className="text-center text-xs text-gray-400 mt-3">🔒 Secured by Razorpay</p>
        </div>
      </div>
    </div>
  );
}