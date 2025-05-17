import { Spreadsheet } from "@/components/spreadsheet";
import { createFileRoute } from "@tanstack/react-router";
import siteConfig from "~/site.config";

export const Route = createFileRoute("/_app/_auth/dashboard/_layout/")({
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
          <div>
          <div className="mt-8 space-y-4 text-sm text-muted-foreground">
            <h3 className="text-lg font-semibold text-foreground">AI Formula Examples</h3>
            <p>Type <code> =AI:</code> followed by any of these prompts in a cell:</p>
            <p>Ex. =AI: Count all the numbers over 20 in column A</p>
            <div className="space-y-2">
              <h4 className="font-medium text-foreground">Data Analysis</h4>
              <ul className="list-disc pl-5 space-y-1">
                <li>Count all numbers greater than 20 in column A</li>
                <li>Find the average of the top 3 values in column B</li>
                <li>Show the difference between max and min values in row 1</li>
              </ul>

              <h4 className="font-medium text-foreground">Text Operations</h4>
              <ul className="list-disc pl-5 space-y-1">
                <li>Combine the text from cells A1 and C1 with a comma between them</li>
                <li>Count how many cells in column C contain the word 'count"</li>
                <li>Convert all text in cell F1 to uppercase</li>
              </ul>

              <h4 className="font-medium text-foreground">Conditional Logic</h4>
              <ul className="list-disc pl-5 space-y-1">
                <li>If A1 is greater than 100, show 'High', otherwise show 'Low'</li>
                <li>Check if any cells in range A1:A10 contain negative numbers</li>
                <li>Count how many values in column A are above average</li>
              </ul>

            </div>

            <p className="mt-4 text-xs italic">Note: The AI will generate the appropriate formula based on your request. You can also ask for custom calculations not listed here!</p>
          </div>
          <div className="mt-8 space-y-4 text-sm text-muted-foreground">
            <h3 className="text-lg font-semibold text-foreground">Frequently Asked Questions</h3>
            
            <div className="space-y-2">
              <h4 className="font-medium text-foreground">Common Error Messages</h4>
              <dl className="space-y-4">
                <div>
                  <dt className="font-medium text-foreground">#CYCLE!</dt>
                  <dd className="pl-4">This error occurs when there's a circular reference in your formulas. For example, if cell A1 references B1, and B1 references A1, this creates an infinite loop.</dd>
                </div>
                
                <div>
                  <dt className="font-medium text-foreground">#VALUE!</dt>
                  <dd className="pl-4">This appears when you use the wrong type of value in a formula (like trying to perform math operations on text).</dd>
                </div>

                <div>
                  <dt className="font-medium text-foreground">#REF!</dt>
                  <dd className="pl-4">This means you're referencing cells that don't exist or have been deleted.</dd>
                </div>

                <div>
                  <dt className="font-medium text-foreground">#DIV/0!</dt>
                  <dd className="pl-4">This occurs when you try to divide by zero or an empty cell.</dd>
                </div>

                <div>
                  <dt className="font-medium text-foreground">#NAME?</dt>
                  <dd className="pl-4">This appears when using an unrecognized function name or incorrect cell reference format.</dd>
                </div>
              </dl>

              <h4 className="mt-4 font-medium text-foreground">General Questions</h4>
              <dl className="space-y-4">
                <div>
                  <dt className="font-medium text-foreground">Why isn't my AI formula working?</dt>
                  <dd className="pl-4">Make sure to start with exactly "=AI:" followed by your request. Wait a moment for the AI to process your request - you'll see "LOADING..." temporarily.</dd>
                </div>

                <div>
                  <dt className="font-medium text-foreground">How do I copy formulas across cells?</dt>
                  <dd className="pl-4">Click and drag the small square in the bottom-right corner of the selected cell to copy the formula to adjacent cells. Cell references will automatically adjust.</dd>
                </div>
              </dl>
            </div>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}
