import { Button } from "@/ui/button";
import { useLocation, useRouteContext, useRouter } from "@tanstack/react-router";
import { RefreshCw } from "lucide-react";

export function Header() {
  const router = useRouter();
  const routeContext = useRouteContext({
    from: router.state.matches.slice(-1)[0].id,
  });
  const location = useLocation();
  console.log(location);

  // TODO: move this to layouts: if sheets is in the path, then we want to show extra actions
  const isSheet = location.pathname.includes("sheet");

  return (
    <header className="z-10 flex w-full flex-col border-b border-border bg-card px-6">
      <div className="mx-auto flex w-full max-w-screen-xl items-center justify-between py-8">
        <div className="flex flex-col items-start gap-2">
          <h1 className="text-2xl font-medium text-primary/80">
            {routeContext?.headerTitle}
          </h1>
          <p className="text-base font-normal text-primary/60">
            {routeContext?.headerDescription}
          </p>
        </div>
        {isSheet && (
          <div className="flex items-center gap-2">
            <Button variant="outline">
              <RefreshCw className="mr-2 h-4 w-4" />
              Reset Demo
            </Button>
            {/* <Button variant="outline">
              <Save className="mr-2 h-4 w-4" />
              Save Data
            </Button> */}
          </div>
        )}
      </div>
    </header>
  );
}
