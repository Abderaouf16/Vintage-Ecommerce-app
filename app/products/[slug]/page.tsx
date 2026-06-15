import ProductType from "@/components/products/product-type";
import { db } from "@/server";
import { productVariants } from "@/server/schema";
import { eq } from "drizzle-orm";
import { Separator } from "@/components/ui/separator";
import formatPrice from "@/lib/format-price";
import ProductPick from "@/components/products/product-picker";
import ProductShowCase from "@/components/products/product-showcase";
import Reviews from "@/components/reviews/reviews";
import { getReviewAverage } from "@/lib/review-average";
import Stars from "@/components/reviews/starts";
import AddCart from "@/components/cart/add-cart";

// func from nextjs to fetch data then render the other static pages
// goal of the func: Goal: To tell Next.js which pages (slugs) should be pre-rendered at build time.
export const revalidate = 120
export async function generateStaticParams() {
  const data = await db.query.productVariants.findMany({
    with: {
      variantImages: true,
      variantTags: true,
      product: true,
    },
    orderBy: (productVariants, { desc }) => [desc(productVariants.id)],
  });

  if (data) {
    //slug objects is used to generate static paths for a Next.js application. It helps Next.js pre-render
    // pages for each product variant based on its unique slug.
    const slugID = data.map((variant) => ({ slug: variant.id.toString() }));
    return slugID;
  }
  return [];
}

export default async function page(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const variant = await db.query.productVariants.findFirst({
    where: eq(productVariants.id, Number(params.slug)),
    with: {
      product: {
        with: {
          reviews: true,
          productVariants: {
            with: { variantImages: true, variantTags: true },
          },
        },
      },
    },
  });

  if (variant) {
    const reviewAvg = getReviewAverage(
      variant?.product.reviews.map((r) => r.rating)
    );
    return (
      <main>
        <section className="flex flex-col gap-4 lg:flex-row lg:gap-12  pb-32">
          <div className=" flex-1">
            <ProductShowCase variants={variant.product.productVariants} />
          </div>
          <div className="flex flex-1 flex-col gap-2">
            <h2 className="  font-bold text-2xl">{variant?.product.title}</h2>
            <div className="flex items-center justify-between">
              <ProductType variants={variant.product.productVariants} />
              <div className="">
              <Stars
                rating={reviewAvg}
                totalReviews={variant.product.reviews.length}
              />
              </div>
            </div>
            <Separator className="my-2" />
            <p className=" font-medium text-2xl py-2">
              {formatPrice(variant.product.price)} <span className=" px- md:text-sm text-xs text-gray-600">(Sans frais de livraison)</span>
            </p>
            <div
              className=" text-secondary-foreground"
              dangerouslySetInnerHTML={{
                __html: variant.product.description,
              }}
            ></div>
            <p className="text-secondary-foreground pt-2 pb-1 font-medium">
              Couleurs Disponibles:
            </p>
            <div className=" flex gap-2 items-center pb-2">
              {variant.product.productVariants.map((proVariant) => (
                <ProductPick
                  key={proVariant.id}
                  id={proVariant.id}
                  productType={proVariant.productType}
                  price={variant.product.price}
                  image={proVariant.variantImages[0].url}
                  productID={proVariant.productID}
                  color={proVariant.color}
                  title={variant.product.title}
                />
              ))}
            </div>
          <AddCart/>
          </div>
        </section>
{/*         <Reviews productID={variant.productID} />
 */}      </main>
    );
  }
}
