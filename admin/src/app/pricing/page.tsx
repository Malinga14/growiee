import type { Metadata } from "next";
import { Stagger } from "@/components/motion/Stagger";
import PageHeader from "@/components/ui/PageHeader";
import PricingView from "@/components/views/PricingView";

export const metadata: Metadata = { title: "Pricing" };

export default function Page() {
  return (
    <Stagger>
      <PageHeader href="/pricing" />
      <PricingView />
    </Stagger>
  );
}
