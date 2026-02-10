import { useState } from "react";
import { sendContactMessage } from "../../api/shopify/contact";

export default function ContactForm() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    comment: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await sendContactMessage(form);
      setSuccess(true);
      setForm({ name: "", phone: "", email: "", comment: "" });
    } catch (err) {
      setError("Message send aagala. Thirumba try pannunga.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-[#f4f4f4] py-16">
      <div className="max-w-xl mx-auto px-6">
        <form onSubmit={handleSubmit} className="space-y-6">

          <input
            type="text"
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
            className="w-full border p-3"
          />

          <input
            type="text"
            name="phone"
            placeholder="Phone number"
            value={form.phone}
            onChange={handleChange}
            className="w-full border p-3"
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full border p-3"
            required
          />

          <textarea
            name="comment"
            placeholder="Comment"
            rows="5"
            value={form.comment}
            onChange={handleChange}
            className="w-full border p-3"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-3"
          >
            {loading ? "Sending..." : "Send"}
          </button>

          {success && (
            <p className="text-green-600 text-center">
              Message sent successfully ✅
            </p>
          )}

          {error && (
            <p className="text-red-600 text-center">
              {error}
            </p>
          )}
        </form>
      </div>
    </section>
  );
}
