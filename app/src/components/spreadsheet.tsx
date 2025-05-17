import { Button } from '@/ui/button';
import { api } from "@cvx/_generated/api";
import { HotTable, HotTableRef } from '@handsontable/react-wrapper';
import { useAction } from "convex/react";
import type { CellChange } from 'handsontable/common';
import { registerAllModules } from 'handsontable/registry';
import { registerRenderer, textRenderer } from 'handsontable/renderers';
import 'handsontable/styles/handsontable.css';
import 'handsontable/styles/ht-theme-main.css';
import { HyperFormula } from 'hyperformula';
import { Download, RefreshCcw } from 'lucide-react';
import { useRef } from 'react';
import { toast } from "sonner";

// register Handsontable's modules
registerAllModules();

export function Spreadsheet() {
  const hotRef = useRef<HotTableRef>(null);
  const evaluateAI = useAction(api.openai.evaluateAIFormula);

  function exportHandler() {
    const hot = hotRef.current?.hotInstance;
    const exportPlugin = hot?.getPlugin('exportFile');

    exportPlugin?.downloadFile('csv', {
      bom: false,
      columnDelimiter: ',',
      columnHeaders: false,
      exportHiddenColumns: true,
      exportHiddenRows: true,
      fileExtension: 'csv',
      filename: 'spreadsheet_[YYYY]-[MM]-[DD]',
      mimeType: 'text/csv',
      rowHeaders: true,
    });
  };

  // Handle AI formula evaluation
  const handleAIFormula = async (value: string, row: number, col: number) => {
    if (!value.startsWith('=AI:')) return value;

    const hot = hotRef.current?.hotInstance;
    if (!hot) return value;

    try {
      // Get the current sheet data
      const sheetData = hot.getData() as string[][];

      console.log(sheetData);
      
      // Evaluate the AI formula
      const result = await evaluateAI({
        formula: value,
        sheetData,
        row,
        col
      });

      
      console.log(result);
      
      toast.success(result.formula);
      return result.formula;
    } catch (error) {
      console.error('Failed to evaluate AI formula:', error);
      return value;
    }
  };
 
  const data1 = [
    // Basic calculations with numbers
    [25, null, 'SUM', '=SUM(A1:A10)', null, 'Hello World', '=CONCATENATE(F1," length: ",LEN(F1))', '=LEN(F1)', null, null, null, null],
    [3, null, 'AVERAGE', '=AVERAGE(A1:A10)', null, '', '=CONCATENATE(F2," length: ",LEN(F2))', '=LEN(F2)'],
    [15, null, 'MAX', '=MAX(A1:A10)', null, '^ add something here!', '', ''],
    [30, null, 'MIN', '=MIN(A1:A10)', null, '', '', ''],
    [20, null, 'COUNT', '=COUNT(A1:A10)', null, 'Year', '=YEAR(TODAY())',],
    
    // Empty row for separation
    [null, "← Add a new value and ", "watch these update", "↑", null, 'Month', '=MONTH(TODAY())', null, null],
    [null, "", null, null, null, null, null, null, null],
    
    // empty rows for padding
    ["", "Use AI! ↓"],
    ["", "", "Use the =AI function with a prompt "],
    ["", "", "it generates a formula for you "],
    ["", "", "copy an example below and paste it in ↓"],
    ["", "", ""],
    [],
    [],
    [],
  ];

  // const data2 = [
  //   ['Is A1 in Sheet1 > 10?', '=IF(Sheet1!A1>10,"TRUE","FALSE")','','','','',''],
  //   ['Is A:A in Sheet > 150?', '=IF(SUM(Sheet1!A:A)>150,"TRUE","FALSE")'],
  //   ['How many blank cells are in the Sheet1?', '=COUNTBLANK(Sheet1!A1:D5)'],
  //   ['Generate a random number', '=RAND()'],
  //   ['Number of sheets in this workbook', '=SHEETS()'],
  // ];

  const hyperformulaInstance = HyperFormula.buildEmpty({
    licenseKey: 'internal-use-in-handsontable',
  });

  registerRenderer('customStylesRenderer', (hotInstance, TD, ...rest) => {
    textRenderer(hotInstance, TD, ...rest);

    TD.style.fontWeight = 'bold';
    TD.style.color = 'green';
    TD.style.background = '#d7f1e1';
  });

  return (
    <div className="ht-theme-main flex flex-col gap-2">
      <div>
        <div className="text-sm text-gray-500">Double click to view and edit formulas. Type =AI: followed by your request to use AI formulas.</div>
      </div>
      <HotTable
        ref={hotRef}
        data={data1}
        contextMenu={true}
        dropdownMenu={true}
        filters={true}
        autoWrapRow={false}
        autoWrapCol={false}
        colHeaders={true}
        rowHeaders={true}
        manualRowResize={true}
        manualColumnResize={true}
        height="auto"
        formulas={{
          engine: hyperformulaInstance,
          sheetName: 'Sheet1',
        }}
        beforeChange={(changes, _source) => {
          if (!changes) return true;
          
          // Process each change synchronously to maintain compatibility
          for (let i = 0; i < changes.length; i++) {
            const change = changes[i];
            if (!change) continue;
            
            const [row, col, , newValue] = change;
            if (typeof newValue === 'string' && newValue.startsWith('=AI:')) {
              // Replace the AI formula immediately with a loading placeholder
              changes[i] = [row as number, col as number, null, 'LOADING...'] as CellChange;
              
              // Process the AI formula asynchronously
              handleAIFormula(newValue, row as number, col as number).then(formula => {
                const hot = hotRef.current?.hotInstance;
                if (hot) {
                  hot.setDataAtCell(row as number, col as number, formula);
                }
              });
            }
          }
          
          return true;
        }}
        licenseKey="non-commercial-and-evaluation"
      />
      <div className="flex flex-row gap-2">
        <Button variant="outline" size="sm" onClick={exportHandler}>
          <Download className="mr-2 h-4 w-4" />
          Download as CSV
        </Button>
        <Button variant="outline" size="sm" onClick={()=>{
          window.location.reload();
        }}>
          <RefreshCcw className="mr-2 h-4 w-4" />
          Reset Demo
        </Button>
      </div>
    </div>
  );
}