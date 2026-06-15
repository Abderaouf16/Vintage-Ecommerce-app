"use client";

import { zVariantSchema } from "@/types/variant-schema";
import { useFieldArray, useFormContext } from "react-hook-form";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Table,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Reorder } from "framer-motion"
import { UploadDropzone } from "@/app/api/uploadthing/upload";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

export default function VariantImages() {
  const { getValues, control, setError } = useFormContext<zVariantSchema>();
  const { fields, remove, append, update, move } = useFieldArray({
    control,
    name: "variantImages",
  });

  const [active , setActive] = useState(0)

  return (
    <div className="">
      <FormField
        control={control}
        name="variantImages"
        render={() => (
          <FormItem>
            <FormLabel>Images</FormLabel>
            <FormControl>
              <UploadDropzone
                config={{ mode: "auto" }}
                className="  ut-allowed-content:text-secondary-foreground ut-label:text-primary ut-upload-icon:text-primary/50 hover:bg-primary/10 transition-all duration-500 ease-in-out border-secondary ut-button:bg-primary/75 ut-button:ut-readying:bg-secondary "
                endpoint="variantUploader"
                onUploadError={(error) => {
                  console.log(error);
                  setError("variantImages", {
                    type: "validate",
                    message: error.message,
                  });
                  return;
                }}
                onBeforeUploadBegin={(files) => {
                  files.map((file) =>
                    append({
                      name: file.name,
                      size: file.size,
                      //Temporary image URLs are generated with URL.createObjectURL()
                      url: URL.createObjectURL(file),
                    })
                  );
                  return files;
                }}
                onClientUploadComplete={(files) => {
                  const images = getValues('variantImages')
                  images.map((field, imgIDX) => {
                    //It checks if the image has a temporary (blob:) URL.
                    if( field.url.search('blob:') === 0 ) {
                      //If yes, it looks for the uploaded file with the same name.
                      const image = files.find((img) => img.name === field.name)
                      //If a match is found, it updates the form with the uploaded image data.
                      if(image) {
                        update(imgIDX, {
                          url: image.url,
                          name: image.name,
                          size: image.size,
                          key: image.key,
                        } )
                      }
                    }
                   
                  })
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <div className=" rounded-md overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Images</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <Reorder.Group 
          as="tbody"
          values={fields}
          onReorder={(e) => {
            const activeElement = fields[active]
            e.map((item, index) =>  {
              if(item === activeElement) {
                move(active, index)
                setActive(index)
                return
              }
              return
            } )
          }}>
            {fields.map((field, index) => {
              return (
                <Reorder.Item
                  as="tr"
                 key={field.id}
                 value={field}
                 id={field.id}
                 onDragStart={()=> setActive(index)} 
                className={cn(
                  field.url.search("blob:") === 0
                    ? "animate-pulse transition-all"
                    : "",
                  "text-sm font-bold text-muted-foreground hover:text-primary"
                )}
                >
                  <TableCell className="text-xs">{index}</TableCell>
                  <TableCell className="text-xs">{field.name}</TableCell>
                  <TableCell className="text-xs">
                    {(field.size / (1024 * 1024)).toFixed(2)} MB
                  </TableCell>
                  <TableCell>
                    <div className=" ">
                      <Image src={field.url} alt={field.name} width={72} height={48} className=" rounded-md" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button variant={'ghost'}
                    onClick={(e) => {
                      e.preventDefault()
                      remove(index)
                    }}
                    className=" scale-75"
                    >
                      <Trash className="h-4"/>
                    </Button>
                  </TableCell>
                </Reorder.Item>
              );
            })}
          </Reorder.Group>
        </Table>
      </div>
    </div>
  );
}
