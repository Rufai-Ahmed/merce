"use client";
import { useState } from "react";
import {
  useGetProductsQuery,
  useDeleteProductMutation,
} from "@/apis/product.api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { MoreHorizontal, Plus, Search } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { ProductForm } from "@/components/admin/product-form";
import { toast } from "sonner";
import { Product } from "@/types/product.types";

export default function ProductsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const perPage = 10;

  const { data, isLoading } = useGetProductsQuery({
    page,
    per_page: perPage,
    search,
    fields: [
      "id",
      "name",
      "price",
      "regular_price",
      "sale_price",
      "images",
      "average_rating",
      "stock_quantity",
      "status",
      "type",
      "category",
      "variation_options",
      "short_description",
      "description",
    ] as Array<keyof Product>,
  });

  const [deleteProduct] = useDeleteProductMutation();

  const handleDelete = async (id: string) => {
    try {
      await deleteProduct(id).unwrap();
      toast.success("Product deleted successfully");
    } catch (error) {
      toast.error("Failed to delete product");
      console.error("Failed to delete product:", error);
    }
  };

  const handleBulkDelete = async () => {
    if (!data) return;
    if (confirm("Are you sure you want to delete selected products?")) {
      try {
        await Promise.all(
          data.data.map((product) => deleteProduct(product._id).unwrap())
        );
      } catch (error) {
        console.error("Failed to delete products:", error);
      }
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Products</h1>
          <p className="text-muted-foreground">Manage your store's products</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Add New Product</DialogTitle>
            </DialogHeader>
            <ProductForm
              onSuccess={() => setIsCreateDialogOpen(false)}
              onCancel={() => setIsCreateDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      <Dialog
        open={!!editingProduct}
        onOpenChange={(o) => setEditingProduct(o ? editingProduct : null)}
      >
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
          </DialogHeader>
          <ProductForm
            product={editingProduct}
            onSuccess={() => {
              setEditingProduct(null);
              setTimeout(
                () => (document.body.style.pointerEvents = "auto"),
                100
              );
            }}
            onCancel={() => {
              setEditingProduct(null);
              setTimeout(
                () => (document.body.style.pointerEvents = "auto"),
                100
              );
            }}
          />
        </DialogContent>
      </Dialog>

      <div className="flex items-center justify-between">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
          />
        </div>

        <Button variant="destructive" onClick={handleBulkDelete}>
          Delete Selected
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.data.map((product: Product) => (
              <TableRow key={product._id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {product.images[0]?.src && (
                      <img
                        src={product.images[0].src}
                        alt={product.name}
                        className="h-10 w-10 rounded-md object-cover"
                      />
                    )}
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-muted-foreground">
                        ID: {product._id}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium">
                      {formatCurrency(product.price)}
                    </p>
                    {product.sale_price &&
                      product.sale_price < product.regular_price && (
                        <p className="text-sm text-green-600">
                          {Math.round(
                            ((product.regular_price - product.sale_price) /
                              product.regular_price) *
                              100
                          )}
                          % off
                        </p>
                      )}
                  </div>
                </TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                      product.stock_quantity > 10
                        ? "bg-green-100 text-green-700"
                        : product.stock_quantity > 0
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {product.stock_quantity || 0} in stock
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-500">★</span>
                    <span>{product.average_rating.toFixed(1)}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                      product.status === "publish"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {product.status}
                  </span>
                </TableCell>
                <TableCell>
                  <DropdownMenu modal={false}>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                      
                        className="cursor-pointer"
                        onClick={() => setEditingProduct(product)}
                      >
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDelete(product._id)}
                        className="text-red-600"
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {data?.data.length} of {data?.pagination.total} products
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            onClick={() => setPage(page + 1)}
            disabled={!data || page >= data.pagination.total_pages}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
