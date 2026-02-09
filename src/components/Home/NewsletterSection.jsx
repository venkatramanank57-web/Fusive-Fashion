import { useState } from "react";
import toast from "react-hot-toast";
import { useMutation } from "@apollo/client/react";
import { NEWSLETTER_SUBSCRIBE } from "../../api/shopify/newsletter";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");

  const [subscribeCustomer, { loading }] = useMutation(NEWSLETTER_SUBSCRIBE);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;

    try {
      const { data } = await subscribeCustomer({
        variables: {
          input: {
            email: email,
            password: "newsletter123",   // ⭐ REQUIRED by Shopify
            acceptsMarketing: true,      // ⭐ makes them Email Subscriber
          },
        },
      });

      const errors = data?.customerCreate?.userErrors;

      if (errors && errors.length > 0) {
        toast.error(errors[0].message);
        return;
      }

      toast.success("Successfully subscribed 💌");
      setEmail("");

    } catch (err) {
      console.log(err);
      toast.error("Something went wrong");
    }
  };

  return (
    <section className="bg-[#f4f0eb] py-[80px] lg:py-[100px] relative z-10">
      <div className="max-w-[720px] mx-auto px-6 text-center">

        {/* Title */}
        <h2 className="text-[28px] lg:text-[36px] font-light mb-6">
          Join Our Newsletter
        </h2>

        {/* Subtitle */}
        <p className="text-gray-600 mb-10 text-[15px] lg:text-[16px]">
          Be the first to know about new collections and exclusive offers.
        </p>

        {/* Form */}
        <form
          onSubmit={handleSubscribe}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            className="w-full sm:w-[320px] bg-white px-5 py-3 outline-none border border-transparent focus:border-black transition"
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-black text-white px-8 py-3 hover:opacity-80 transition disabled:opacity-50"
          >
            {loading ? "Subscribing..." : "Subscribe"}
          </button>
        </form>

      </div>
    </section>
  );
}
