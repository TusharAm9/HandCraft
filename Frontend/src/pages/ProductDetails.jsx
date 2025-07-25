import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ShoppingCart,
  Heart,
  Truck,
  Shield,
  RotateCcw,
  Share2,
  Plus,
  Minus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useDispatch, useSelector } from "react-redux";
import {
  addToCartThunk,
  getProductsThunk,
  getProductThunk,
} from "../store/thunk/productThunk";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star as StarIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function ProductDetails() {
  const { productId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const { product, screenLoading, products, reviews } = useSelector(
    (state) => state.productSlice
  );
  const relatedProducts = products
    ?.filter((p) => p._id !== product?._id && p.category === product?.category)
    .slice(0, 4);

  const addToCart = (productId) => {
    dispatch(addToCartThunk({ productId, quantity }));
  };

  const buyNow = async (productId) => {
    try {
      await dispatch(addToCartThunk({ productId, quantity })).unwrap();
      navigate("/cart");
    } catch (error) {
      console.error("buy now faield", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (productId) {
        try {
          await dispatch(getProductThunk(productId)).unwrap();
          await dispatch(getProductsThunk()).unwrap();
        } catch (error) {
          console.error("Data fetch failed:", error);
        }
      }
    };
    fetchData();
  }, [productId, dispatch]);

  if (screenLoading) {
    return (
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
    );
  }
  if (!product && !screenLoading) {
    return (
      <div className="p-8 text-center text-red-600">Product not found!</div>
    );
  }

  return (
    <div className="min-h-screen bg-amber-50 p-4">
      <div className="max-w-4xl mx-auto grid lg:grid-cols-2 gap-8">
        {/* Images */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="relative aspect-2/3 overflow-hidden rounded shadow mx-auto w-[65%] md:w-[75%]">
            <img
              src={product?.images[selectedImage]?.url}
              alt={product?.name}
              className="w-full h-full object-cover object-top"
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsWishlisted((w) => !w)}
              className="absolute top-2 right-2 z-10 bg-white/70 hover:bg-white/90 rounded-full"
            >
              <Heart
                className={
                  isWishlisted ? "fill-red-500 text-red-500" : "text-gray-600"
                }
              />
            </Button>
          </div>

          {/* Thumbnail Images */}
          <div className="flex justify-center space-x-2 overflow-x-auto pb-2">
            {product?.images?.map((img, i) => (
              <button
                key={i}
                onClick={() => setSelectedImage(i)}
                className={`flex-shrink-0 w-10 h-10 md:w-10 md:h-14 rounded overflow-hidden border-2 transition-all duration-200 ${
                  i === selectedImage
                    ? "border-amber-600 ring-2 ring-amber-200"
                    : "border-gray-200 hover:border-amber-400"
                }`}
              >
                <img
                  src={img.url}
                  alt={`Product image ${i + 1}`}
                  className="object-cover w-full h-full"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div>
          <Badge variant="outline">{product?.category}</Badge>
          <h1 className="text-xl md:text-2xl font-semibold md:font-bold text-amber-900 mb-2 ">
            {product?.name}
          </h1>
          <p className="mt-2 text-sm text-gray-700">{product?.description}</p>
          <div className="mt-4 flex items-baseline space-x-4">
            <span className="text-2xl md:text-3xl font-bold text-amber-700">
              ₹{product?.price}
            </span>
          </div>

          {/* Quantity & Actions */}
          <div className="mt-6 flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            >
              <Minus />
            </Button>
            <span className="font-medium">{quantity}</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() =>
                setQuantity((q) => Math.min(product?.stock, q + 1))
              }
            >
              <Plus />
            </Button>
          </div>

          <div className="mt-4 flex space-x-4">
            <Button
              size="lg"
              className="flex-1"
              onClick={() => buyNow(product._id)}
            >
              Buy Now
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="flex-1"
              onClick={() => addToCart(product._id)}
            >
              <ShoppingCart className="mr-2" />
              Add to Cart
            </Button>
          </div>

          <Button
            variant="ghost"
            className="mt-4 w-full"
            onClick={() => alert("Share link copied!")}
          >
            <Share2 className="mr-2" />
            Share this product
          </Button>

          {/* Trust Icons */}
          <div className="mt-6 grid grid-cols-3 text-center gap-4">
            <div>
              <Truck className="h-8 w-8 text-amber-600 mx-auto mb-2" />
              <p className="text-sm mt-1 text-gray-600">Fast Shipping</p>
            </div>
            <div>
              <Shield className="h-8 w-8 text-amber-600 mx-auto mb-2" />
              <p className="text-sm mt-1 text-gray-600">Secure Payment</p>
            </div>
            <div>
              <RotateCcw className="h-8 w-8 text-amber-600 mx-auto mb-2" />
              <p className="text-sm mt-1 text-gray-600">Easy Returns</p>
            </div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="reviews" className="mb-16">
        <TabsList className="grid w-full grid-cols-1 bg-amber-50">
          <TabsTrigger
            value="reviews"
            className="data-[state=active]:bg-amber-700 data-[state=active]:text-white"
          >
            Reviews
          </TabsTrigger>
        </TabsList>

        <TabsContent value="reviews" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-amber-900">
                  Customer Reviews
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-4xl font-bold text-amber-700">
                    {product?.rating}
                  </div>
                  <div className="flex justify-center mb-2">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon
                        key={i}
                        className={`h-5 w-5 ${
                          i < Math.floor(product?.rating)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-gray-600">
                    Based on {product?.numOfReviews} reviews
                  </p>
                </div>
              </CardContent>
            </Card>
            <div className="lg:col-span-2 space-y-6">
              {reviews?.map((review, index) => {
                return (
                  <Card key={review._id}>
                    <CardContent>
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                          {review.user?.fullName?.[0] || "U"}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-bold">
                              {review.user?.fullName || "Anonymous User"}
                            </h4>
                            <Badge variant="outline" className="text-xs">
                              Verified Purchase
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="flex ">
                              {[...Array(5)].map((_, i) => (
                                <StarIcon
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < Math.floor(review.rating)
                                      ? "fill-yellow-400 text-yellow-400"
                                      : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </span>
                            <span className="text-sm text-gray-600">
                              {new Date(review.createdAt)
                                .toLocaleDateString("en-US")
                                .replaceAll("/", "-")}
                            </span>
                          </div>
                          <p className="text-gray-700">{review.comment}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <section className="mt-16">
        <h3 className="text-2xl font-bold text-amber-900 mb-8">
          You Might Also Like
        </h3>
        <div className="relative">
          <Separator className="bg-amber-600 h-[8px] rounded-full" />
        </div>
        <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {relatedProducts?.map((relatedProduct) => (
            <Card
              key={relatedProduct?._id}
              className="group hover:shadow-lg transition-all duration-300"
            >
              <div className="relative overflow-hidden aspect-square">
                <Link to={`/${relatedProduct._id}`}>
                  <img
                    src={relatedProduct.images?.[0]?.url || "/placeholder.svg"}
                    alt={relatedProduct?.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </Link>
              </div>
              <CardContent className="p-4">
                <h4 className="font-semibold mb-2 line-clamp-2">
                  {relatedProduct?.name}
                </h4>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-amber-700">
                    ₹{relatedProduct?.price}
                  </span>
                  <div className="flex items-center">
                    <StarIcon className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm text-gray-600 ml-1">
                      {relatedProduct?.rating || "4.2"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
