import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { db } from "@/server";
import { eq } from "drizzle-orm";
import { orders } from "@/server/schema";
import { auth } from "@/server/auth";
import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { formatDistance, subMinutes } from "date-fns";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default async function OrdersPage() {
  const user = await auth();
  if (!user) {
    redirect("/");
  }

  const userOrders = await db.query.orders.findMany({
    where: eq(orders.userID, user?.user.id),
    with: {
      orderProduct: {
        with: {
          product: true,
          productVariants: { with: { variantImages: true } },
          order: true,
        },
      },
    },
  });

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Your Orders</CardTitle>
          <CardDescription>Check the status of your orders</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableCaption>A list of your recent orders.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Order Number</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {userOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell> {order.id} </TableCell>
                  <TableCell> {order.total} DA</TableCell>
                  <TableCell>
                    <Badge
                      className={
                        order.status === "succeeded"
                          ? "bg-green-700 hover:bg-green-800"
                          : "bg-yellow-700 hover:bg-yellow-800"
                      }
                    >
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs font-medium">
                    {formatDistance(subMinutes(order.created!, 0), new Date(), {
                      addSuffix: true,
                    })}
                  </TableCell>
                  <TableCell>
                    <Dialog>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant={"ghost"}>
                            <MoreHorizontal size={16} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem>
                            <DialogTrigger>View Details</DialogTrigger>
                          </DropdownMenuItem>
                          {/* {order.receiptURL ? (
                            <DropdownMenuItem>
                              <Link href={order.receiptURL} target="_blank">
                                Download Receipt
                              </Link>
                            </DropdownMenuItem>
                          ) : null} */}
                        </DropdownMenuContent>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Order Details #{order.id}</DialogTitle>
                            <DialogDescription>
                              Full name: {order.lastName} {order.firstName}
                            </DialogDescription>
                            <DialogDescription>
                              Phone: {order.phone}
                            </DialogDescription>
                            <DialogDescription>
                              Total: {order.total} DA
                            </DialogDescription>
                            <DialogDescription>
                            Products Cost: {order.productsBuyCost} DA
                            </DialogDescription>
                            <DialogDescription>
                              Shipping: {order.wilaya} / {order.shippingMethod}{" "}
                              / {order.shippingCost} DA{" "}
                              
                            </DialogDescription>
                            <DialogDescription>
                      
                              {order.shippingAddress
                                ? `Adresse: ${order.shippingAddress}`
                                : "Adresse: N/A"}
                            </DialogDescription>
                          </DialogHeader>
                          <Card className="p-4">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Image</TableHead>
                                  <TableHead>Price</TableHead>
                                  <TableHead>Product</TableHead>
                                  <TableHead>Color</TableHead>
                                  <TableHead>Quantity</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {order.orderProduct.map(
                                  ({ product, productVariants, quantity }) => (
                                    <TableRow key={productVariants.id}>
                                      <TableCell>
                                        <Image
                                          className=" rounded-md"
                                          src={
                                            productVariants.variantImages[0].url
                                          }
                                          width={48}
                                          height={48}
                                          alt={product.title}
                                        />
                                      </TableCell>
                                      <TableCell> {product.price} DA</TableCell>
                                      <TableCell> {product.title} </TableCell>
                                      <TableCell>
                                        <div
                                          style={{
                                            background: productVariants.color,
                                          }}
                                          className="w-4 h-4 rounded-full"
                                        ></div>
                                      </TableCell>
                                      <TableCell> {quantity} </TableCell>
                                    </TableRow>
                                  )
                                )}
                              </TableBody>
                            </Table>
                          </Card>
                        </DialogContent>
                      </DropdownMenu>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
