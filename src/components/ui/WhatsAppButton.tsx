import { whatsappLink } from "@/lib/site";

/** Floating chat shortcut. Sits above the product page's mobile add-to-bag bar. */
export function WhatsAppButton() {
  return (
    <a
      href={whatsappLink("Hi! I'd like some help choosing a pair.")}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed right-4 bottom-24 z-[45] grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-white shadow-[0_10px_30px_-8px_rgba(0,0,0,0.6)] transition-transform hover:scale-105 sm:right-6 lg:bottom-6"
    >
      <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor" aria-hidden>
        <path d="M12.04 2a9.9 9.9 0 0 0-8.47 15.03L2 22l5.1-1.34A9.9 9.9 0 1 0 12.04 2Zm0 18.1a8.2 8.2 0 0 1-4.18-1.14l-.3-.18-3.03.8.81-2.95-.2-.31a8.2 8.2 0 1 1 6.9 3.78Zm4.5-6.14c-.25-.12-1.46-.72-1.69-.8-.23-.09-.39-.13-.56.12-.16.25-.64.8-.78.97-.14.16-.29.18-.54.06a6.7 6.7 0 0 1-3.3-2.88c-.25-.43.25-.4.72-1.33.08-.16.04-.3-.02-.43-.06-.12-.56-1.35-.77-1.85-.2-.48-.41-.42-.56-.42h-.48c-.16 0-.43.06-.66.31-.23.25-.87.85-.87 2.08s.9 2.41 1.02 2.58c.12.16 1.76 2.7 4.27 3.78 1.58.68 2.2.74 3 .62.49-.07 1.46-.6 1.67-1.17.2-.58.2-1.07.14-1.18-.06-.1-.23-.16-.48-.28Z" />
      </svg>
    </a>
  );
}
