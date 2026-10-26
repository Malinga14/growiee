import type { Metadata } from "next";
import { Stagger } from "@/components/motion/Stagger";
import PageHeader from "@/components/ui/PageHeader";
import ForecastView from "@/components/views/ForecastView";

export const metadata: Metadata = { title: "Forecast" };

export default function Page() {
  return (
    <Stagger>
      <PageHeader href="/forecast" />
      <ForecastView />
    </Stagger>
  );
}
