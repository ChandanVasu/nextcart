import Razorpay from "./handleRzpPayment";
import handleStripePayment from "./handleStripePayment";
import handlePaypalPayment from "./handlePaypalPayment";

export default function DoPayment() {
  const doPayment = ({ products, paymentDetails, billingDetails, setOrderCreatedLoading }) => {
    console.log("Payment Details:", paymentDetails);
    console.log("Billing Details:", billingDetails);
    console.log("Products:", products);

    if (paymentDetails?.paymentMethod?.id === "razorpay") {
      Razorpay({ products, paymentDetails, billingDetails });
    }
    if (paymentDetails?.paymentMethod?.id === "stripe") {
      handleStripePayment({ products, paymentDetails, billingDetails, setOrderCreatedLoading });
    }
    if (paymentDetails?.paymentMethod?.id === "paypal") {
      handlePaypalPayment({ products, paymentDetails, billingDetails });
    }
  };

  return doPayment;
}
