"use server";

import Stripe from "stripe";
import { auth } from "@/auth";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
const priceId = "price_1Qc3FKSFPdjYqwuDdddNPWjt";

// create checkout link
export const createCheckoutSession = async ({
  email,
  name = "Test",
  address = {
    line1: "123 Main Street",
    city: "Springfield",
    state: "Uttarakhand",
    postal_code: "263601",
    country: "India",
  },
}: {
  email: string;
  name: string;
  address: {
    line1: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
  };
}) => {
  try {
    const session = await stripe.checkout.sessions.create({
      customer_email: email,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `http://localhost:3000/new-product`,
      cancel_url: `http://localhost:3000/`,
      billing_address_collection: "required", // Ensure billing address is collected
      metadata: {
        customer_name: name, // Add customer name in metadata
        customer_address: JSON.stringify(address), // Add customer address in metadata
      },
    });

    return { url: session.url };
  } catch (error) {
    console.log(error);
    throw new Error("Error creating checkout session");
  }
};

// create customer link
export const createCustomerLink = async () => {
  try {
    console.log("customer link")
    const authenticatedUser = await auth();
    if (
      !authenticatedUser ||
      !authenticatedUser.user ||
      !authenticatedUser.user.email
    ) {
      throw new Error("User not authenticated");
    }

    const email = authenticatedUser.user.email;

    const customers = await stripe.customers.list({
      email: email,
    });
    console.log(customers);

    if (!customers || customers.data.length == 0) {
      throw new Error("Customer not found");
    }

    const customer = customers.data[0];

    if (!customer || !customer.id) {
      throw new Error("Customer not found");
    }

    const portal = await stripe.billingPortal.sessions.create({
      customer: customer.id,
      // return_url: `https://product-hunt-five.vercel.app/my-products`,
      return_url: `http://localhost:3000/`,
    });

    return portal.url;
  } catch (error) {
    console.error("Stripe error:", error);
    throw new Error("Customer not found");
  }
};

// next payment time
export const getNextPaymentDetails = async () => {
  try {
    const authenticatedUser = await auth();

    if (
      !authenticatedUser ||
      !authenticatedUser.user ||
      !authenticatedUser.user.email
    ) {
      throw new Error("User not authenticated");
    }

    const email = authenticatedUser.user.email;

    const customers = await stripe.customers.list({
      email: email,
    });

    if (!customers || customers.data.length === 0) {
      throw new Error("Customer not found");
    }

    const customer = customers.data[0];

    const subscriptions = await stripe.subscriptions.list({
      customer: customer.id,
      status: "active",
    });

    if (!subscriptions || subscriptions.data.length === 0) {
      throw new Error("No active subscriptions found for customer");
    }

    const subscription = subscriptions.data[0];

    const nextPaymentDate = new Date(subscription.current_period_end * 1000); // Convert timestamp to Date
    // Format date to MM/DD/YYYY
    const formattedNextPaymentDate = nextPaymentDate.toLocaleDateString(
      "en-US",
      {
        month: "2-digit",
        day: "2-digit",
        year: "numeric",
      }
    );

    const priceId = subscription.items.data[0].price.id;
    const price = await stripe.prices.retrieve(priceId);

    if (!price || !price.unit_amount || !price.currency) {
      throw new Error("Price not found");
    }

    return {
      nextPaymentDate: formattedNextPaymentDate,
      amount: price.unit_amount / 100, // Assuming the amount is in cents, convert to dollars
      currency: price.currency,
    };
  } catch (error) {
    console.error("Error fetching payment details:", error);
    return null;
  }
};
