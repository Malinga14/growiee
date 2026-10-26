import { Stagger } from "@/components/motion/Stagger";
import PageHeader from "@/components/ui/PageHeader";
import OverviewView from "@/components/views/OverviewView";

export default function Page() {
  return (
    <Stagger>
      <PageHeader href="/" />
      <OverviewView />
    </Stagger>
  );
}
