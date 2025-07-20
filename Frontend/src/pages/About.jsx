import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <div className="min-h-screen bg-white">
      <section
        className="relative h-[20vh] bg-cover bg-center flex items-center justify-center"
        style={{
          backgroundImage: `url("/bgFinal.png")`,
        }}
      >
        <div className="absolute inset-0 bg-amber-100 opacity-[0.4] z-0" />
        <div className="z-10 text-center px-4">
          <h1 className="text-5xl font-bold text-amber-800 mb-4">Our Story</h1>
          <p className="text-xl text-amber-50 max-w-2xl mx-auto">
            From the heart of artisans to your home — learn what makes us
            unique.
          </p>
        </div>
      </section>
      <section className="py-20 px-6 sm:px-10 md:px-20 bg-gradient-to-b from-amber-50 to-white">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-4xl font-semibold text-amber-900 mb-6">
            Handcrafted with Purpose
          </h2>
          <p className="text-lg text-amber-800 leading-relaxed mb-10">
            At Artisan Craft, every product is more than just a piece — it's a
            story. We collaborate with skilled rural artisans across India to
            bring timeless wooden and bamboo creations to life. Our mission is
            to preserve cultural heritage, support local craftsmanship, and
            offer sustainable products to discerning customers worldwide.
          </p>
        </div>

        {/* Values Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 max-w-6xl mx-auto mt-10">
          <div className="bg-white border border-amber-200 shadow-sm rounded-2xl p-6">
            <h3 className="text-xl font-bold text-amber-900 mb-2">
              Sustainability
            </h3>
            <p className="text-amber-800 text-sm">
              We prioritize eco-friendly practices by using responsibly sourced
              wood and bamboo.
            </p>
          </div>
          <div className="bg-white border border-amber-200 shadow-sm rounded-2xl p-6">
            <h3 className="text-xl font-bold text-amber-900 mb-2">
              Empowering Artisans
            </h3>
            <p className="text-amber-800 text-sm">
              Our platform uplifts underrepresented craftsmen by giving them
              global visibility.
            </p>
          </div>
          <div className="bg-white border border-amber-200 shadow-sm rounded-2xl p-6">
            <h3 className="text-xl font-bold text-amber-900 mb-2">
              Timeless Quality
            </h3>
            <p className="text-amber-800 text-sm">
              Every product is meticulously handcrafted, ensuring durability and
              aesthetic appeal.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <Link to="/all-products">
            <Button className="bg-amber-700 text-white px-8 py-3 hover:bg-amber-800">
              Explore Our Collection
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default About;
