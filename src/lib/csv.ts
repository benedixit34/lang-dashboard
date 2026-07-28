export interface CSVColumn<T extends object = object> {
  key: keyof T & string;
  label: string;
  required?: boolean;
  example?: string;
}

export interface ParsedRow<T extends object> {
  data: T;
  valid: boolean;
  missing: string[];
}

export interface ParseCSVResult<T extends object> {
  rows: ParsedRow<T>[];
  matchedHeaders: string[];
  unmatchedColumns: string[];
}

function splitLine(line: string): string[] {
  const result: string[] = [];
  let cur = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];

    if (inQuotes) {
      if (ch === '"') {
        if (line[i + 1] === '"') {
          cur += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        cur += ch;
      }
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === ",") {
      result.push(cur.trim());
      cur = "";
    } else {
      cur += ch;
    }
  }

  result.push(cur.trim());

  return result;
}


export function parseCSV<T extends object>(
  text: string,
  columns: CSVColumn<T>[]
): ParseCSVResult<T> {

  const lines = text
    .split(/\r?\n/)
    .filter((line) => line.trim().length > 0);


  if (lines.length === 0) {
    return {
      rows: [],
      matchedHeaders: [],
      unmatchedColumns: columns.map((c) => c.label),
    };
  }


  const headerCells = splitLine(lines[0]).map((h) =>
    h.toLowerCase()
  );


  const columnIndex: Partial<Record<string, number>> = {};


  columns.forEach((col) => {
    const idx = headerCells.findIndex(
      (h) =>
        h === col.key.toLowerCase() ||
        h === col.label.toLowerCase()
    );


    if (idx !== -1) {
      columnIndex[col.key] = idx;
    }
  });



  const matchedHeaders = columns
    .filter((c) => columnIndex[c.key] !== undefined)
    .map((c) => c.label);



  const unmatchedColumns = columns
    .filter((c) => columnIndex[c.key] === undefined)
    .map((c) => c.label);



  const rows: ParsedRow<T>[] = lines
    .slice(1)
    .map((line) => {

      const cells = splitLine(line);

      const data = {} as T;


      columns.forEach((col) => {

        const idx = columnIndex[col.key];

        data[col.key] =
          (idx !== undefined ? cells[idx] ?? "" : "") as T[typeof col.key];

      });



      const missing = columns
        .filter(
          (c) =>
            c.required &&
            !data[c.key]
        )
        .map((c) => c.label);



      return {
        data,
        valid: missing.length === 0,
        missing,
      };

    });



  return {
    rows,
    matchedHeaders,
    unmatchedColumns,
  };
}



export function buildTemplateCSV<T extends object>(
  columns: CSVColumn<T>[]
): string {

  const header = columns
    .map((c) => c.label)
    .join(",");


  const example = columns
    .map((c) => c.example ?? "")
    .join(",");


  return `${header}\n${example}`;
}



export function downloadCSV(
  filename: string,
  content: string
): void {

  const blob = new Blob(
    [content],
    {
      type: "text/csv;charset=utf-8;",
    }
  );


  const url = URL.createObjectURL(blob);


  const a = document.createElement("a");

  a.href = url;
  a.download = filename;


  document.body.appendChild(a);

  a.click();


  document.body.removeChild(a);


  URL.revokeObjectURL(url);
}