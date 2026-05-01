import { RadialSidebar } from "@/components/RadialSidebar";
import { StickyHeader } from "@/components/StickyHeader";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="admin-layout">
      {/* We reuse the global layout elements, or we could have specific admin navigation here. */}
      {children}
    </div>
  );
}
