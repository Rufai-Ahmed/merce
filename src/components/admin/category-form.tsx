import { useState } from "react";
import {
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
} from "@/apis/category.api";
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
import { Category } from "@/apis/category.api";
import { toast } from "sonner";

interface CategoryFormProps {
  category?: Category;
  onSuccess: () => void;
  onCancel: () => void;
}

export function CategoryForm({
  category,
  onSuccess,
  onCancel,
}: CategoryFormProps) {
  const [createCategory, { isLoading: isCreating }] =
    useCreateCategoryMutation();
  const [updateCategory, { isLoading: isUpdating }] =
    useUpdateCategoryMutation();

  const [formData, setFormData] = useState({
    name: category?.name || "",
    slug: category?.slug || "",
    description: category?.description || "",
    parent: category?.parent?.toString() || "",
  });

  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const categoryData = {
        name: formData.name,
        slug: formData.slug,
        description: formData.description,
        parent:
          formData.parent === "0" ? undefined : formData.parent || undefined,
        image: imageFile || undefined,
      };

      if (category) {
        await updateCategory({
          id: category.id,
          data: categoryData,
        }).unwrap();
        toast.success("Category updated successfully");
      } else {
        await createCategory(categoryData).unwrap();
        toast.success("Category created successfully");
      }
      onSuccess();
    } catch (error) {
      toast.error("Failed to save category");
      console.error("Failed to save category:", error);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Category Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="slug">Slug</Label>
          <Input
            id="slug"
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
            placeholder="auto-generated if empty"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="parent">Parent Category</Label>
        <Select
          value={formData.parent}
          onValueChange={(value) => setFormData({ ...formData, parent: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select parent category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0" disabled>
              No parent (Root category)
            </SelectItem>
            {/* TODO: Add parent categories from API */}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="image">Category Image</Label>
        <Input
          id="image"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
        />
        {category?.image && (
          <div className="mt-2">
            <img
              src={category.image.src}
              alt={category.name}
              className="h-20 w-20 rounded-md object-cover"
            />
          </div>
        )}
      </div>

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          isLoading={isCreating || isUpdating}
          disabled={isCreating || isUpdating}
          type="submit"
        >
          {category ? "Update Category" : "Create Category"}
        </Button>
      </div>
    </form>
  );
}
