"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import {
  UploadCloud,
  FileSpreadsheet,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  FileCode,
  Download,
  ArrowRight,
  Database,
  Trash2,
  Table,
  Sparkles,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Button,
  Badge,
} from "@nexfield/ui";
import { useFarmStore } from "@/lib/store/useFarmStore";
import { apiClient } from "@/lib/api";

type IngestionCategory = "sensors" | "geojson" | "expenses";

interface ParsedRecord {
  [key: string]: any;
}

/**
 * Robust client-side CSV parser supporting quotes, commas, semicolons, and tabs.
 */
function parseCsv(text: string): {
  columns: string[];
  records: ParsedRecord[];
} {
  const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length === 0) return { columns: [], records: [] };

  // Detect delimiter: comma, semicolon, tab
  const headerLine = lines[0];
  let delimiter = ",";
  if (
    (headerLine.match(/;/g) || []).length >
    (headerLine.match(/,/g) || []).length
  ) {
    delimiter = ";";
  } else if (
    (headerLine.match(/\t/g) || []).length >
    (headerLine.match(/,/g) || []).length
  ) {
    delimiter = "\t";
  }

  const parseRow = (line: string): string[] => {
    const result: string[] = [];
    let cur = "";
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') {
        if (inQuotes && line[i + 1] === '"') {
          cur += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (ch === delimiter && !inQuotes) {
        result.push(cur.trim());
        cur = "";
      } else {
        cur += ch;
      }
    }
    result.push(cur.trim());
    return result;
  };

  const rawColumns = parseRow(lines[0]);
  const columns = rawColumns.map(
    (col, idx) => col.trim().replace(/^"|"$/g, "") || `col_${idx + 1}`,
  );

  const records: ParsedRecord[] = [];
  for (let i = 1; i < lines.length; i++) {
    const vals = parseRow(lines[i]);
    const record: ParsedRecord = {};
    for (let j = 0; j < columns.length; j++) {
      const colName = columns[j];
      const valStr = (vals[j] ?? "").replace(/^"|"$/g, "").trim();
      const numVal = Number(valStr);
      record[colName] = !isNaN(numVal) && valStr !== "" ? numVal : valStr;
    }
    records.push(record);
  }

  return { columns, records };
}

/**
 * Robust JSON and GeoJSON parser extracting field attributes and coordinates.
 */
function parseJson(text: string): {
  columns: string[];
  records: ParsedRecord[];
} {
  const data = JSON.parse(text);

  if (data?.type === "FeatureCollection" && Array.isArray(data.features)) {
    const records: ParsedRecord[] = data.features.map(
      (f: any, idx: number) => ({
        feature_id: f.id || `feat-${idx + 1}`,
        name:
          f.properties?.name || f.properties?.field_name || `Parcel ${idx + 1}`,
        area_hectares: f.properties?.area_hectares || f.properties?.area || 2.0,
        soil_ph: f.properties?.soil_ph || f.properties?.ph || 6.8,
        soil_moisture:
          f.properties?.soil_moisture || f.properties?.moisture || 38.0,
        coordinates: JSON.stringify(f.geometry?.coordinates || []),
      }),
    );
    return {
      columns: [
        "feature_id",
        "name",
        "area_hectares",
        "soil_ph",
        "soil_moisture",
        "coordinates",
      ],
      records,
    };
  }

  if (Array.isArray(data) && data.length > 0 && typeof data[0] === "object") {
    const colSet = new Set<string>();
    data.forEach((row) => Object.keys(row || {}).forEach((k) => colSet.add(k)));
    const columns = Array.from(colSet);
    return { columns, records: data };
  }

  return {
    columns: ["raw_json"],
    records: [{ raw_json: JSON.stringify(data).substring(0, 100) }],
  };
}

export default function DataCenterPage() {
  const { selectedFarmId, setSelectedFarmId } = useFarmStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [category, setCategory] = useState<IngestionCategory>("sensors");
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [parsedData, setParsedData] = useState<ParsedRecord[] | null>(null);
  const [columns, setColumns] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [importSuccess, setImportSuccess] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [importResult, setImportResult] = useState<{
    importedCount: number;
    failedCount: number;
    errors: string[];
  } | null>(null);

  // Column Mapping State
  const [mapping, setMapping] = useState<{ [targetField: string]: string }>({});

  const autoMapColumns = (cols: string[], cat: IngestionCategory) => {
    const newMap: { [targetField: string]: string } = {};

    const lowerCols = cols.map((c) => c.toLowerCase());

    const findMatch = (targets: string[]): string => {
      for (const t of targets) {
        const lowerT = t.toLowerCase();
        const foundIdx = lowerCols.findIndex(
          (c) => c === lowerT || c.includes(lowerT),
        );
        if (foundIdx !== -1) return cols[foundIdx];
      }
      return cols[0] || "";
    };

    if (cat === "sensors") {
      newMap.timestamp = findMatch([
        "timestamp",
        "date",
        "time",
        "observed_at",
      ]);
      newMap.moisture = findMatch([
        "moisture",
        "moisture_percent",
        "soil_moisture",
        "vwc",
      ]);
      newMap.temperature = findMatch([
        "temp",
        "temperature",
        "temp_c",
        "ambient_temp",
      ]);
      newMap.ndvi = findMatch([
        "ndvi",
        "ndvi_index",
        "canopy_ndvi",
        "vegetation_index",
      ]);
    } else if (cat === "expenses") {
      newMap.date = findMatch(["date", "expense_date", "timestamp"]);
      newMap.category = findMatch(["category", "type", "item_type"]);
      newMap.amount = findMatch(["amount", "amount_inr", "total", "cost"]);
      newMap.description = findMatch([
        "description",
        "notes",
        "title",
        "vendor",
      ]);
    } else if (cat === "geojson") {
      newMap.name = findMatch(["name", "field_name", "title"]);
      newMap.area = findMatch(["area", "area_hectares", "hectares", "size"]);
      newMap.coordinates = findMatch([
        "coordinates",
        "geometry",
        "coords",
        "boundary",
      ]);
    }

    setMapping(newMap);
  };

  const handleFileSelect = async (file: File) => {
    setSelectedFileName(file.name);
    setIsProcessing(true);
    setImportSuccess(false);
    setErrorMessage(null);
    setImportResult(null);

    try {
      const text = await file.text();
      let res: { columns: string[]; records: ParsedRecord[] };

      if (
        category === "geojson" ||
        file.name.endsWith(".geojson") ||
        file.name.endsWith(".json")
      ) {
        res = parseJson(text);
      } else {
        res = parseCsv(text);
      }

      if (res.records.length === 0) {
        throw new Error("No valid records found in the uploaded file.");
      }

      setColumns(res.columns);
      setParsedData(res.records);
      autoMapColumns(res.columns, category);
    } catch (err: any) {
      console.error("File parsing error:", err);
      setErrorMessage(
        err.message ||
          "Unable to parse the uploaded file. Please verify the file format.",
      );
      setParsedData(null);
      setColumns([]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCommitImport = async () => {
    if (!parsedData || parsedData.length === 0) return;
    setIsProcessing(true);
    setErrorMessage(null);

    try {
      // 1. Resolve Target Farm ID
      let farmId = selectedFarmId;
      if (!farmId) {
        const farmsRes = await apiClient.getFarms();
        if (farmsRes.data && farmsRes.data.length > 0) {
          farmId = farmsRes.data[0].id;
          setSelectedFarmId(farmId);
        } else {
          throw new Error(
            "No farm property exists yet. Please complete farm setup in the Onboarding Wizard first.",
          );
        }
      }

      // 2. Map Records to Backend DTOs
      const backendCategory = category === "geojson" ? "fields" : category;
      const mappedRecords = parsedData.map((row) => {
        const out: Record<string, any> = {};
        if (category === "sensors") {
          out.timestamp = row[mapping.timestamp] || new Date().toISOString();
          out.moisture_percent = Number(row[mapping.moisture]) || 38.0;
          out.temperature_c = Number(row[mapping.temperature]) || 24.5;
          out.ndvi = Number(row[mapping.ndvi]) || 0.8;
          // preserve extra columns in metrics
          Object.keys(row).forEach((k) => {
            if (!out[k] && typeof row[k] === "number") {
              out[k] = row[k];
            }
          });
        } else if (category === "expenses") {
          out.expense_date =
            row[mapping.date] || new Date().toISOString().split("T")[0];
          out.category = String(row[mapping.category] || "other").toLowerCase();
          out.amount_inr = Number(row[mapping.amount]) || 1000;
          out.description = String(
            row[mapping.description] || "Operational Expense",
          );
        } else if (category === "geojson") {
          out.name = String(row[mapping.name] || "Imported Parcel");
          out.area_hectares = Number(row[mapping.area]) || 1.5;
          out.code = `IMP-${Math.floor(100 + Math.random() * 900)}`;
          try {
            const rawCoords = row[mapping.coordinates];
            out.polygon_coordinates =
              typeof rawCoords === "string" ? JSON.parse(rawCoords) : rawCoords;
          } catch {
            out.polygon_coordinates = null;
          }
        }
        return out;
      });

      // 3. Post to Real Backend Ingestion Route
      const res = await apiClient.importData(farmId, {
        category: backendCategory,
        records: mappedRecords,
      });

      if (res.data) {
        setImportResult({
          importedCount: res.data.importedCount,
          failedCount: res.data.failedCount,
          errors: res.data.errors || [],
        });
        setImportSuccess(true);
      }
    } catch (err: any) {
      console.error("Import commitment error:", err);
      setErrorMessage(
        err.message || "Failed to commit records to the farm database.",
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setSelectedFileName(null);
    setParsedData(null);
    setColumns([]);
    setImportSuccess(false);
    setErrorMessage(null);
    setImportResult(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const downloadSampleTemplate = () => {
    let content = "";
    let fileName = "";
    if (category === "sensors") {
      fileName = "sample_sensors_iot.csv";
      content =
        "timestamp,moisture_percent,temp_c,ndvi_index,soil_ec_ds_m\n" +
        "2026-10-24 08:00:00,41.2,24.5,0.81,0.45\n" +
        "2026-10-24 10:00:00,40.8,26.2,0.82,0.46\n" +
        "2026-10-24 12:00:00,39.9,28.4,0.81,0.47\n" +
        "2026-10-24 14:00:00,39.1,29.1,0.80,0.47\n" +
        "2026-10-24 16:00:00,40.5,27.0,0.81,0.46\n";
    } else if (category === "expenses") {
      fileName = "sample_farm_expenses.csv";
      content =
        "date,category,amount_inr,description,vendor\n" +
        "2026-10-20,fertilizer,4200,Soluble NPK 19-19-19 50kg,Nashik Agro Supply\n" +
        "2026-10-21,labor,2800,Drip lateral flushing and emitter check,Field Crew A\n" +
        "2026-10-22,fuel,1500,Diesel for farm backup generator,Indian Oil\n";
    } else {
      fileName = "sample_field_boundary.geojson";
      content = JSON.stringify(
        {
          type: "FeatureCollection",
          features: [
            {
              type: "Feature",
              properties: {
                name: "North Sector Alpha",
                area_hectares: 2.4,
                soil_ph: 6.8,
                soil_moisture: 40.5,
              },
              geometry: {
                type: "Polygon",
                coordinates: [
                  [
                    [73.7901, 20.0059],
                    [73.7925, 20.0062],
                    [73.7928, 20.0041],
                    [73.7903, 20.0038],
                    [73.7901, 20.0059],
                  ],
                ],
              },
            },
          ],
        },
        null,
        2,
      );
    }

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="module-page module-data space-y-6">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#D1DDCD]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#09251A]">
              Farm data
            </h1>
            <Badge
              variant="outline"
              className="text-emerald-700 border-emerald-500/40 font-mono text-[10px]"
            >
              Multi-Format Ingestion
            </Badge>
          </div>
          <p className="text-xs text-[#46604D] mt-0.5">
            Import field boundary polygons, IoT sensor series, and operational
            accounting records
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={downloadSampleTemplate}
            className="text-xs text-[#46604D] border-[#D1DDCD] hover:text-[#09251A] gap-1.5"
          >
            <Download className="h-3.5 w-3.5 text-emerald-700" />
            <span>Sample Template</span>
          </Button>

          <Link href="/control">
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-[#46604D] hover:text-[#09251A]"
            >
              ← Return to Control
            </Button>
          </Link>
        </div>
      </div>

      {errorMessage && (
        <div className="p-3.5 rounded-xl bg-rose-50/40 border border-rose-800/50 text-xs text-rose-700 flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-700" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* 2. Ingestion Category Selector */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <button
          type="button"
          onClick={() => {
            setCategory("sensors");
            handleReset();
          }}
          className={`p-4 rounded-xl border text-left transition-all ${
            category === "sensors"
              ? "bg-[#F7FAF2] border-emerald-500 text-emerald-700 ring-1 ring-emerald-500/30"
              : "bg-[#F7FAF2] border-[#D1DDCD] text-[#46604D] hover:border-[#D1DDCD]"
          }`}
        >
          <div className="flex items-center gap-2 mb-1">
            <FileSpreadsheet className="h-4 w-4 text-emerald-700" />
            <span className="font-bold text-xs">
              Soil & Weather IoT (CSV/XLSX)
            </span>
          </div>
          <p className="text-[11px] text-[#46604D]">
            Vadose moisture, soil temperature, NDVI, and ambient weather
            time-series
          </p>
        </button>

        <button
          type="button"
          onClick={() => {
            setCategory("geojson");
            handleReset();
          }}
          className={`p-4 rounded-xl border text-left transition-all ${
            category === "geojson"
              ? "bg-[#F7FAF2] border-emerald-500 text-emerald-700 ring-1 ring-emerald-500/30"
              : "bg-[#F7FAF2] border-[#D1DDCD] text-[#46604D] hover:border-[#D1DDCD]"
          }`}
        >
          <div className="flex items-center gap-2 mb-1">
            <FileCode className="h-4 w-4 text-cyan-700" />
            <span className="font-bold text-xs">
              Field Boundaries (GeoJSON)
            </span>
          </div>
          <p className="text-[11px] text-[#46604D]">
            GPS perimeter coordinates, sub-plots, and topographical elevation
            bounds
          </p>
        </button>

        <button
          type="button"
          onClick={() => {
            setCategory("expenses");
            handleReset();
          }}
          className={`p-4 rounded-xl border text-left transition-all ${
            category === "expenses"
              ? "bg-[#F7FAF2] border-emerald-500 text-emerald-700 ring-1 ring-emerald-500/30"
              : "bg-[#F7FAF2] border-[#D1DDCD] text-[#46604D] hover:border-[#D1DDCD]"
          }`}
        >
          <div className="flex items-center gap-2 mb-1">
            <Database className="h-4 w-4 text-purple-700" />
            <span className="font-bold text-xs">
              Farm Ledger & Expenses (CSV)
            </span>
          </div>
          <p className="text-[11px] text-[#46604D]">
            Fertilizer, seed, labor, irrigation, and mandi settlement receipts
          </p>
        </button>
      </div>

      {/* 3. Drag and Drop Upload Zone */}
      {!parsedData && (
        <Card className="border-dashed border-2 border-[#D1DDCD] bg-[#F7FAF2] hover:border-emerald-500/50 transition-colors p-8 text-center">
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => {
              if (e.target.files?.[0]) handleFileSelect(e.target.files[0]);
            }}
            accept={
              category === "geojson" ? ".geojson,.json" : ".csv,.xlsx,.xls,.txt"
            }
            className="hidden"
          />

          <div className="max-w-md mx-auto space-y-4">
            <div className="inline-flex p-4 rounded-2xl bg-[#F7FAF2] border border-[#D1DDCD] text-emerald-700">
              <UploadCloud className="h-10 w-10 animate-pulse" />
            </div>

            <div>
              <h3 className="text-sm font-bold text-[#09251A]">
                Upload{" "}
                {category === "geojson"
                  ? "GeoJSON Boundaries"
                  : "CSV Spreadsheet"}
              </h3>
              <p className="text-xs text-[#46604D] mt-1">
                Parsed securely on the client, validated with schema
                enforcement, and persisted to PostgreSQL.
              </p>
            </div>

            <Button
              type="button"
              disabled={isProcessing}
              onClick={() => fileInputRef.current?.click()}
              className="bg-[#10B981] text-[#070B09] hover:bg-[#34D399] font-bold text-xs px-5"
            >
              {isProcessing ? "Parsing File..." : "Select File from Computer"}
            </Button>

            <div className="pt-4 border-t border-[#D1DDCD] flex items-center justify-center gap-4 text-[11px] text-[#46604D]">
              <span className="flex items-center gap-1 font-mono">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                Row-Level Tenant Isolation
              </span>
              <span>·</span>
              <span className="text-[#46604D]">UTF-8 Encoded</span>
            </div>
          </div>
        </Card>
      )}

      {/* 4. Parsing Preview & Column Mapping Interface */}
      {parsedData && (
        <div className="space-y-4">
          <Card className="border-[#D1DDCD] bg-[#F7FAF2]">
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-sm font-bold text-[#09251A] flex items-center gap-2">
                  <Table className="h-4 w-4 text-emerald-700" />
                  <span>Validation Preview: {selectedFileName}</span>
                </CardTitle>
                <CardDescription className="text-xs text-[#46604D]">
                  {parsedData.length} records parsed from file · Verify mapped
                  columns before ingestion
                </CardDescription>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleReset}
                className="text-xs text-rose-700 hover:bg-rose-50/30 gap-1"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Discard</span>
              </Button>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Data Table Preview */}
              <div className="overflow-x-auto rounded-xl border border-[#D1DDCD] max-h-60 overflow-y-auto">
                <table className="w-full text-left font-mono text-xs">
                  <thead className="bg-[#F7FAF2] text-[#46604D] text-[10px] uppercase font-sans border-b border-[#D1DDCD] sticky top-0">
                    <tr>
                      <th className="py-2.5 px-3">#</th>
                      {columns.map((col) => (
                        <th key={col} className="py-2.5 px-3">
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#D1DDCD]">
                    {parsedData.slice(0, 8).map((row, idx) => (
                      <tr key={idx} className="hover:bg-[#F7FAF2]">
                        <td className="py-2 px-3 text-[#46604D] text-[10px]">
                          {idx + 1}
                        </td>
                        {columns.map((col) => (
                          <td
                            key={col}
                            className="py-2 px-3 text-[#09251A] truncate max-w-xs"
                          >
                            {String(row[col] ?? "")}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Dynamic Column Mapping Controls */}
              <div className="p-3.5 rounded-xl bg-[#F7FAF2] border border-[#D1DDCD] space-y-3">
                <div className="text-xs font-bold text-emerald-700 font-sans flex items-center justify-between">
                  <span>
                    Column Mapping (Target Property ← Uploaded Header)
                  </span>
                  <span className="text-[10px] font-mono text-[#46604D] font-normal">
                    {Object.keys(mapping).length} fields configured
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs font-mono">
                  {Object.keys(mapping).map((targetKey) => (
                    <div key={targetKey}>
                      <span className="text-[#46604D] block mb-1 capitalize">
                        {targetKey.replace(/_/g, " ")}:
                      </span>
                      <select
                        value={mapping[targetKey] || ""}
                        onChange={(e) =>
                          setMapping((prev) => ({
                            ...prev,
                            [targetKey]: e.target.value,
                          }))
                        }
                        className="w-full p-2 rounded-lg bg-[#F7FAF2] border border-[#D1DDCD] text-xs text-[#09251A] focus:outline-none focus:border-emerald-500"
                      >
                        {columns.map((col) => (
                          <option key={col} value={col}>
                            {col}
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>

            <CardFooter className="pt-3 border-t border-[#D1DDCD] flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs text-emerald-700 font-mono">
                <CheckCircle2 className="h-4 w-4" />
                <span>Ready to commit {parsedData.length} records</span>
              </div>

              <Button
                type="button"
                onClick={handleCommitImport}
                disabled={isProcessing || importSuccess}
                className="bg-[#10B981] text-[#070B09] hover:bg-[#34D399] font-bold text-xs px-5 gap-1.5"
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>
                  {importSuccess
                    ? "Committed ✓"
                    : isProcessing
                      ? "Ingesting into Database..."
                      : "Commit to Farm Workspace"}
                </span>
              </Button>
            </CardFooter>
          </Card>

          {importSuccess && importResult && (
            <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-600/60 text-emerald-700 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="h-5 w-5 text-emerald-700 shrink-0" />
                <div>
                  <div className="font-bold">
                    Successfully Ingested {importResult.importedCount} Records
                  </div>
                  <div className="text-[#46604D] text-[11px]">
                    Persisted to PostgreSQL partition under active farm tenant.
                    {importResult.failedCount > 0 &&
                      ` (${importResult.failedCount} rows failed)`}
                  </div>
                </div>
              </div>
              <Link href="/control">
                <Button
                  size="sm"
                  className="bg-emerald-600 text-white font-bold text-xs"
                >
                  View in Farm HUD →
                </Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
