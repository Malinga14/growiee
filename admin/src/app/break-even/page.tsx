import type { Metadata } from "next";
import { Stagger } from "@/components/motion/Stagger";
import PageHeader from "@/components/ui/PageHeader";
import BreakEvenView from "@/components/views/BreakEvenView";

export const metadata: Metadata = { title: "Break-even" };

export default function Page() {
  return (
    <Stagger>
      <PageHeader href="/break-even" />
      <BreakEvenView />
    </Stagger>
  );
}
