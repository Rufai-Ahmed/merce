"use client";

import type React from "react";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Contact Page Content */}
      <main className="max-w-full mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row min-h-screen bg-white text-black">
          <div className="w-full md:w-1/2 p-8 md:p-16 flex flex-col">
            <h1 className="text-5xl md:text-8xl font-bold tracking-tighter mb-12">
              CONTACT US
            </h1>

            <div className="mb-12">
              <p className="text-sm leading-relaxed">
                For any inquiries, collaborations, or just to say hello,
                we&apos;d love to hear from you! Reach out, and let&apos;s
                connect.
              </p>
            </div>

            <div className="space-y-12">
              <section>
                <h2 className="text-xl font-medium mb-4">LOCATION</h2>
                <p className="text-sm leading-relaxed">
                  BIG VYBZ FLAGSHIP STORE
                  <br />
                  Eti Osa, Lekki, Lagos, Nigeria 101233
                </p>
                <div className="mt-4">
                  <p className="text-sm">CUSTOMER SUPPORT</p>
                  <p className="text-sm">support@bigvybz.com</p>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-medium mb-4">SALES</h2>
                <p className="text-sm">BIG VYBZ RETAIL</p>
                <p className="text-sm">sales@bigvybz.com</p>
              </section>

              <section>
                <h2 className="text-xl font-medium mb-4">HEAD OFFICE</h2>
                <p className="text-sm leading-relaxed">
                  BIG VYBZ CORPORATION
                  <br />
                  Eti Osa, Lekki, Lagos, Nigeria 101233
                  <br />
                  +2349078324596
                </p>
              </section>
            </div>
          </div>

          <div className="w-full md:w-1/2 relative">
            <Image
              src="/images/femaleVybz.jpg"
              alt="Fashion model in black outfit with wide-leg pants"
              fill
              className="object-cover object-center"
              priority
            />
          </div>
        </div>

        {/* Map Section */}
        <div className="mt-16 w-full">
          <h2 className="text-2xl font-bold mb-6 text-center">
            Visit Our Store
          </h2>
          <div className="h-96 w-full bg-gray-200 rounded-lg overflow-hidden">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d63427.97620249956!2d3.4721975!3d6.4350816!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103bf53280e7648d%3A0x4d01e5de6b847fe2!2sEti-Osa%2C%20Lekki%2C%20Lagos%2C%20Nigeria!5e0!3m2!1sen!2sus!4v1713088118893!5m2!1sen!2sus"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </main>
    </div>
  );
}
