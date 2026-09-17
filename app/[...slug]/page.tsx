import type { Metadata } from "next";
import { Suspense } from "react";
import QtmSite from "../components/QtmSite";
import { findIndustry, findProduct, findSupplier, industries, news, products, suppliers } from "../data";

export function generateStaticParams() {
  const staticRoutes = [
    ["about-us"],
    ["products"],
    ["products", "timing-belts"],
    ["products", "timing-belts", "polyurethane-open-end"],
    ["products", "timing-belts", "polyurethane-endless"],
    ["products", "timing-belts", "rubber-open-end"],
    ["products", "timing-belts", "rubber-endless"],
    ["products", "v-belts"],
    ["products", "v-belts", "rubber-raw-edge"],
    ["products", "v-belts", "rubber-wrapped"],
    ["products", "v-belts", "rubber-banded"],
    ["suppliers"],
    ["industries"],
    ["our-network"],
    ["contact-us"],
    ["request-a-quote"],
    ["product-identification"],
    ["b2b"],
    ["news"],
    ["search"],
    ["privacy-policy"],
    ["cookie-policy"],
    ["terms"],
  ];

  return [
    ...staticRoutes,
    ...products.map((item) => ["products", item.slug]),
    ...suppliers.map((item) => ["suppliers", item.slug]),
    ...industries.map((item) => ["industries", item.slug]),
    ...news.map((item) => ["news", item.slug]),
  ].map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string[] }> }): Promise<Metadata> {
  const { slug } = await params;
  const [section, item] = slug;
  const product = section === "products" && item ? findProduct(item) : undefined;
  const supplier = section === "suppliers" && item ? findSupplier(item) : undefined;
  const industry = section === "industries" && item ? findIndustry(item) : undefined;
  const article = section === "news" && item ? news.find((n) => n.slug === item) : undefined;
  const title = product ? `${product.name} | QTM Group` : supplier ? `${supplier.name} | QTM Supplier Network` : industry ? `${industry.name} Industrial Solutions | QTM Group` : article ? `${article.title} | QTM News` : `${slug.map((s) => s.replace(/-/g, " ")).join(" · ")} | QTM Group`;
  const description = product?.description || supplier?.relationship || article?.excerpt || "Industrial belting, power transmission and regional technical support from QTM Group.";
  return { title, description, alternates: { canonical: `/${slug.join("/")}` }, openGraph: { title, description, type: article ? "article" : "website" } };
}

export default async function DynamicPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  return (
    <Suspense fallback={null}>
      <QtmSite segments={slug} />
    </Suspense>
  );
}
