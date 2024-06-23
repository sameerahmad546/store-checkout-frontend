import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Button } from "../components/ui/button";
import { v4 as uuidv4 } from "uuid";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../components/ui/form";
import { Input } from "../components/ui/input";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  address: z
    .string()
    .min(5, { message: "Address must be at least 5 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
});

const CheckoutForm = () => {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      address: "",
      email: "",
    },
  });

  const stripe = useStripe();
  const elements = useElements();

  const onSubmit = async (formData) => {
    console.log(formData);
    console.log(elements.getElement(CardElement));
    if (!stripe || !elements) {
      return; // Stripe.js has not yet loaded.
    }

    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/checkout/create-payment",
        {
          ...formData,
          items: [{ id: "6677ed6a58606604bbd353c1", quantity: 1 }],
        }
      );

      const { error, paymentIntent } = await stripe.confirmCardPayment(
        data.clientSecret,
        {
          payment_method: {
            card: elements.getElement(CardElement),
            billing_details: {
              name: formData.name,
            },
          },
        }
      );

      if (error) {
        console.error(error.message);
      } else {
        if (paymentIntent.status === "succeeded") {
          await axios.post(
            "http://localhost:5000/api/checkout/confirm-payment",
            {
              orderId: data.orderId,
              paymentIntentId: paymentIntent.id,
            }
          );
          alert("Payment successful!");
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input placeholder="123 Main St" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="example@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="cardNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Card Number</FormLabel>
              <FormControl>
                <CardElement
                  options={{
                    style: {
                      base: { fontSize: "16px" },
                    },
                  }}
                  className="border-2 border-gray-200 p-2 rounded-md"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="bg-black text-white">
          Submit
        </Button>
      </form>
    </Form>
  );
};

export default CheckoutForm;
