import ShopPage from "../shop/page";

export const dynamic = "force-dynamic";

export default function ContactLensesPage() {
  return <ShopPage searchParams={Promise.resolve({ category: "contact-lenses" })} />;
}
