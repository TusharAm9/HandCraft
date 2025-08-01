import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getProductsThunk } from "../store/thunk/productThunk";
import ProductCard from "../components/items/ProductCard";
import { Button } from "@/components/ui/button";
import { ArrowUp } from "lucide-react";
import InfiniteScroll from "react-infinite-scroll-component";
import { resetProducts } from "../store/slice/productSlice";

const LIMIT = 12;

const ViewAllProducts = () => {
  const dispatch = useDispatch();
  const { products, screenLoading, error, currentPage, hasMore } = useSelector(
    (state) => state.productSlice
  );
  useEffect(() => {
    dispatch(resetProducts());
    dispatch(getProductsThunk({ page: 1, limit: LIMIT }));
  }, [dispatch]);

  const fetchNext = () => {
    if (!screenLoading && hasMore) {
      dispatch(getProductsThunk({ page: currentPage + 1, limit: LIMIT }));
    }
  };

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-12">
          <h3 className="text-2xl font-bold text-amber-900">All Products</h3>
        </div>

        {error ? (
          <p className="text-center text-red-500">Error: {error}</p>
        ) : (
          <InfiniteScroll
            dataLength={products.length}
            next={fetchNext}
            hasMore={hasMore}
            loader={
              <div className="text-center py-6 text-amber-500 animate-pulse">
                Loading more products...
              </div>
            }
            endMessage={
              <p className="text-center text-gray-400 py-8">
                No more products to show.
              </p>
            }
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products?.length > 0 ? (
                products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))
              ) : !screenLoading ? (
                <p className="col-span-full text-center text-gray-500">
                  No products available.
                </p>
              ) : null}
            </div>
          </InfiniteScroll>
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
    </section>
  );
};

export default ViewAllProducts;
