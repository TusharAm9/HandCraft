import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Upload, X, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { addNewProductThunk } from "../store/thunk/productThunk";

const categories = ["Furniture", "Kitchenware", "Decor", "Storage"];

const AddProduct = () => {
  const dispatch = useDispatch();
  // Getting loading states from redux store as per your original code
  const { buttonLoading } = useSelector((state) => state.productSlice);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    longDescription: "", // new field added
    category: "",
    originalPrice: "", // new field added
    price: "",
    stock: "",
  });

  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");

  const handleInputChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setImages((prev) => [...prev, ...files]);
    const previewUrls = files.map((file) => URL.createObjectURL(file));
    setPreviews((prev) => [...prev, ...previewUrls]);
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("name", formData.name);
    data.append("description", formData.description);
    data.append("longDescription", formData.longDescription); // append new field
    data.append("category", formData.category);
    data.append("originalPrice", formData.originalPrice); // append new field
    data.append("price", formData.price);
    data.append("stock", formData.stock);
    images.forEach((file) => data.append("images", file));

    for (let pair of data.entries()) {
      console.log(pair[0], pair[1]);
    }

    const result = await dispatch(addNewProductThunk(data));

    if (result?.payload?.success) {
      setSuccessMessage("Product uploaded successfully!");
      setFormData({
        name: "",
        description: "",
        longDescription: "",
        category: "",
        originalPrice: "",
        price: "",
        stock: "",
      });
      setImages([]);
      setPreviews([]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-amber-900 mb-2">
          Add New Product
        </h1>

        {successMessage && (
          <Alert className="border-green-200 bg-green-50 mb-6">
            <AlertDescription className="text-green-800">
              {successMessage}
            </AlertDescription>
          </Alert>
        )}

        <form
          onSubmit={handleSubmit}
          encType="multipart/form-data"
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Label>Product Name *</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  required
                />

                <Label>Description *</Label>
                <Textarea
                  rows={4}
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  required
                />

                {/* New Long Description Input */}
                <Label>Long Description</Label>
                <Textarea
                  rows={6}
                  value={formData.longDescription}
                  onChange={(e) =>
                    handleInputChange("longDescription", e.target.value)
                  }
                  placeholder="Add detailed product info (optional)"
                />

                <Label>Category *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(val) => handleInputChange("category", val)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label>Original Price</Label>
                    <Input
                      type="number"
                      value={formData.originalPrice}
                      onChange={(e) =>
                        handleInputChange("originalPrice", e.target.value)
                      }
                      placeholder="Optional"
                    />
                  </div>
                  <div>
                    <Label>Price *</Label>
                    <Input
                      type="number"
                      value={formData.price}
                      onChange={(e) =>
                        handleInputChange("price", e.target.value)
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label>Stock *</Label>
                    <Input
                      type="number"
                      value={formData.stock}
                      onChange={(e) =>
                        handleInputChange("stock", e.target.value)
                      }
                      required
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Product Images</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-amber-300 p-4 text-center rounded-lg">
                  <Upload className="mx-auto text-amber-400 h-10 w-10 mb-3" />
                  <p className="text-sm text-gray-600 mb-3">
                    Click to select image files
                  </p>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                    disabled={buttonLoading}
                  />
                  <Label htmlFor="image-upload">
                    <Button
                      type="button"
                      variant="outline"
                      disabled={buttonLoading}
                    >
                      Choose Files
                    </Button>
                  </Label>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-4">
                  {previews.map((src, index) => (
                    <div key={index} className="relative">
                      <img
                        src={src}
                        alt="preview"
                        className="w-full h-32 object-cover rounded"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1"
                        disabled={buttonLoading}
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-4">
                <Button
                  type="submit"
                  className="w-full bg-amber-700 hover:bg-amber-800"
                  disabled={buttonLoading}
                >
                  {buttonLoading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline-block"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v8H4z"
                        />
                      </svg>
                      Publishing...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4 inline-block" />
                      Publish Product
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
