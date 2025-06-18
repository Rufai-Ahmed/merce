"use client";
import { useState } from "react";
import {
  useCreateProductMutation,
  useUpdateProductMutation,
} from "@/apis/product.api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Product } from "@/types/product.types";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { useGetCategoriesQuery } from "@/apis/category.api";
import { useGetBrandsQuery } from "@/apis/brand.api";
import { removeNullishValues } from "@/lib/utils";
import { useForm } from "react-hook-form";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import * as z from "zod";

interface ProductFormProps {
  product?: Product | null;
  onSuccess: () => void;
  onCancel: () => void;
}

const productSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  description: z.string().optional(),
  short_description: z.string().optional(),
  price: z.number().optional(),
  regular_price: z.number().min(0, "Regular price must be a positive number"),
  sale_price: z.number().optional(),
  status: z.enum(["publish", "draft", "pending", "private"]),
  type: z.enum(["simple", "variable", "grouped", "external"]),
  stock_quantity: z
    .number()
    .int()
    .min(0, "Stock quantity must be a non-negative integer"),
  manage_stock: z.boolean(),
  in_stock: z.boolean(),
  featured: z.boolean(),
  virtual: z.boolean(),
  downloadable: z.boolean(),
  category: z.string().optional(),
  brand: z.string().optional(),
  variation_options: z
    .object({
      colors: z.array(z.string()).optional(),
      sizes: z.array(z.string()).optional(),
    })
    .optional(),
});

type ProductSchema = z.infer<typeof productSchema>;

export function ProductForm({
  product,
  onSuccess,
  onCancel,
}: ProductFormProps) {
  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();
  const { data: categories } = useGetCategoriesQuery({});
  const { data: brands } = useGetBrandsQuery({});
  const isLoading = isCreating || isUpdating;

  const form = useForm<Omit<Product, "images"> & { images: File[] }>({
    defaultValues: {
      name: product?.name || "",
      description: product?.description || "",
      short_description: product?.short_description || "",
      price: +(product?.price?.toString() || ""),
      regular_price: +(product?.regular_price?.toString() || ""),
      sale_price: +(product?.sale_price?.toString() || ""),
      status: product?.status || "draft",
      type: product?.type || "simple",
      stock_quantity: +(product?.stock_quantity?.toString() || "0"),
      manage_stock: product?.manage_stock || false,
      in_stock: product?.in_stock || true,
      featured: product?.featured || false,
      virtual: product?.virtual || false,
      downloadable: product?.downloadable || false,
      category: product?.category || "",
      brand: product?.brand || "",
      variation_options: {
        colors:
          JSON.parse((product?.variation_options as string) || "{}")?.colors ||
          [],
        sizes:
          JSON.parse((product?.variation_options as string) || "{}")?.sizes ||
          [],
      },
    },
  });

  const [images, setImages] = useState<File[]>([]);
  const [imagePreview, setImagePreview] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>(
    (product?.images || [])?.map((e) => e.src) || []
  );

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newImages = Array.from(e.target.files);
      setImages((prevImages) => [...prevImages, ...newImages]);
      const previews = newImages.map((file) => URL.createObjectURL(file));
      setImagePreview((prevPreviews) => [...prevPreviews, ...previews]);
      form.setValue("images", newImages, {
        shouldDirty: true,
        shouldTouch: true,
      });
      form.trigger("images");
    }
  };

  const handleDeleteImage = (index: number, isExisting: boolean) => {
    if (isExisting) {
      setExistingImages((prevImages) =>
        prevImages.filter((_, i) => i !== index)
      );
    } else {
      setImages((prevImages) => prevImages.filter((_, i) => i !== index));
      setImagePreview((prevPreviews) =>
        prevPreviews.filter((_, i) => i !== index)
      );
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    setImages((prevImages) => [...prevImages, ...droppedFiles]);
    const previews = droppedFiles.map((file) => URL.createObjectURL(file));
    setImagePreview((prevPreviews) => [...prevPreviews, ...previews]);
  };

  const onSubmit = async (data: any) => {
    try {
      const productData = removeNullishValues({
        name: data.name,
        short_description: data.short_description,
        description: data.description,
        price: parseFloat(data.regular_price),
        regular_price: parseFloat(data.regular_price),
        sale_price: data.sale_price ? parseFloat(data.sale_price) : undefined,
        status: data.status,
        type: data.type,
        stock_quantity: parseInt(data.stock_quantity),
        in_stock: data.in_stock,
        category: data.category,
        images: existingImages,
        attributes: product?.attributes || undefined,
      }) as Partial<Product>;

      if (data.type === "variable") {
        productData.variation_options = {
          colors: data.variation_options.colors,
          sizes: data.variation_options.sizes,
        };
      }

      const formDataToSend = new FormData();
      Object.entries(productData).forEach(([key, value]) => {
        if (value) {
          if (key === "variation_options") {
            formDataToSend.append(key, JSON.stringify(value));
          } else if (Array.isArray(value)) {
            formDataToSend.append(key, value.join(","));
          } else {
            formDataToSend.append(key, value as string);
          }
        }
      });

      images.forEach((image) => {
        if (image) {
          formDataToSend.append("images", image);
        }
      });

      if (product) {
        await updateProduct({
          id: product._id,
          data: formDataToSend,
        }).unwrap();
        toast.success("Product updated successfully");
      } else {
        await createProduct(formDataToSend).unwrap();
        toast.success("Product created successfully");
      }
      onSuccess();
    } catch (error) {
      toast.error("Failed to save product");
      console.error("Failed to save product:", error);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 max-h-[90vh] overflow-y-auto"
      >
        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product Name</FormLabel>
                <FormControl>
                  <Input {...field} required />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product Type</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="simple">Simple</SelectItem>
                    <SelectItem value="variable">Variable</SelectItem>
                    <SelectItem value="grouped">Grouped</SelectItem>
                    <SelectItem value="external">External</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="regular_price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Regular Price</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" {...field} required />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="sale_price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sale Price (Optional)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="stock_quantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Stock Quantity</FormLabel>
                <FormControl>
                  <Input type="number" {...field} required />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="publish">Published</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="private">Private</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories?.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="brand"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Brand</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select brand" />
                  </SelectTrigger>
                  <SelectContent>
                    {brands?.map((brand) => (
                      <SelectItem key={brand.id} value={brand.id}>
                        {brand.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="manage_stock"
            render={({ field }) => (
              <FormItem className="flex items-center space-x-2">
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel>Manage Stock</FormLabel>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="in_stock"
            render={({ field }) => (
              <FormItem className="flex items-center space-x-2">
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel>In Stock</FormLabel>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="featured"
            render={({ field }) => (
              <FormItem className="flex items-center space-x-2">
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel>Featured Product</FormLabel>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="virtual"
            render={({ field }) => (
              <FormItem className="flex items-center space-x-2">
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel>Virtual Product</FormLabel>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="downloadable"
            render={({ field }) => (
              <FormItem className="flex items-center space-x-2">
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel>Downloadable Product</FormLabel>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="short_description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Short Description</FormLabel>
              <FormControl>
                <Textarea {...field} rows={2} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Description</FormLabel>
              <FormControl>
                <Textarea {...field} rows={6} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-2">
          <Label htmlFor="images">Product Images</Label>
          <div
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className="border-2 border-dashed border-gray-300 p-4 rounded-md"
          >
            <Input
              id="images"
              type="file"
              multiple
              onChange={handleImageChange}
              accept="image/*"
            />
            <p className="text-sm text-gray-500 mt-2">
              Drag and drop images here
            </p>
          </div>
          {existingImages.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {existingImages.map((image, index) => (
                <div key={index} className="relative">
                  <img
                    src={image}
                    alt={`Existing ${index + 1}`}
                    className="w-20 h-20 object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => handleDeleteImage(index, true)}
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                  >
                    X
                  </button>
                </div>
              ))}
            </div>
          )}
          {imagePreview.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {imagePreview.map((preview, index) => (
                <div key={index} className="relative">
                  <img
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    className="w-20 h-20 object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => handleDeleteImage(index, false)}
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                  >
                    X
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {form.watch("type") === "variable" && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Colors</Label>
              <div className="flex flex-wrap gap-2">
                {["Red", "Blue", "Green", "Black", "White"].map((color) => (
                  <div key={color} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`color-${color}`}
                      checked={form
                        ?.watch("variation_options.colors")
                        ?.includes(color)}
                      onChange={(e) => {
                        const newColors = e.target.checked
                          ? [
                              ...(form.watch("variation_options.colors") || []),
                              color,
                            ]
                          : form
                              ?.watch("variation_options.colors")
                              ?.filter((c: string) => c !== color);
                        form.setValue("variation_options.colors", newColors);
                      }}
                    />
                    <Label htmlFor={`color-${color}`}>{color}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Sizes</Label>
              <div className="flex flex-wrap gap-2">
                {["Small", "Medium", "Large", "X-Large"].map((size) => (
                  <div key={size} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`size-${size}`}
                      checked={form
                        ?.watch("variation_options.sizes")
                        ?.includes(size)}
                      onChange={(e) => {
                        const newSizes = e.target.checked
                          ? [
                              ...(form.watch("variation_options.sizes") || []),
                              size,
                            ]
                          : form
                              ?.watch("variation_options.sizes")
                              ?.filter((s: string) => s !== size);
                        form.setValue("variation_options.sizes", newSizes);
                      }}
                    />
                    <Label htmlFor={`size-${size}`}>{size}</Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button isLoading={isLoading} disabled={isLoading} type="submit">
            {product ? "Update Product" : "Create Product"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
