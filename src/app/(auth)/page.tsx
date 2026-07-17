"use client"
import { useEffect, useState } from "react";
import LoginForm from "@/modules/Auth/LoginForm";
import Image from "next/image";

// Drop 3 real images at these paths in public/images/. Feel free to swap
// in different filenames - just keep the array length and update the
// paths below to match.
const CAROUSEL_IMAGES = [
  "/images/login-farm-1.jpg",
  "/images/login-farm-2.jpg",
  "/images/login-farm-3.jpg",
];

const SLIDE_DURATION_MS = 4500;

export default function Page() {
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % CAROUSEL_IMAGES.length);
    }, SLIDE_DURATION_MS);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 flex">
      {/* Left: image carousel */}
      <div className="hidden lg:block lg:w-[46%] relative overflow-hidden">
        {CAROUSEL_IMAGES.map((src, idx) => (
          <Image
            key={src}
            className={`object-cover transition-opacity duration-1000 ${
              idx === activeSlide ? "opacity-100" : "opacity-0"
            }`}
            src={src}
            alt="Mariseth Farms"
            fill
            priority={idx === 0}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 p-10 xl:p-14">
          <h2 className="text-white text-2xl xl:text-3xl font-bold mb-3">
            Manage every farm with ease
          </h2>
          <p className="text-white/80 text-sm max-w-md mb-6">
            Track farms, farmers, supply chain and credit all in one place, built for
            Mariseth&apos;s operations.
          </p>
          <div className="flex items-center gap-2">
            {CAROUSEL_IMAGES.map((src, idx) => (
              <button
                key={src}
                type="button"
                onClick={() => setActiveSlide(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`h-1.5 rounded-full transition-all cursor-pointer ${
                  idx === activeSlide ? "w-6 bg-[#4A8D34]" : "w-1.5 bg-white/40 hover:bg-white/60"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Right: sign-in form panel */}
      <div className="flex-1 flex items-center justify-center bg-[#F8FAFC] px-6 py-12 overflow-y-auto">
        <div className="w-full max-w-[440px] bg-white rounded-2xl shadow-lg shadow-black/5 px-8 py-10 md:px-10">
          <Image
            className="mx-auto w-[60px]"
            src="/images/meriseth-logo.svg"
            alt="meriseth logo"
            width={500}
            height={500}
            priority
          />

          <div className="text-center mt-5">
            <h1 className="font-semibold mb-3 text-2xl md:text-3xl">
              Sign in to <span className="text-[#4A8D34]">Mariseth Farms</span>
            </h1>
            <p className="text-sm text-slate-500">Welcome back! Please sign in to continue</p>
          </div>

          <LoginForm />
        </div>
      </div>
    </div>
  );
}