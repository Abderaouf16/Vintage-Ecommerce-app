"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { VariantsWithImagesTags } from "@/lib/infer-types";
import { createVariant } from "@/server/actions/create-variant";
import { VariantSchema, zVariantSchema } from "@/types/variant-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { InputTags } from "./input-tags";
import VariantImages from "./variant-images";
import {  useState } from "react";
import { deleteVariant } from "@/server/actions/delete-variant";

export default function ProductVariant({
  children,
  editMode,
  productID,
  variant,
}: {
  children: React.ReactNode;
  editMode: boolean;
  productID?: number;
  variant?: VariantsWithImagesTags;
}) {
  const form = useForm<zVariantSchema>({
    resolver: zodResolver(VariantSchema),
    defaultValues: {
      editMode,
      tags: [],
      productType: "black note book",
      variantImages: [],
      id: variant?.id,
      color: "#000000",
      productID,
    },
  });

  const [open, setOpen] = useState(false);

  const variantDelete = useAction(deleteVariant, {
    onExecute() {
      toast.dismiss(); // Dismiss the loading message
      toast.loading("Deleting product variant...");
      setOpen(false);
    },
    onSuccess: (data) => {
      toast.dismiss(); // Dismiss the loading message

      if (data.data?.error) {
        toast.error(data.data.error);
      }
      if (data.data?.success) {
        toast.success(data.data.success);
      }
    },
  });

  const { status, execute } = useAction(createVariant, {
    onExecute() {
      toast.dismiss(); // Dismiss the loading message
      toast.loading(
        editMode ? "Updating product variant..." : "Creating product variant..."
      );
      setOpen(false);
    },
    onSuccess: (data) => {
      toast.dismiss(); // Dismiss the loading message

      if (data.data?.error) {
        toast.error(data.data.error);
      }
      if (data.data?.success) {
        toast.success(data.data.success);
      }
    },
  });

  function onSubmit(values: zVariantSchema) {
    execute(values);
  }

  const handleDialogOpenChange = (open: boolean) => {
    setOpen(open);
    if (!open) {
      form.reset(); // Reset when closing the dialog
      return;
    }
    if (editMode && variant) {
      // Reset with variant data when editing
      form.reset({
        editMode: true,
        tags: variant.variantTags?.map((tag) => tag.tag) || [],
        productType: variant.productType,
        variantImages:
          variant.variantImages?.map((img) => ({
            name: img.name,
            size: img.size,
            url: img.url,
          })) || [],
        id: variant.id,
        color: variant.color,
        productID: variant.productID,
      });
    }
    if (!editMode) {
      // Reset to default values when creating a new variant
      form.reset({
        editMode: false,
        tags: [],
        productType: "black note book",
        variantImages: [],
        id: undefined,
        color: "#000000",
        productID,
      });
    }
  }



  return (
    <Dialog open={open} onOpenChange={handleDialogOpenChange}>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent className="lg:max-w-screen-lg overflow-y-scroll max-h-[660px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {editMode ? "Edit Variant" : "Create Variant"}
          </DialogTitle>
          <DialogDescription>
            Manage your product variants here. You can add tags, images, and
            more.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="productType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Type</FormLabel>
                  <FormControl>
                    <Input placeholder="shadcn" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Variant Color</FormLabel>
                  <FormControl>
                    <Input type="color" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags</FormLabel>
                  <FormControl>
                    <InputTags {...field} onChange={(e) => field.onChange(e)} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <VariantImages />
            <div className=" flex gap-4 items-center justify-center">
              <Button
                className="w-full "
                type="submit"
                disabled={
                  status === "executing" ||
                  !form.formState.isValid ||
                  !form.formState.isDirty
                }
              >
                {editMode ? "Update Variant" : "Create Variant"}
              </Button>
              {editMode && variant && (
                <Button
                  variant="destructive"
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    variantDelete.execute({ id: variant.id });
                  }}
                >
                  Delete Variant
                </Button>
              )}
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
