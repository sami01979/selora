import { FaFacebook, FaWhatsapp, FaPhone, FaEnvelope } from "react-icons/fa";

const CONTACTS = [
  {
    label: "Call Us",
    value: "+880 1540-407044",
    href: "tel:+8801540407044",
    icon: FaPhone,
    external: false,
  },
  {
    label: "WhatsApp",
    value: "+880 1540-407044",
    href: "https://wa.me/8801540407044",
    icon: FaWhatsapp,
    external: true,
  },
  {
    label: "Email",
    value: "selora363@gmail.com",
    href: "mailto:selora363@gmail.com",
    icon: FaEnvelope,
    external: false,
  },
  {
    label: "Facebook",
    value: "Selora on Facebook",
    href: "https://www.facebook.com/share/14u9reP9njJ/",
    icon: FaFacebook,
    external: true,
  },
];

export default function Contact() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10 sm:py-14">
      <div className="text-center mb-10">
        <h1 className="font-display text-3xl sm:text-4xl text-plum mb-3">Get in Touch</h1>
        <p className="text-gray-600 max-w-md mx-auto">
          Have a question about an order or a product? Reach us directly.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {CONTACTS.map(({ label, value, href, icon: Icon, external }) => (
          <a key={label} href={href} target={external ? "_blank" : undefined} rel={external ? "noopener noreferrer" : undefined} className="flex items-center gap-4 border border-lavender rounded-lg p-4 hover:border-plum hover:shadow-md active:scale-95 transition">
            <span className="flex items-center justify-center h-12 w-12 rounded-full bg-lavender/20 text-plum text-2xl shrink-0">
              <Icon />
            </span>
            <span className="min-w-0">
              <span className="block text-xs uppercase tracking-wide text-gray-500">{label}</span>
              <span className="block text-plum font-medium break-words">{value}</span>
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}