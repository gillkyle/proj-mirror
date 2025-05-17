import { Button } from '@/ui/button';
import { HotTable, HotTableRef } from '@handsontable/react-wrapper';
import { registerAllModules } from 'handsontable/registry';
import { registerRenderer, textRenderer } from 'handsontable/renderers';
import 'handsontable/styles/handsontable.css';
import 'handsontable/styles/ht-theme-main.css';
import { HyperFormula } from 'hyperformula';
import { Download } from 'lucide-react';
import { useRef } from 'react';

// register Handsontable's modules
registerAllModules();

export function Spreadsheet() {
  const hotRef = useRef<HotTableRef>(null);

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
      rowDelimiter: '\r\n',
      rowHeaders: true,
    });
  };
 
  const data1 = [
    // Basic calculations with numbers
    [25, null, 'Sum Example', '=SUM(A1:A5)', null, 'Hello World', '=CONCATENATE(F1," length: ",LEN(F1))', '=LEN(F1)', null, null, null, null],
    [10, null, 'Average', '=AVERAGE(A1:A5)', null, 'Testing123', '=CONCATENATE(F2," length: ",LEN(F2))', '=LEN(F2)'],
    [15, null, 'Maximum', '=MAX(A1:A5)', null, 'OpenAI', '=CONCATENATE(F3," length: ",LEN(F3))', '=LEN(F3)'],
    [30, null, 'Minimum', '=MIN(A1:A5)', null, 'Spreadsheet', '=CONCATENATE(F4," length: ",LEN(F4))', '=LEN(F4)'],
    [20, null, 'Count', '=COUNT(A1:A5)', null, 'Example', '=CONCATENATE(F5," length: ",LEN(F5))', '=LEN(F5)'],
    
    // Empty row for separation
    [null, null, null, null, null, null, null, null, null],
    
    // Date manipulations
    [null, null, 'Today', '=TODAY()', null, '2024-01-15', '=DATEADD(F7,7,"days")', '=NETWORKDAYS(F7,G7)'],
    [null, null, 'End of Month', '=EOMONTH(TODAY(),0)', null, '2024-02-01', '=DATEADD(F8,-1,"months")', '=DATEDIF(F8,G8,"d")'],
    [null, null, 'Year', '=YEAR(TODAY())', null, '2024-03-20', '=DATEADD(F9,1,"years")', '=WEEKDAY(F9)'],
    [null, null, 'Month', '=MONTH(TODAY())', null, '2024-12-31', '=DATEADD(F10,-3,"months")', '=DAYS360(F10,G10)'],

    // empty rows for padding
    [],
    [],
    [],
    [],
    [],
    [],
  ];

  const data2 = [
    ['Is A1 in Sheet1 > 10?', '=IF(Sheet1!A1>10,"TRUE","FALSE")','','','','',''],
    ['Is A:A in Sheet > 150?', '=IF(SUM(Sheet1!A:A)>150,"TRUE","FALSE")'],
    ['How many blank cells are in the Sheet1?', '=COUNTBLANK(Sheet1!A1:D5)'],
    ['Generate a random number', '=RAND()'],
    ['Number of sheets in this workbook', '=SHEETS()'],
  ];

  const hyperformulaInstance = HyperFormula.buildEmpty({
    licenseKey: 'internal-use-in-handsontable',
  });

  registerRenderer('customStylesRenderer', (hotInstance, TD, ...rest) => {
    textRenderer(hotInstance, TD, ...rest);

    TD.style.fontWeight = 'bold';
    TD.style.color = 'green';
    TD.style.background = '#d7f1e1';
  });
  console.log(hotRef.current?.hotInstance);

  // check the hotinstance selection and get the cell value, if we have multiple values, set activceCell to undefined, otherwise show the formula down below
  const activeCell = hotRef.current?.hotInstance?.getSelected();
  console.log(activeCell);

  return (
    <div className="ht-theme-main flex flex-col gap-2">
      <div className="flex flex-row gap-2">
        <Button variant="outline" size="sm" onClick={exportHandler}>
          <Download className="mr-2 h-4 w-4" />
          Download as CSV
        </Button>
      </div>
      <div>
        <div className="text-sm text-gray-500">Double click to view and edit formulas</div>
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
        licenseKey="non-commercial-and-evaluation"
        // some custom cell rendering...
        // cell={[
        //   {
        //     row: 0,
        //     col: 0,
        //     renderer: 'customStylesRenderer',
        //   },
        // ]}
      />
    </div>
  );
};