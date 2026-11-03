"use client";

import { useState, type FormEvent } from "react";

/** Demo-only: there is no mailing backend, so this just confirms locally. */
export function Newsletter() {
  const [done, setDone] = useState(false);

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setDone(true);
  };

  if (done) {
    return (
      <p role="status" className="text-accent text-sm tracking-wide">
        Thank you. You are on the list.
      </p>
    );
  }

  return (
    <form
      onSubmit={submit}
      className="flex max-w-md items-center border-b border-current/40 focus-within:border-current"
    >
      <label htmlFor="newsletter-email" className="sr-only">
        Email address
      </label>
      <input
        id="newsletter-email"
        type="email"
        required
        autoComplete="email"
        placeholder="Your email address"
        className="placeholder:text-fg-muted h-12 min-w-0 flex-1 bg-transparent text-base outline-none focus-visible:outline-none"
      />
      <button
        type="submit"
        className="text-accent h-12 shrink-0 pl-4 text-xs font-bold tracking-[0.2em] uppercase"
      >
        Subscribe
      </button>
    </form>
  );
}
