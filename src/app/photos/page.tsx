"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

// People wearing the brand with placeholder images
const people = [
  {
    id: 1,
    name: "Isoko Boy",
    image: "/images/Isokoboy.jpg",
    description: "Styled in Big Vybz",
  },
  {
    id: 2,
    name: "Vanjosh",
    image: "/images/zttw.jpg",
    description: "Vanjosh Rocking Big Vybz Nigeria Inspired Jersey X ZTTW ❤️",
  },
  {
    id: 3,
    name: "Candy Bleakz",
    image: "/images/iamcandybleakz.jpg",
    description: "Candy bleakz rocking the bigvybz red cap",
  },
  {
    id: 4,
    name: "Kelvin Itua",
    image: "/images/vybzjer.jpg",
    description: "BIG VYBZ Nigeria Jersey Inspired Merch Rocked By Kelvin",
  },
  {
    id: 5,
    name: "Olivia Twist",
    image: "/images/femaleVybz.jpg",
    description: "Olivia Twist Rocking The BigVybz All Day",
  },
  {
    id: 6,
    name: "Chisom",
    image: "/images/big.png",
    description: "Chisom Out Rocking BigVybz In Style",
  },
  // {
  //   id: 7,
  //   name: "Naomi Wright",
  //   image: "/images/femaleVybz.jpg",
  //   description: "Wearing Big Vybz at a creative industry meetup",
  // },
  // {
  //   id: 8,
  //   name: "Darius King",
  //   image: "/images/femaleVybz.jpg",
  //   description: "Representing Big Vybz at a community event",
  // },
];

export default function Gallery() {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [cursorText, setCursorText] = useState("");
  const [isHovering, setIsHovering] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollY, setScrollY] = useState(0);

  // Handle scroll for parallax effect
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle mouse movement for custom cursor
  const handleMouseMove = (e: React.MouseEvent) => {
    setCursorPosition({ x: e.clientX, y: e.clientY });
  };

  // Handle image click to open gallery
  const openGallery = (id: number) => {
    setSelectedImage(id);
    document.body.style.overflow = "hidden";
  };

  // Handle gallery close
  const closeGallery = () => {
    setSelectedImage(null);
    document.body.style.overflow = "auto";
  };

  // Navigate to next/previous image
  const navigateGallery = (direction: "next" | "prev") => {
    if (selectedImage === null) return;

    const currentIndex = people.findIndex(
      (person) => person.id === selectedImage
    );
    let newIndex;

    if (direction === "next") {
      newIndex = (currentIndex + 1) % people.length;
    } else {
      newIndex = (currentIndex - 1 + people.length) % people.length;
    }

    setSelectedImage(people[newIndex].id);
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedImage === null) return;

      if (e.key === "Escape") closeGallery();
      if (e.key === "ArrowRight") navigateGallery("next");
      if (e.key === "ArrowLeft") navigateGallery("prev");
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedImage]);

  return (
    <div
      className="min-h-screen bg-[#F2F0F1] font-sans relative"
      onMouseMove={handleMouseMove}
    >
      {/* Custom cursor */}
      <AnimatePresence>
        {isHovering && (
          <motion.div
            className="fixed w-24 h-24 rounded-full flex items-center justify-center pointer-events-none z-50 mix-blend-difference"
            style={{
              left: cursorPosition.x,
              top: cursorPosition.y,
              backgroundColor: "black",
              color: "white",
            }}
            initial={{ scale: 0, x: "-50%", y: "-50%" }}
            animate={{ scale: 1, x: "-50%", y: "-50%" }}
            exit={{ scale: 0, x: "-50%", y: "-50%" }}
          >
            <span className="text-xs font-medium">{cursorText}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Gallery Title */}
      <div className="px-6 py-12 md:px-12 lg:px-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-12"
        >
          <h1 className="text-[8vw] leading-[0.9] font-bold tracking-tighter uppercase text-black">
            THE
            <br />
            <span className="italic">COLLECTION</span>
          </h1>
          <p className="text-xl mt-6 max-w-2xl text-neutral-700">
            Welcome home to the Big Vybz experience. Immerse yourself in our
            visual journey through style, culture, and expression. This is where
            our movement comes to life.
          </p>
        </motion.div>

        {/* Gallery Grid with enhanced visual appeal */}
        <div
          ref={containerRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10"
        >
          {people.map((person, index) => {
            // Calculate different parallax speeds based on index
            const parallaxSpeed = 0.05 + (index % 3) * 0.02;

            return (
              <motion.div
                key={person.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                style={{
                  y: scrollY * parallaxSpeed * (index % 2 === 0 ? 1 : -1),
                  marginTop:
                    index % 3 === 1 ? "3rem" : index % 3 === 2 ? "1.5rem" : "0",
                }}
                className="relative overflow-hidden group rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                onMouseEnter={() => {
                  setIsHovering(true);
                  setCursorText("View");
                }}
                onMouseLeave={() => {
                  setIsHovering(false);
                  setCursorText("");
                }}
                onClick={() => openGallery(person.id)}
              >
                <div className="aspect-[3/4] overflow-hidden bg-white">
                  <motion.img
                    src={person.image}
                    alt={person.name}
                    className="w-full h-full object-cover transition-transform"
                    whileHover={{ scale: 1.05 }}
                  />
                </div>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                >
                  <h3 className="text-xl font-bold text-white">
                    {person.name}
                  </h3>
                  <p className="text-sm text-neutral-200 mt-2">
                    {person.description}
                  </p>
                </motion.div>
              </motion.div>
            );
          })}
        </div>

        {/* Exhibition Info with warmer, more inviting colors */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 1 }}
          className="mt-32 border-t border-neutral-300 pt-16 grid grid-cols-1 md:grid-cols-2 gap-16"
        >
          <div>
            <h2 className="text-3xl font-bold mb-6 text-black">
              The Living Gallery
            </h2>
            <p className="text-neutral-700 mb-4">
              This is more than a gallery—it's a living room for style. A space
              where our community comes together to celebrate expression through
              fashion. Each image tells a story of how Big Vybz lives in the
              world.
            </p>
            <p className="text-neutral-700">
              Here, fashion transcends clothing to become a statement, a
              movement, an identity. This is the Big Vybz effect—where you're
              always at home in your style.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm uppercase tracking-wider mb-3 text-neutral-500">
                Collection
              </h3>
              <p className="text-xl text-black">Always Evolving</p>
            </div>
            <div>
              <h3 className="text-sm uppercase tracking-wider mb-3 text-neutral-500">
                Curator
              </h3>
              <p className="text-xl text-black">Big Vybz Family</p>
            </div>
            <div>
              <h3 className="text-sm uppercase tracking-wider mb-3 text-neutral-500">
                Featured
              </h3>
              <p className="text-xl text-black">
                {people.length} Style Stories
              </p>
            </div>
            <div>
              <h3 className="text-sm uppercase tracking-wider mb-3 text-neutral-500">
                Experience
              </h3>
              <p className="text-xl text-black">Immersive & Personal</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Fullscreen Gallery Modal */}
      <AnimatePresence>
        {selectedImage !== null && (
          <motion.div
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button
              onClick={closeGallery}
              className="absolute top-6 right-6 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              aria-label="Close gallery"
            >
              <X className="w-6 h-6" />
            </button>

            <button
              onClick={() => navigateGallery("prev")}
              className="absolute left-6 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button
              onClick={() => navigateGallery("next")}
              className="absolute right-6 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              aria-label="Next image"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {people.map((person) => {
              if (person.id !== selectedImage) return null;

              return (
                <motion.div
                  key={person.id}
                  className="w-full max-w-5xl p-6 flex flex-col md:flex-row gap-8 items-center"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ type: "spring", damping: 25 }}
                >
                  <div className="flex-1 overflow-hidden rounded-lg">
                    <motion.img
                      src={person.image}
                      alt={person.name}
                      className="w-full h-auto max-h-[80vh] object-contain"
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    />
                  </div>

                  <motion.div
                    className="md:w-80 space-y-6"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <div>
                      <h2 className="text-3xl font-bold text-white">
                        {person.name}
                      </h2>
                    </div>

                    <p className="text-neutral-300">{person.description}</p>

                    <div className="pt-6 border-t border-white/20"></div>
                  </motion.div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
