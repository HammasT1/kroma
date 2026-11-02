import { TransitionLink } from "@/components/ui/TransitionLink";

export default function NotFound() {
  return (
    <main id="main" className="relative z-10 grid min-h-svh place-items-center px-6 text-center">
      <div>
        <p className="font-display text-[28vw] leading-[0.8] font-black sm:text-[18rem]">404</p>
        <p className="mt-4 text-lg">That pair isn&apos;t in the collection.</p>
        <TransitionLink
          href="/"
          className="bg-accent text-on-accent mt-6 inline-flex h-12 items-center rounded-full px-8 text-sm font-bold tracking-widest uppercase"
        >
          Back home
        </TransitionLink>
      </div>
    </main>
  );
}
