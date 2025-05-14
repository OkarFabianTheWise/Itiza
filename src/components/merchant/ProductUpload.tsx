// ProductManagement.tsx

import React, { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { useToast } from "../ui/use-toast";
import { useWallet } from "@solana/wallet-adapter-react";
import { Id } from "../../../convex/_generated/dataModel";

interface ProductUploadProps {
  merchantId: Id<"merchants">; // Changed from string to Id<"merchants">
}

const ProductUpload: React.FC<ProductUploadProps> = ({ merchantId }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stockQuantity: "",
    imageUrl: "",
    tags: "",
  });

  const wallet = useWallet();
  const { toast } = useToast();
  const createProduct = useMutation(api.mutations.createProduct);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!wallet.publicKey) {
      toast({
        title: "Error",
        description: "Please connect your wallet",
        variant: "destructive",
      });
      return;
    }

    try {
      // Note: Based on your mutation definition, createProduct doesn't accept merchantId directly
      // It needs walletAddress and finds the merchant from there
      await createProduct({
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        category: formData.category,
        stockQuantity: parseInt(formData.stockQuantity),
        imageUrl: formData.imageUrl,
        tags: formData.tags.split(",").map((tag) => tag.trim()),
        walletAddress: wallet.publicKey.toString(),
        metadata: {
          // Include required metadata structure
          weight: undefined, // Optional
          dimensions: undefined, // Optional
          material: undefined, // Optional
        },
      });

      toast({
        title: "Success",
        description: "Product created successfully",
      });

      // Reset form after successful submission
      setFormData({
        name: "",
        description: "",
        price: "",
        category: "",
        stockQuantity: "",
        imageUrl: "",
        tags: "",
      });
    } catch (error) {
      console.error("Error creating product:", error);
      toast({
        title: "Error",
        description: "Failed to create product",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Add New Product</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Product Name</label>
          <Input
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <Textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Price</label>
            <Input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Stock Quantity
            </label>
            <Input
              type="number"
              name="stockQuantity"
              value={formData.stockQuantity}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Category</label>
          <Input
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Image URL</label>
          <Input
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Tags (comma separated)
          </label>
          <Input
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            placeholder="e.g., electronics, gadgets, new"
          />
        </div>

        <Button type="submit" className="w-full">
          Add Product
        </Button>
      </form>
    </div>
  );
};

export default ProductUpload;
