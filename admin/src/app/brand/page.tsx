import type { Metadata } from "next";
import { Stagger } from "@/components/motion/Stagger";
import PageHeader from "@/components/ui/PageHeader";
import BrandView from "@/components/views/BrandView";

export const metadata: Metadata = { title: "Brand" };

export default function Page() {
  return (
    <Stagger>
      <PageHeader href="/brand" />
      <BrandView />
    </Stagger>
  );
}
