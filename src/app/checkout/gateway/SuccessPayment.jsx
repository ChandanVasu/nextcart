export default async function SuccessPayment({ paymentData, checkoutData, billingDetails }) {
  console.log("Payment Success: ", paymentData);
  console.log("Checkout Data: ", checkoutData);
  console.log("Billing Details: ", billingDetails);

  return SuccessPayment;
}
