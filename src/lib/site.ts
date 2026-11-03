/** Store-wide business details. Edit here and the footer, WhatsApp button and legal pages follow. */
export const SITE = {
  email: "muhammadhammasrasheed@gmail.com",
  /** digits only, country code first (used in wa.me links) */
  whatsapp: "923317010755",
  whatsappDisplay: "+92 331 7010755",
  address: "Sargodha, Pakistan",
  /** minor units; orders at or above this ship free */
  freeShippingOver: 15000,
  social: {
    instagram: "https://www.instagram.com/flutter.by.hammas/",
    tiktok: "https://www.tiktok.com/@flutterbyhammas",
    youtube: "https://www.youtube.com/@flutterwithhammas",
  },
} as const;

export const whatsappLink = (text = "Hi! I have a question about my order.") =>
  `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(text)}`;
