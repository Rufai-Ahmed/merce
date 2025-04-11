import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-[#F2F0F1] font-sans">
      <main className="px-6 py-12 md:px-12 lg:px-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-24">
          <div>
            <div className="aspect-square bg-neutral-900 mb-4 overflow-hidden">
              <img
                src="/images/femaleVybz.jpg"
                alt="Fashion model wearing Big Vybz"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-xs uppercase tracking-wider">
              BIG VYBZ MOVEMENT
            </div>
          </div>

          <div className="flex items-center">
            <img
              src="/images/malevybz.jpg"
              alt="Street style fashion"
              className="w-full h-auto"
            />
          </div>
        </div>

        <div className="text-[8vw] leading-[0.9] font-bold tracking-tighter uppercase mb-24">
          WE ARE
          <br />
          <span className="italic">BIG VYBZ</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-24">
          <div className="text-sm leading-relaxed max-w-md">
            <p className="mb-4">
              BIG VYBZ IS MORE THAN FASHION — IT'S A MOVEMENT. BUILT FOR THE
              BOLD AND INSPIRED BY THE RHYTHM OF THE STREETS, OUR BRAND
              REPRESENTS A NEW WAVE OF EXPRESSION WHERE STYLE MEETS SUBSTANCE.
            </p>
            <p>
              WE DESIGN WITH PURPOSE — BLENDING CULTURE, CONFIDENCE, AND
              CREATIVITY INTO EVERY THREAD. EACH PIECE IS CRAFTED TO ELEVATE
              YOUR PRESENCE AND TELL YOUR STORY WITHOUT SAYING A WORD.
            </p>
          </div>
        </div>

        <div className="text-[5vw] leading-[1.1] font-bold tracking-tighter uppercase mb-24">
          EVERLASTING
          <br />
          NEW STATIC
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-24">
          <div>
            <div className="aspect-square bg-neutral-900 overflow-hidden">
              <img
                src="/images/femalegreen.jpg"
                alt="Urban fashion model"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="flex flex-col justify-between">
            <div className="aspect-square bg-neutral-900 overflow-hidden mb-6">
              <img
                src="/images/malegreen.jpg"
                alt="Street culture"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-sm leading-relaxed">
              <p className="mb-4">
                THIS IS FOR THE DREAMERS, THE GO-GETTERS, THE ONES WHO MOVE
                DIFFERENT AND LIVE LOUD. IF YOU'RE ABOUT MAKING YOUR MARK AND
                OWNING YOUR VIBE, YOU'RE IN THE RIGHT PLACE.
              </p>
              <p>BIG VYBZ ISN'T JUST WHAT YOU WEAR. IT'S WHO YOU ARE.</p>
            </div>
          </div>
        </div>

        <div className="border-t border-neutral-800 pt-12 flex justify-between items-center">
          <div className="text-[5vw] leading-[1.1] font-bold tracking-tighter uppercase">
            READY BE
            <br />
            DIFFERENT?
          </div>
          <ArrowRight className="w-12 h-12" />
        </div>
      </main>
    </div>
  );
}
