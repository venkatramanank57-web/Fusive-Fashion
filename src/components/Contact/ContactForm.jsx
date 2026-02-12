import { useState } from "react";
import { sendContactMessage } from "../../api/shopify/contact";
import Toast from "../Toast";

export default function ContactForm() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    comment: "",
  });

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await sendContactMessage(form);

      setToast({
        show: true,
        message: "Message sent successfully!",
        type: "success",
      });

      setForm({ name: "", phone: "", email: "", comment: "" });

    } catch (err) {
      setToast({
        show: true,
        message: "Message send aagala. Thirumba try pannunga.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-[#f4f4f4] pb-16">
      <Toast
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() =>
          setToast((prev) => ({ ...prev, show: false }))
        }
      />

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

        </form>
      </div>
    </section>
  );
}
