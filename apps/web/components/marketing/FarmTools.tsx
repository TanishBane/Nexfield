import Link from "next/link";
import {
  ArrowUpRight,
  LayoutDashboard,
  ScanLine,
  Droplets,
  MessageCircle,
  ClipboardList,
  ChartNoAxesCombined,
  Sprout,
} from "lucide-react";

export const farmTools = [
  {
    id: "control",
    name: "Farm overview",
    description: "Your fields, conditions, and priorities at a glance.",
    icon: LayoutDashboard,
    color: "green",
    detail: "Bring your farm information into a clear daily overview.",
    steps: [
      "Choose your farm and review its profile.",
      "Check available soil and weather observations.",
      "Review the tasks and alerts that need your attention.",
    ],
  },
  {
    id: "fieldsight",
    name: "Crop health",
    description: "Take a closer look at the leaves in your field.",
    icon: ScanLine,
    color: "yellow",
    detail:
      "Upload a leaf photo and review an analysis of visible crop symptoms.",
    steps: [
      "Take a clear, well-lit photo of the affected leaf.",
      "Upload the image to request a crop analysis.",
      "Review the findings and suggested next steps.",
    ],
  },
  {
    id: "twin",
    name: "Water planning",
    description: "Explore irrigation plans before you put them to work.",
    icon: Droplets,
    color: "blue",
    detail: "Explore your field in 3D and compare irrigation scenarios.",
    steps: [
      "Review your crop, soil, and field settings.",
      "Adjust water inputs to compare possible scenarios.",
      "Use the results to support your irrigation planning.",
    ],
  },
  {
    id: "intelligence",
    name: "Farm insights",
    description: "Ask questions with your farm information in view.",
    icon: MessageCircle,
    color: "pink",
    detail:
      "Bring questions about your crops and conditions into one conversation.",
    steps: [
      "Select the farm you want to discuss.",
      "Ask about your crop observations or planned work.",
      "Review the available context behind each response.",
    ],
  },
  {
    id: "operations",
    name: "Daily tasks",
    description: "Keep field work, supplies, and harvest plans together.",
    icon: ClipboardList,
    color: "orange",
    detail: "Organize the work that keeps your farm moving.",
    steps: [
      "Create a task for your field or crop.",
      "Review priorities and update work as it progresses.",
      "Keep track of supplies and harvest storage.",
    ],
  },
  {
    id: "markets",
    name: "Market prices",
    description: "Compare mandi prices and estimate transport costs.",
    icon: ChartNoAxesCombined,
    color: "lilac",
    detail: "Compare available market prices and plan your next sale.",
    steps: [
      "Choose your crop and browse available mandi prices.",
      "Compare markets and check the date of each price.",
      "Estimate transport costs for your planned consignment.",
    ],
  },
];
export function FarmTools() {
  return (
    <div className="farm-tools">
      {farmTools.map(({ id, name, description, icon: Icon, color }) => (
        <Link
          className={`tool-card ${color}`}
          href={`/platform/${id}`}
          key={id}
        >
          <div className="tool-card-top">
            <Icon size={28} strokeWidth={1.6} />
            <ArrowUpRight size={22} />
          </div>
          <h3>{name}</h3>
          <p>{description}</p>
        </Link>
      ))}
    </div>
  );
}
export function GetStarted() {
  return (
    <section className="get-started">
      <Sprout size={44} strokeWidth={1.5} />
      <h2>Let’s get growing.</h2>
      <p>A clearer view of your farm starts here.</p>
      <Link href="/control" className="farm-button yellow">
        Open sample farm <ArrowUpRight size={20} />
      </Link>
      <Link href="/demo" className="text-link">
        Try the sample farm
      </Link>
    </section>
  );
}
