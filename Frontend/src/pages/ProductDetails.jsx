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
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useDispatch, useSelector } from "react-redux";
import { addToCartThunk, getProductThunk } from "../store/thunk/productThunk";
import { Card, CardContent } from "@/components/ui/card";
import { Star as StarIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { Separator } from "@/components/ui/separator";

export default function ProductDetails() {
  const { productId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const { product, screenLoading, products } = useSelector(
    (state) => state.productSlice
  );
  const relatedProducts = products
    ?.filter((p) => p._id !== product?._id)
    .slice(0, 4);

  const addToCart = (productId) => {
    dispatch(addToCartThunk({ productId, quantity }));
  };

  const buyNow = (productId) => {
    addToCart(productId);
    navigate("/cart");
  };

  useEffect(() => {
    if (productId) {
      dispatch(getProductThunk(productId));
    }
  }, [productId, dispatch]);

  if (!product && !screenLoading) {
    return (
      <div className="p-8 text-center text-red-600">Product not found!</div>
    );
  }

  return (
    <div className="min-h-screen bg-amber-50 p-4">
      <div className="max-w-4xl mx-auto grid lg:grid-cols-2 gap-8">
        {/* Images */}
        <div className="h-[85%] overflow-hidden rounded shadow mx-auto w-[80%] md:w-[90%] lg:w-[80%]">
          <img
            src={product?.images[0]?.url}
            alt={product?.name}
            className="w-full h-full object-cover object-top"
          />
          {/* <div className="flex mt-2 space-x-2">
            {product?.images.map((img, i) => (
              <button
                key={i}
                onClick={() => setSelectedImage(i)}
                className={`w-20 h-20 rounded overflow-hidden border ${
                  i === selectedImage ? "border-amber-600" : "border-gray-200"
                }`}
              >
                <img
                  src={img.url}
                  alt={`thumb-${i}`}
                  className="object-cover w-full h-full"
                />
              </button>
            ))}
          </div> */}
        </div>

        {/* Product Info */}
        <div>
          <div className="flex justify-between">
            <Badge variant="outline">{product?.category}</Badge>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsWishlisted((w) => !w)}
            >
              <Heart
                className={
                  isWishlisted ? "fill-red-500 text-red-500" : "text-gray-600"
                }
              />
            </Button>
          </div>

          <h1 className="text-3xl font-bold text-amber-900 mb-2">
            {product?.name}
          </h1>

          <div className="mt-4 flex items-baseline space-x-4">
            <span className="text-4xl font-bold text-amber-700">
              ₹{product?.price}
            </span>
          </div>

          <p className="mt-4 text-gray-700">{product?.description}</p>

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
            <Button size="lg" className="flex-1" onClick={buyNow}>
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
                      {relatedProduct?.rating || "4.3"}
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
