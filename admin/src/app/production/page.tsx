import type { Metadata } from "next";
import { Stagger } from "@/components/motion/Stagger";
import PageHeader from "@/components/ui/PageHeader";
import ProductionView from "@/components/views/ProductionView";

export const metadata: Metadata = { title: "Production" };

export default function Page() {
  return (
    <Stagger>
      <PageHeader href="/production" />
      <ProductionView />
    </Stagger>
  );
}
