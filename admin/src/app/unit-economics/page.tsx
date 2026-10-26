import type { Metadata } from "next";
import { Stagger } from "@/components/motion/Stagger";
import PageHeader from "@/components/ui/PageHeader";
import UnitEconomicsView from "@/components/views/UnitEconomicsView";

export const metadata: Metadata = { title: "Unit Economics" };

export default function Page() {
  return (
    <Stagger>
      <PageHeader href="/unit-economics" />
      <UnitEconomicsView />
    </Stagger>
  );
}
