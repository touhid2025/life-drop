import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useContext, useEffect, useState } from "react";
import Swal from "sweetalert2";
import { AuthContext } from "../provider/AuthProvider";

const CheckoutForm = ({ clientSecret }) => {
  const { userr } = useContext(AuthContext);
  const [currentUser, setCurrentUser] = useState(null);
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchUser = async () => {
      try {
        const res = await fetch("https://assignment-twelve-server-side-eight.vercel.app/api/users");
        const data = await res.json();
        const matchedUser = data.users.find((user) => user.email === userr.email);
        if (isMounted) setCurrentUser(matchedUser);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    if (userr?.email) {
      fetchUser();
    }

    return () => {
      isMounted = false;
    };
  }, [userr]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    const card = elements.getElement(CardElement);
    if (!card) {
      Swal.fire("Error", "Payment information is missing.", "error");
      return;
    }

    setProcessing(true);

    try {
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card,
        },
      });

      if (result.error) {
        Swal.fire({
          icon: "error",
          title: "Payment Failed",
          text: result.error.message,
          confirmButtonColor: "#d33",
        });
      } else if (result.paymentIntent.status === "succeeded") {
        const donationInfo = {
          name: currentUser?.name || "Anonymous",
          email: currentUser?.email,
          amount: result.paymentIntent.amount / 100, // Stripe returns cents
          paymentIntentId: result.paymentIntent.id,
          bloodGroup: currentUser?.bloodGroup || "",
          district: currentUser?.district || "",
          upazila: currentUser?.upazila || "",
          avatar: currentUser?.avatar || "",
          date: new Date().toISOString(),
        };

        const saveRes = await fetch("https://assignment-twelve-server-side-eight.vercel.app/api/donations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(donationInfo),
        });

        if (saveRes.ok) {
          Swal.fire({
            icon: "success",
            title: "Thank You!",
            text: "Your donation was successful. ❤️",
            confirmButtonColor: "#3085d6",
          });
        } else {
          Swal.fire("Error", "Donation saved to Stripe, but failed to save to database.", "warning");
        }
      }
    } catch (err) {
      console.error("Error confirming payment:", err);
      Swal.fire("Error", "Something went wrong with the payment.", "error");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-xl shadow-md space-y-4 animate__animated animate__fadeInUp"
    >
      <CardElement
        options={{
          style: {
            base: {
              fontSize: "16px",
              color: "#333",
              "::placeholder": {
                color: "#999",
              },
            },
            invalid: {
              color: "#fa755a",
            },
          },
        }}
        className="border p-3 rounded"
      />
      <button
        type="submit"
        disabled={!stripe || processing}
        className={`w-full text-white py-2 rounded transition-all ${
          processing ? "bg-gray-400" : "bg-red-600 hover:bg-red-700"
        }`}
      >
        {processing ? "Processing..." : "Confirm Donation"}
      </button>
    </form>
  );
};

export default CheckoutForm;
