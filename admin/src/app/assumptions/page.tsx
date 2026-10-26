import type { Metadata } from "next";
import { Stagger } from "@/components/motion/Stagger";
import PageHeader from "@/components/ui/PageHeader";
import AssumptionsView from "@/components/views/AssumptionsView";

export const metadata: Metadata = { title: "Assumptions" };

export default function Page() {
  return (
    <Stagger>
      <PageHeader href="/assumptions" />
      <AssumptionsView />
    </Stagger>
  );
}
