import { Spreadsheet } from "@/components/spreadsheet";
import { createFileRoute } from "@tanstack/react-router";
import siteConfig from "~/site.config";

export const Route = createFileRoute("/_app/_auth/dashboard/_layout/sheet")({
  component: Dashboard,
  beforeLoad: () => ({
    title: `${siteConfig.siteTitle} - Dashboard`,
    headerTitle: "Spreadsheet Editor",
    headerDescription: "Edit your data and calculate with formulas.",
  }),
});

export default function Dashboard() {
  return (
    <div className="flex h-full w-full bg-secondary px-6 py-8 dark:bg-black">
      <div className="z-10 mx-auto flex h-full w-full max-w-screen-xl gap-12">
        <div className="flex w-full flex-col dark:bg-black">
          <Spreadsheet />
        </div>
      </div>
    </div>
  );
}
