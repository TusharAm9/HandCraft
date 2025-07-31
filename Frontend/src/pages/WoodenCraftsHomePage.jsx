import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import ProductCard from "../components/items/ProductCard";
import { Input } from "@/components/ui/input";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProductsThunk } from "../store/thunk/productThunk";

export default function WoodenCraftsHomePage() {
  const dispatch = useDispatch();
  const { products, screenLoading } = useSelector(
    (state) => state.productSlice
  );
  const relatedProducts = products?.slice(0, 8);

  useEffect(() => {
    dispatch(getProductsThunk());
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      <section
        className="relative bg-cover bg-center bg-no-repeat py-20"
        style={{ backgroundImage: `url("/bgFinal.png")` }}
      >
        <div
          className="absolute inset-0 bg-amber-100"
          style={{ opacity: 0.2 }}
        ></div>
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-5xl font-bold text-amber-50 mb-6">
            Handcrafted Wooden Treasures
          </h2>
          <p className="text-xl text-amber-100 mb-8 max-w-2xl mx-auto">
            Discover unique, handmade wooden products crafted by skilled
            artisans. Each piece tells a story of tradition, quality, and
            natural beauty.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/all-products">
              <Button
                size="lg"
                className="bg-orange-500 hover:bg-orange-700 px-8"
              >
                Shop Now
              </Button>
            </Link>
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
          {screenLoading && (
            <div className="text-center">
              <div role="status">
                <svg
                  aria-hidden="true"
                  className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-amber-400"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="currentColor"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentFill"
                  />
                </svg>
                <span className="sr-only">Loading...</span>
              </div>
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {relatedProducts?.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
        <Link
          to="/all-products"
          className="items-center justify-center mt-6 pt-4 flex"
        >
          <Button
            variant="outline"
            className="border-amber-700 text-amber-700 hover:bg-amber-50 bg-transparent"
          >
            View All Products
          </Button>
        </Link>
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
