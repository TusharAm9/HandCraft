import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import ProductCard from "../components/items/ProductCard";
import { Input } from "@/components/ui/Input";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProductsThunk } from "../store/thunk/productThunk";

export default function WoodenCraftsHomePage() {
  const dispatch = useDispatch();
  const { products } = useSelector((state) => state.productSlice);
  const relatedProducts = products?.slice(0, 8);

  useEffect(() => {
    dispatch(getProductsThunk());
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      <section className="relative bg-gradient-to-r from-amber-100 to-orange-100 py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-5xl font-bold text-amber-900 mb-6">
            Handcrafted Wooden Treasures
          </h2>
          <p className="text-xl text-amber-800 mb-8 max-w-2xl mx-auto">
            Discover unique, handmade wooden products crafted by skilled
            artisans. Each piece tells a story of tradition, quality, and
            natural beauty.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/all-products">
              <Button
                size="lg"
                className="bg-amber-700 hover:bg-amber-800 px-8"
              >
                Shop Now
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="border-amber-700 text-amber-700 hover:bg-amber-50 px-8 bg-transparent"
            >
              Learn Our Story
            </Button>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <h3 className="text-3xl font-bold text-amber-900">
              Featured Products
            </h3>
            <Link to="/all-products">
              <Button
                variant="outline"
                className="border-amber-700 text-amber-700 hover:bg-amber-50 bg-transparent"
              >
                View All Products
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {relatedProducts?.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-amber-50">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-3xl font-bold text-amber-900 mb-4">
            Stay Connected
          </h3>
          <p className="text-amber-800 mb-8 max-w-2xl mx-auto">
            Subscribe to our newsletter for exclusive offers, new product
            launches, and artisan stories delivered to your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <Input
              placeholder="Enter your email"
              className="flex-1 border-amber-200 focus:border-amber-400"
            />
            <Button className="bg-amber-700 hover:bg-amber-800">
              Subscribe
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
