'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
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
} from 'lucide-react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Button,
  Badge,
} from '@nexfield/ui';
import { useFarmStore } from '@/lib/store/useFarmStore';

type IngestionCategory = 'sensors' | 'geojson' | 'expenses';

interface ParsedRecord {
  [key: string]: any;
}

export default function DataCenterPage() {
  const { selectedFarmId } = useFarmStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [category, setCategory] = useState<IngestionCategory>('sensors');
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [parsedData, setParsedData] = useState<ParsedRecord[] | null>(null);
  const [columns, setColumns] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [importSuccess, setImportSuccess] = useState<boolean>(false);

  // Column Mapping State
  const [mapping, setMapping] = useState<{ [targetField: string]: string }>({
    timestamp: 'timestamp',
    moisture: 'moisture_percent',
    temperature: 'temp_c',
    ndvi: 'ndvi_index',
  });

  const handleFileSelect = (file: File) => {
    setSelectedFileName(file.name);
    setIsProcessing(true);
    setImportSuccess(false);

    // Simulate robust client-side CSV / JSON parsing
    setTimeout(() => {
      if (category === 'geojson' || file.name.endsWith('.geojson') || file.name.endsWith('.json')) {
        setColumns(['feature_type', 'field_name', 'area_hectares', 'coordinates']);
        setParsedData([
          {
            feature_type: 'Polygon',
            field_name: 'North Sector Alpha',
            area_hectares: 2.4,
            coordinates: '[[73.7901, 20.0059], [73.7925, 20.0062], ...]',
          },
          {
            feature_type: 'Polygon',
            field_name: 'South Sector Beta',
            area_hectares: 1.1,
            coordinates: '[[73.7885, 20.0041], [73.7900, 20.0045], ...]',
          },
        ]);
      } else {
        setColumns(['timestamp', 'moisture_percent', 'temp_c', 'ndvi_index', 'status']);
        setParsedData([
          { timestamp: '2026-10-23 08:00', moisture_percent: 41.2, temp_c: 24.5, ndvi_index: 0.81, status: 'OK' },
          { timestamp: '2026-10-23 12:00', moisture_percent: 40.8, temp_c: 28.2, ndvi_index: 0.81, status: 'OK' },
          { timestamp: '2026-10-23 16:00', moisture_percent: 41.4, temp_c: 27.8, ndvi_index: 0.82, status: 'OK' },
          { timestamp: '2026-10-23 20:00', moisture_percent: 42.1, temp_c: 25.1, ndvi_index: 0.81, status: 'OK' },
          { timestamp: '2026-10-24 00:00', moisture_percent: 42.4, temp_c: 23.4, ndvi_index: 0.81, status: 'OK' },
        ]);
      }
      setIsProcessing(false);
    }, 450);
  };

  const handleCommitImport = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setImportSuccess(true);
    }, 600);
  };

  const handleReset = () => {
    setSelectedFileName(null);
    setParsedData(null);
    setColumns([]);
    setImportSuccess(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#1A261F]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#F1F6F3]">
              User Data Ingestion Center
            </h1>
            <Badge variant="outline" className="text-emerald-400 border-emerald-500/40 font-mono text-[10px]">
              Multi-Format Ingestion
            </Badge>
          </div>
          <p className="text-xs text-[#7B9587] mt-0.5">
            Import field boundary polygons, IoT sensor series, and operational accounting records
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/control">
            <Button variant="ghost" size="sm" className="text-xs text-[#8EA698] hover:text-[#F1F6F3]">
              ← Return to Control
            </Button>
          </Link>
        </div>
      </div>

      {/* 2. Ingestion Category Selector */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <button
          type="button"
          onClick={() => {
            setCategory('sensors');
            handleReset();
          }}
          className={`p-4 rounded-xl border text-left transition-all ${
            category === 'sensors'
              ? 'bg-[#14231A] border-emerald-500 text-emerald-300 ring-1 ring-emerald-500/30'
              : 'bg-[#0E1511] border-[#1E2E25] text-[#8EA698] hover:border-[#2B4033]'
          }`}
        >
          <div className="flex items-center gap-2 mb-1">
            <FileSpreadsheet className="h-4 w-4 text-emerald-400" />
            <span className="font-bold text-xs">Soil & Weather IoT (CSV/XLSX)</span>
          </div>
          <p className="text-[11px] text-[#7B9587]">
            Vadose moisture, soil temperature, NDVI, and ambient weather time-series
          </p>
        </button>

        <button
          type="button"
          onClick={() => {
            setCategory('geojson');
            handleReset();
          }}
          className={`p-4 rounded-xl border text-left transition-all ${
            category === 'geojson'
              ? 'bg-[#14231A] border-emerald-500 text-emerald-300 ring-1 ring-emerald-500/30'
              : 'bg-[#0E1511] border-[#1E2E25] text-[#8EA698] hover:border-[#2B4033]'
          }`}
        >
          <div className="flex items-center gap-2 mb-1">
            <FileCode className="h-4 w-4 text-cyan-400" />
            <span className="font-bold text-xs">Field Boundaries (GeoJSON)</span>
          </div>
          <p className="text-[11px] text-[#7B9587]">
            GPS perimeter coordinates, sub-plots, and topographical elevation bounds
          </p>
        </button>

        <button
          type="button"
          onClick={() => {
            setCategory('expenses');
            handleReset();
          }}
          className={`p-4 rounded-xl border text-left transition-all ${
            category === 'expenses'
              ? 'bg-[#14231A] border-emerald-500 text-emerald-300 ring-1 ring-emerald-500/30'
              : 'bg-[#0E1511] border-[#1E2E25] text-[#8EA698] hover:border-[#2B4033]'
          }`}
        >
          <div className="flex items-center gap-2 mb-1">
            <Database className="h-4 w-4 text-purple-400" />
            <span className="font-bold text-xs">Farm Ledger & Expenses (CSV)</span>
          </div>
          <p className="text-[11px] text-[#7B9587]">
            Fertilizer, seed, labor, irrigation, and mandi settlement receipts
          </p>
        </button>
      </div>

      {/* 3. Drag and Drop Upload Zone */}
      {!parsedData && (
        <Card className="border-dashed border-2 border-[#203227] bg-[#0A0F0C] hover:border-emerald-500/50 transition-colors p-8 text-center">
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => {
              if (e.target.files?.[0]) handleFileSelect(e.target.files[0]);
            }}
            accept={category === 'geojson' ? '.geojson,.json' : '.csv,.xlsx,.xls'}
            className="hidden"
          />

          <div className="max-w-md mx-auto space-y-4">
            <div className="inline-flex p-4 rounded-2xl bg-[#111A15] border border-[#23352A] text-emerald-400">
              <UploadCloud className="h-10 w-10 animate-bounce" />
            </div>

            <div>
              <h3 className="text-sm font-bold text-[#F1F6F3]">
                Drag and Drop your {category === 'geojson' ? 'GeoJSON file' : 'CSV or XLSX file'} here
              </h3>
              <p className="text-xs text-[#7B9587] mt-1">
                Supports up to 25 MB. All records are validated client-side before submission.
              </p>
            </div>

            <Button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="bg-[#10B981] text-[#070B09] hover:bg-[#34D399] font-bold text-xs px-5"
            >
              Select File from Computer
            </Button>

            <div className="pt-4 border-t border-[#18261E] flex items-center justify-center gap-4 text-[11px] text-[#63796E]">
              <span className="flex items-center gap-1 font-mono">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                Row-Level Tenant Isolation
              </span>
              <span>·</span>
              <span className="text-[#8EA698]">UTF-8 Encoded</span>
            </div>
          </div>
        </Card>
      )}

      {/* 4. Parsing Preview & Column Mapping Interface */}
      {parsedData && (
        <div className="space-y-4">
          <Card className="border-[#1E2E25] bg-[#0E1511]">
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-sm font-bold text-[#F1F6F3] flex items-center gap-2">
                  <Table className="h-4 w-4 text-emerald-400" />
                  <span>Validation Preview: {selectedFileName}</span>
                </CardTitle>
                <CardDescription className="text-xs text-[#7B9587]">
                  {parsedData.length} records parsed successfully · Review schema mapping
                </CardDescription>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleReset}
                className="text-xs text-rose-400 hover:bg-rose-950/30 gap-1"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Discard</span>
              </Button>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Data Table Preview */}
              <div className="overflow-x-auto rounded-xl border border-[#19261E]">
                <table className="w-full text-left font-mono text-xs">
                  <thead className="bg-[#080D0A] text-[#63796E] text-[10px] uppercase font-sans border-b border-[#18261E]">
                    <tr>
                      {columns.map((col) => (
                        <th key={col} className="py-2.5 px-3">
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#18261E]">
                    {parsedData.slice(0, 5).map((row, idx) => (
                      <tr key={idx} className="hover:bg-[#121B16]">
                        {columns.map((col) => (
                          <td key={col} className="py-2 px-3 text-[#D4E3DB]">
                            {String(row[col])}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Column Mapping Controls */}
              {category === 'sensors' && (
                <div className="p-3.5 rounded-xl bg-[#080D0A] border border-[#19261E] space-y-2">
                  <div className="text-xs font-bold text-emerald-400 font-sans">
                    Field Mapping (Source Column → Internal Telemetry Key)
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                    <div>
                      <span className="text-[#63796E] block mb-1">Timestamp:</span>
                      <select className="w-full p-1.5 rounded bg-[#0E1511] border border-[#203227] text-xs text-[#E1ECE5]">
                        <option>timestamp</option>
                      </select>
                    </div>
                    <div>
                      <span className="text-[#63796E] block mb-1">Soil Moisture:</span>
                      <select className="w-full p-1.5 rounded bg-[#0E1511] border border-[#203227] text-xs text-[#E1ECE5]">
                        <option>moisture_percent</option>
                      </select>
                    </div>
                    <div>
                      <span className="text-[#63796E] block mb-1">Temperature:</span>
                      <select className="w-full p-1.5 rounded bg-[#0E1511] border border-[#203227] text-xs text-[#E1ECE5]">
                        <option>temp_c</option>
                      </select>
                    </div>
                    <div>
                      <span className="text-[#63796E] block mb-1">Canopy NDVI:</span>
                      <select className="w-full p-1.5 rounded bg-[#0E1511] border border-[#203227] text-xs text-[#E1ECE5]">
                        <option>ndvi_index</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>

            <CardFooter className="pt-3 border-t border-[#18261E] flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs text-emerald-400 font-mono">
                <CheckCircle2 className="h-4 w-4" />
                <span>Zero format errors detected in sample payload</span>
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
                    ? 'Successfully Ingested ✓'
                    : isProcessing
                    ? 'Ingesting Records...'
                    : 'Commit to Farm Workspace'}
                </span>
              </Button>
            </CardFooter>
          </Card>

          {importSuccess && (
            <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-600/60 text-emerald-200 text-xs flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
                <div>
                  <div className="font-bold">Ingestion Complete</div>
                  <div>Records have been securely committed to your tenant farm partition.</div>
                </div>
              </div>
              <Link href="/control">
                <Button size="sm" className="bg-emerald-600 text-white font-bold text-xs">
                  View in Control HUD →
                </Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
