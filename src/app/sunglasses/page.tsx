import ShopPage from "../shop/page";

export const dynamic = "force-dynamic";

export default function SunglassesPage() {
  return <ShopPage searchParams={Promise.resolve({ category: "sunglasses" })} />;
}
