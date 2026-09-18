import { useState } from "react";
import { FaFacebook, FaWhatsapp, FaPhone, FaEnvelope } from "react-icons/fa";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Contact form submitted:", form);
    setSubmitted(true);
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-10">
      {/* Contact info */}
      <div>
        <h1 className="font-display text-3xl text-plum mb-2">Get in Touch</h1>
        <p className="text-gray-600 mb-6">
          Have a question about an order or a product? Reach us directly.
        </p>

        <div className="flex flex-col gap-4">
          <a href="tel:+8801XXXXXXXXX" className="flex items-center gap-3 text-gray-700 hover:text-plum">
            <FaPhone className="text-lavender text-xl" />
            +880 1XXX-XXXXXX
          </a>
          <a href="mailto:hello@selora.com" className="flex items-center gap-3 text-gray-700 hover:text-plum">
            <FaEnvelope className="text-lavender text-xl" />
            hello@selora.com
          </a>
          <a href="https://facebook.com/yourpage" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-gray-700 hover:text-plum">
            <FaFacebook className="text-lavender text-xl" />
            facebook.com/selora
          </a>
          <a href="https://wa.me/8801XXXXXXXXX" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-gray-700 hover:text-plum">
            <FaWhatsapp className="text-lavender text-xl" />
            +880 1XXX-XXXXXX
          </a>
        </div>
      </div>

      {/* Contact form */}
      <div>
        {submitted && (
          <div className="bg-green-100 text-green-700 rounded-lg p-3 mb-4">
            Thanks! We'll get back to you soon.
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            name="name"
            placeholder="Your name"
            value={form.name}
            onChange={handleChange}
            required
            className="border border-lavender rounded-lg p-3"
          />
          <input
            type="email"
            name="email"
            placeholder="Your email"
            value={form.email}
            onChange={handleChange}
            required
            className="border border-lavender rounded-lg p-3"
          />
          <textarea
            name="message"
            placeholder="Your message"
            value={form.message}
            onChange={handleChange}
            required
            rows={5}
            className="border border-lavender rounded-lg p-3"
          />
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 active:bg-blue-900 active:scale-95 text-white rounded-lg py-3 px-6 w-fit"
          >
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
}