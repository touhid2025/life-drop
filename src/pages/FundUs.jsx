import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import Swal from "sweetalert2";
import CheckoutForm from "./CheckoutForm";

// Stripe public key
const stripePromise = loadStripe("pk_test_51RpXP44DsLpzjkxcjuQU0IBI6jmKlcMENAAL7tZvi7tlV5TIMd7CaP85gvcH7baXVuZF0Rzed88MxRfgJu6vLEwM00bnnRGbUl");

const FundUs = () => {
  const [amount, setAmount] = useState(10); // default $10
  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(false);

  const handleDonate = async () => {
    if (!amount || amount <= 0) {
      Swal.fire("Invalid Amount", "Please enter a valid donation amount.", "warning");
      return;
    }

    try {
      setLoading(true);

      Swal.fire({
        title: "Preparing Payment...",
        text: "Please wait a moment.",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      const res = await fetch("http://localhost:5000/api/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount }),
      });

      const data = await res.json();

      if (data.clientSecret) {
        setClientSecret(data.clientSecret);
        Swal.fire({
          icon: "success",
          title: "Ready to Donate!",
          text: "You can now complete your donation below.",
          confirmButtonColor: "#3085d6",
        });
      } else {
        throw new Error("No clientSecret received");
      }
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Something went wrong. Try again later.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-xl rounded-2xl mt-10">
      <h2 className="text-3xl font-bold mb-6 text-center text-red-600">
        ❤️ Support LifeDrop
      </h2>

      {!clientSecret ? (
        <>
          <label className="block text-gray-700 mb-2 font-semibold">
            Donation Amount (USD):
          </label>
          <input
            type="number"
            min="1"
            className="border border-gray-300 px-4 py-2 rounded w-full mb-4 focus:outline-none focus:ring focus:ring-red-300"
            value={amount}
            onChange={(e) => setAmount(parseFloat(e.target.value))}
            placeholder="Enter amount"
          />
          <button
            onClick={handleDonate}
            disabled={loading}
            className={`w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded transition ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Processing..." : "Donate Now"}
          </button>
        </>
      ) : (
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <CheckoutForm clientSecret={clientSecret}  amount={amount} />
        </Elements>
      )}
    </div>
  );
};

export default FundUs;
