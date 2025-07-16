import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getProductsThunk } from "../store/thunk/productThunk";
import { Button } from "@/components/ui/button";
import ProductCard from "../components/items/ProductCard";
import { Separator } from "@/components/ui/separator";
import { ArrowUp } from "lucide-react";

const ViewAllProducts = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector(
    (state) => state.productSlice
  );

  useEffect(() => {
    dispatch(getProductsThunk());
  }, [dispatch]);

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-12">
          <h3 className="text-2xl font-bold text-amber-900">All Products</h3>
        </div>

        {loading ? (
          <p className="text-center text-amber-700">Loading products...</p>
        ) : error ? (
          <p className="text-center text-red-500">Error: {error}</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products?.length > 0 ? (
              products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))
            ) : (
              <p className="col-span-full text-center text-gray-500">
                No products available.
              </p>
            )}
          </div>
        )}
      </div>
      <div className="pt-8 flex justify-center">
        <Button
          variant="outline"
          className="border-amber-700 text-amber-700 hover:bg-amber-50 bg-transparent flex items-center gap-2"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <ArrowUp className="w-4 h-4" />
          Back to Top
        </Button>
      </div>
      <div className="relative my-8">
        <Separator className="bg-amber-600 h-[4px] rounded-full" />
      </div>
    </section>
  );
};

export default ViewAllProducts;
