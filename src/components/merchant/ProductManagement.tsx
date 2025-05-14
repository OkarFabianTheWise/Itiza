// ProductManagement.tsx
import React, { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useToast } from "../ui/use-toast";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Id } from "../../../convex/_generated/dataModel";

interface ProductManagementProps {
  merchantId: Id<"merchants">; // Changed from string to Id<"merchants">
}

const ProductManagement: React.FC<ProductManagementProps> = ({
  merchantId,
}) => {
  const products = useQuery(api.queries.getMerchantProducts, {
    merchantId,
  });

  const { toast } = useToast();
  const deleteProduct = useMutation(api.mutations.updateProduct); // Need to specify the mutation
  const [editingProduct, setEditingProduct] = useState<any>(null);

  const handleDelete = async (productId: Id<"products">) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteProduct({
          productId: productId,
          isActive: false, // Instead of deleting, we set isActive to false
        });
        toast({
          title: "Success",
          description: "Product deleted successfully",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete product",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl">
      <h2 className="text-2xl font-serif text-gray-900 mb-6">
        Product Management
      </h2>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Image</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products?.map((product) => (
            <TableRow key={product._id}>
              <TableCell>
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-16 h-16 object-cover rounded-lg"
                />
              </TableCell>
              <TableCell>{product.name}</TableCell>
              <TableCell>${product.price}</TableCell>
              <TableCell>{product.category}</TableCell>
              <TableCell>{product.stockQuantity}</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setEditingProduct(product)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => handleDelete(product._id)}
                  >
                    Delete
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog
        open={!!editingProduct}
        onOpenChange={() => setEditingProduct(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
          </DialogHeader>
          {/* Add edit form here */}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductManagement;
// Compare this snippet from src/components/ui/table.tsx:
