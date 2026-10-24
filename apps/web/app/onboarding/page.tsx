'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  User,
  MapPin,
  Sprout,
  Droplets,
  Layers,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Compass,
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
import { NexfieldLogo } from '@/components/branding/NexfieldLogo';
import { useFarmStore } from '@/lib/store/useFarmStore';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client';
import { apiClient } from '@/lib/api';

const DISTRICT_CENTROIDS: Record<string, { lat: number; lng: number }> = {
  Nashik: { lat: 19.9975, lng: 73.7898 },
  Pune: { lat: 18.5204, lng: 73.8567 },
  Amravati: { lat: 20.9374, lng: 77.7796 },
  Nagpur: { lat: 21.1458, lng: 79.0882 },
  Khanna: { lat: 30.7046, lng: 76.2163 },
  Ludhiana: { lat: 30.9010, lng: 75.8573 },
  Bathinda: { lat: 30.2110, lng: 74.9455 },
  Anand: { lat: 22.5645, lng: 72.9289 },
  Mandya: { lat: 12.5218, lng: 76.8951 },
  Karnal: { lat: 29.6857, lng: 76.9905 },
  Varanasi: { lat: 25.3176, lng: 82.9739 },
};

export default function OnboardingPage() {
  const router = useRouter();
  const { setSelectedFarmId } = useFarmStore();

  const [step, setStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isDetectingGps, setIsDetectingGps] = useState<boolean>(false);
  const [gpsStatus, setGpsStatus] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    // Step 1: Profile
    fullName: '',
    phone: '',
    role: 'farmer',
    state: 'Maharashtra',
    district: 'Nashik',

    // Step 2: Farm Property
    farmName: '',
    totalAreaHectares: 3.5,
    soilType: 'alluvial',
    primaryIrrigation: 'drip_irrigation',
    pinCode: '422003',
    latitude: 19.9975,
    longitude: 73.7898,
    gpsDetected: false,

    // Step 3: First Field Parcel
    fieldCode: 'F-101',
    fieldName: 'North Plot Alpha',
    fieldAreaHectares: 2.0,
    cropName: 'Tomato',
    cropVariety: 'Abhinav F1 Hybrid',
    sowingDate: new Date().toISOString().split('T')[0],

    // Step 4: Soil Baseline
    soilPh: 6.8,
    organicCarbonPercent: 0.75,
    nitrogenPpm: 140,
    phosphorusPpm: 35,
    potassiumPpm: 210,
    baselineMoisturePercent: 40.0,
  });

  // Verify user is authenticated when Supabase is configured
  useEffect(() => {
    if (isSupabaseConfigured()) {
      try {
        const supabase = createClient();
        supabase.auth.getUser().then(({ data, error }) => {
          if (error || !data.user) {
            router.push('/login?redirectTo=/onboarding');
          }
        });
      } catch {
        // Safe fallback
      }
    }
  }, [router]);

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };
      if (field === 'district' && !prev.gpsDetected) {
        const centroid = DISTRICT_CENTROIDS[value] || DISTRICT_CENTROIDS['Nashik'];
        updated.latitude = centroid.lat;
        updated.longitude = centroid.lng;
      }
      return updated;
    });
  };

  const handleDetectGPS = () => {
    if (typeof window !== 'undefined' && 'geolocation' in navigator) {
      setIsDetectingGps(true);
      setGpsStatus('Acquiring device GPS coordinates...');
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = Number(pos.coords.latitude.toFixed(6));
          const lng = Number(pos.coords.longitude.toFixed(6));
          setFormData((prev) => ({
            ...prev,
            latitude: lat,
            longitude: lng,
            gpsDetected: true,
          }));
          setIsDetectingGps(false);
          setGpsStatus(`GPS Acquired: ${lat.toFixed(4)}°N, ${lng.toFixed(4)}°E`);
        },
        () => {
          setIsDetectingGps(false);
          setGpsStatus('Location access not permitted. Regional district centroid retained.');
        },
        { enableHighAccuracy: true, timeout: 8000 }
      );
    } else {
      setGpsStatus('Geolocation unavailable on device.');
    }
  };

  const handleNext = () => {
    setErrorMessage(null);
    if (step === 1 && !formData.fullName.trim()) {
      setErrorMessage('Please enter your full name to proceed.');
      return;
    }
    if (step === 2 && !formData.farmName.trim()) {
      setErrorMessage('Please enter a name for your farm property.');
      return;
    }
    if (step === 3 && !formData.fieldName.trim()) {
      setErrorMessage('Please name your primary field parcel.');
      return;
    }
    setStep((prev) => Math.min(5, prev + 1));
  };

  const handleBack = () => {
    setErrorMessage(null);
    setStep((prev) => Math.max(1, prev - 1));
  };

  const handleCompleteOnboarding = async () => {
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      // 1. Verify user authentication session if Supabase is configured
      if (isSupabaseConfigured()) {
        const supabase = createClient();
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();
        if (authError || !user) {
          router.push('/login?redirectTo=/onboarding');
          return;
        }
      }

      // 2. Persist Farm to Backend REST API
      const farmRes = await apiClient.createFarm({
        name: formData.farmName.trim(),
        location: {
          latitude: Number(formData.latitude),
          longitude: Number(formData.longitude),
          address: `${formData.district}, ${formData.state}`,
          state: formData.state,
          district: formData.district,
          pinCode: formData.pinCode,
        },
        totalAreaHectares: Number(formData.totalAreaHectares),
        soilType: formData.soilType,
        primaryIrrigation: formData.primaryIrrigation,
      });

      const farmId = farmRes.data?.id;
      if (!farmId) {
        throw new Error('Farm creation did not return a valid identifier from backend.');
      }


      // 3. Persist Initial Field Parcel
      const fieldRes = await apiClient.createField(farmId, {
        name: formData.fieldName.trim(),
        code: formData.fieldCode.trim() || 'F-101',
        areaHectares: Math.min(Number(formData.fieldAreaHectares), Number(formData.totalAreaHectares)),
        soilMetrics: {
          ph: Number(formData.soilPh),
          organicCarbonPercent: Number(formData.organicCarbonPercent),
          nitrogenKgPerHa: Number(formData.nitrogenPpm),
          phosphorusKgPerHa: Number(formData.phosphorusPpm),
          potassiumKgPerHa: Number(formData.potassiumPpm),
          electricalConductivityDsM: 0.45,
          moisturePercent: Number(formData.baselineMoisturePercent),
          lastSampledDate: new Date().toISOString(),
        },
      });

      const fieldId = fieldRes.data?.id;

      // 4. Register Initial Active Crop Cycle
      if (fieldId) {
        const sowing = formData.sowingDate || new Date().toISOString().split('T')[0];
        const harvestDate = new Date(Date.parse(sowing) + 105 * 86400000).toISOString().split('T')[0];
        await apiClient.createCropCycle(fieldId, {
          cropName: formData.cropName || 'Tomato',
          variety: formData.cropVariety || 'Abhinav Hybrid F1',
          season: 'kharif',
          sowingDate: sowing,
          expectedHarvestDate: harvestDate,
          status: 'active',
          targetYieldMetricTons: Math.round(Number(formData.fieldAreaHectares) * 12.5 * 10) / 10,
          currentGrowthStage: 'vegetative_growth',
          healthIndexScore: 90,
        });
      }

      // 5. Update active farm in Zustand store
      setSelectedFarmId(farmId);

      // Brief animation feedback before opening workspace
      await new Promise((r) => setTimeout(r, 600));

      router.push('/control');
    } catch (err: any) {
      console.error('Error during onboarding farm provisioning:', err);
      setErrorMessage(
        err.message || 'Failed to complete farm registration. Please verify your inputs and backend connection.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070B09] text-[#F0F5F2] flex flex-col justify-between p-4 sm:p-6 lg:p-8">
      {/* Top Header */}
      <header className="max-w-4xl w-full mx-auto flex items-center justify-between pb-6 border-b border-[#1A261F]">
        <NexfieldLogo size="md" showWordmark={true} href="/" />
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-emerald-400 border-emerald-500/40 font-mono text-xs">
            Step {step} of 5
          </Badge>
          <Link
            href="/demo/control"
            className="text-xs text-[#7B9587] hover:text-emerald-400 transition-colors ml-2 hidden sm:inline"
          >
            Or Try Demo Mode →
          </Link>
        </div>
      </header>

      {/* Main Form Body */}
      <main className="max-w-3xl w-full mx-auto my-8">
        {/* Step Progress Pills */}
        <div className="grid grid-cols-5 gap-2 mb-8 text-center text-xs font-mono">
          {[
            { n: 1, label: 'Profile' },
            { n: 2, label: 'Farm' },
            { n: 3, label: 'Field' },
            { n: 4, label: 'Soil Data' },
            { n: 5, label: 'Launch' },
          ].map((item) => (
            <div
              key={item.n}
              className={`p-2 rounded-lg border transition-all ${
                step === item.n
                  ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300 font-bold'
                  : step > item.n
                  ? 'bg-[#0E1511] border-emerald-800/40 text-emerald-400'
                  : 'bg-[#090F0C] border-[#18261E] text-[#556D60]'
              }`}
            >
              <div className="text-[10px]">{step > item.n ? '✓' : `0${item.n}`}</div>
              <div className="truncate">{item.label}</div>
            </div>
          ))}
        </div>

        {errorMessage && (
          <div className="mb-6 p-3 rounded-xl bg-rose-950/40 border border-rose-800/50 text-xs text-rose-300">
            {errorMessage}
          </div>
        )}

        {/* STEP 1: Farmer & Enterprise Profile */}
        {step === 1 && (
          <Card className="border-[#1E2E25] bg-[#0E1511] shadow-2xl">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-[#F1F6F3]">
                Step 1: Grower & Enterprise Profile
              </CardTitle>
              <CardDescription className="text-xs text-[#7B9587]">
                Provide your identity and geographic jurisdiction for localized Mandi & weather feeds
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-xs">
              <div>
                <label className="font-medium text-[#BDD1C6] block mb-1.5">
                  Full Name / Legal Enterprise
                </label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  placeholder="e.g., Rajesh Patil or Sahyadri Farmer Producer Co."
                  className="w-full px-3 py-2.5 rounded-xl bg-[#080D0A] border border-[#203227] text-[#F1F6F3] text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-medium text-[#BDD1C6] block mb-1.5">
                    Contact Phone Number (Optional)
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full px-3 py-2.5 rounded-xl bg-[#080D0A] border border-[#203227] text-[#F1F6F3] text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="font-medium text-[#BDD1C6] block mb-1.5">
                    Primary Operational Role
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => handleInputChange('role', e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#080D0A] border border-[#203227] text-[#E1ECE5] text-sm focus:outline-none focus:border-emerald-500"
                  >
                    <option value="farmer">Independent Farmer / Grower</option>
                    <option value="agronomist">Certified Agronomist / Consultant</option>
                    <option value="field_officer">FPO Field Officer</option>
                    <option value="admin">Agri-Enterprise Administrator</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-medium text-[#BDD1C6] block mb-1.5">State</label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => handleInputChange('state', e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#080D0A] border border-[#203227] text-[#F1F6F3] text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="font-medium text-[#BDD1C6] block mb-1.5">District</label>
                  <input
                    type="text"
                    value={formData.district}
                    onChange={(e) => handleInputChange('district', e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#080D0A] border border-[#203227] text-[#F1F6F3] text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* STEP 2: Farm Property Creation */}
        {step === 2 && (
          <Card className="border-[#1E2E25] bg-[#0E1511] shadow-2xl">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-[#F1F6F3]">
                Step 2: Farm Property Configuration
              </CardTitle>
              <CardDescription className="text-xs text-[#7B9587]">
                Define land boundary, total acreage, and primary soil topology
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-xs">
              <div>
                <label className="font-medium text-[#BDD1C6] block mb-1.5">
                  Farm Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.farmName}
                  onChange={(e) => handleInputChange('farmName', e.target.value)}
                  placeholder="e.g., Godavari Bio-Research Agrohub"
                  className="w-full px-3 py-2.5 rounded-xl bg-[#080D0A] border border-[#203227] text-[#F1F6F3] text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-medium text-[#BDD1C6] block mb-1.5">
                    Total Area (Hectares)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    value={formData.totalAreaHectares}
                    onChange={(e) => handleInputChange('totalAreaHectares', Number(e.target.value))}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#080D0A] border border-[#203227] text-[#F1F6F3] text-sm font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="font-medium text-[#BDD1C6] block mb-1.5">
                    Postal PIN Code
                  </label>
                  <input
                    type="text"
                    value={formData.pinCode}
                    onChange={(e) => handleInputChange('pinCode', e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#080D0A] border border-[#203227] text-[#F1F6F3] text-sm font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Geographic Coordinates & Real-time GPS Detection */}
              <div className="p-3 rounded-xl bg-[#080D0A] border border-[#1C2C22] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-[#BDD1C6] flex items-center gap-1.5">
                    <Compass className="h-3.5 w-3.5 text-[#D7B678]" />
                    Spatial Centroid & GPS Coordinates
                  </span>
                  <button
                    type="button"
                    onClick={handleDetectGPS}
                    disabled={isDetectingGps}
                    className="px-2.5 py-1 rounded-lg bg-[#14231A] border border-[#2D6546] text-[#D7B678] hover:bg-[#1A3324] text-[11px] font-semibold transition-colors flex items-center gap-1"
                  >
                    {isDetectingGps ? (
                      <span className="h-3 w-3 border-2 border-[#D7B678] border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <MapPin className="h-3 w-3" />
                    )}
                    <span>Detect Device GPS</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] text-[#789384] block mb-1">Latitude (°N)</label>
                    <input
                      type="number"
                      step="0.000001"
                      value={formData.latitude}
                      onChange={(e) => handleInputChange('latitude', Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-[#0C1410] border border-[#203227] text-[#FAF8F2] font-mono text-xs focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-[#789384] block mb-1">Longitude (°E)</label>
                    <input
                      type="number"
                      step="0.000001"
                      value={formData.longitude}
                      onChange={(e) => handleInputChange('longitude', Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-[#0C1410] border border-[#203227] text-[#FAF8F2] font-mono text-xs focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                {gpsStatus && (
                  <p className="text-[11px] text-[#D7B678] font-mono leading-tight">{gpsStatus}</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-medium text-[#BDD1C6] block mb-1.5">
                    Dominant Soil Type
                  </label>
                  <select
                    value={formData.soilType}
                    onChange={(e) => handleInputChange('soilType', e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#080D0A] border border-[#203227] text-[#E1ECE5] text-sm focus:outline-none focus:border-emerald-500"
                  >
                    <option value="alluvial">Alluvial Loam</option>
                    <option value="black_cotton">Black Cotton Soil (Vertisol)</option>
                    <option value="red_loamy">Red Loamy Soil</option>
                    <option value="clay_loam">Clay Loam</option>
                    <option value="sandy_loam">Sandy Loam</option>
                    <option value="laterite">Laterite Soil</option>
                  </select>
                </div>

                <div>
                  <label className="font-medium text-[#BDD1C6] block mb-1.5">
                    Primary Irrigation Infrastructure
                  </label>
                  <select
                    value={formData.primaryIrrigation}
                    onChange={(e) => handleInputChange('primaryIrrigation', e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#080D0A] border border-[#203227] text-[#E1ECE5] text-sm focus:outline-none focus:border-emerald-500"
                  >
                    <option value="drip_irrigation">Precision Drip Irrigation</option>
                    <option value="sprinkler">Sprinkler System</option>
                    <option value="canal">Canal Gravity Flow</option>
                    <option value="borewell">Submersible Borewell</option>
                    <option value="rainfed">Rainfed (Non-irrigated)</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* STEP 3: Initial Field Setup */}
        {step === 3 && (
          <Card className="border-[#1E2E25] bg-[#0E1511] shadow-2xl">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-[#F1F6F3]">
                Step 3: Initial Field Parcel & Crop Cycle
              </CardTitle>
              <CardDescription className="text-xs text-[#7B9587]">
                Register your primary cultivation plot for satellite NDVI & disease tracking
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-medium text-[#BDD1C6] block mb-1.5">
                    Field Parcel Code
                  </label>
                  <input
                    type="text"
                    value={formData.fieldCode}
                    onChange={(e) => handleInputChange('fieldCode', e.target.value)}
                    placeholder="e.g., F-101 or SECTOR-1"
                    className="w-full px-3 py-2.5 rounded-xl bg-[#080D0A] border border-[#203227] text-[#F1F6F3] text-sm font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="font-medium text-[#BDD1C6] block mb-1.5">
                    Field Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.fieldName}
                    onChange={(e) => handleInputChange('fieldName', e.target.value)}
                    placeholder="e.g., North Sector Plot 1"
                    className="w-full px-3 py-2.5 rounded-xl bg-[#080D0A] border border-[#203227] text-[#F1F6F3] text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-medium text-[#BDD1C6] block mb-1.5">
                    Field Area (Hectares)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    max={formData.totalAreaHectares}
                    value={formData.fieldAreaHectares}
                    onChange={(e) => handleInputChange('fieldAreaHectares', Number(e.target.value))}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#080D0A] border border-[#203227] text-[#F1F6F3] text-sm font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="font-medium text-[#BDD1C6] block mb-1.5">
                    Current Commodity / Crop
                  </label>
                  <select
                    value={formData.cropName}
                    onChange={(e) => handleInputChange('cropName', e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#080D0A] border border-[#203227] text-[#E1ECE5] text-sm focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Tomato">Tomato (Solanum lycopersicum)</option>
                    <option value="Wheat">Wheat (Triticum aestivum)</option>
                    <option value="Rice">Paddy / Rice (Oryza sativa)</option>
                    <option value="Cotton">Cotton (Gossypium hirsutum)</option>
                    <option value="Soybean">Soybean (Glycine max)</option>
                    <option value="Onion">Onion (Allium cepa)</option>
                    <option value="Grapes">Grapes (Vitis vinifera)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-medium text-[#BDD1C6] block mb-1.5">
                    Cultivar / Hybrid Variety
                  </label>
                  <input
                    type="text"
                    value={formData.cropVariety}
                    onChange={(e) => handleInputChange('cropVariety', e.target.value)}
                    placeholder="e.g., Abhinav F1 or HD-3086"
                    className="w-full px-3 py-2.5 rounded-xl bg-[#080D0A] border border-[#203227] text-[#F1F6F3] text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="font-medium text-[#BDD1C6] block mb-1.5">
                    Sowing / Transplanting Date
                  </label>
                  <input
                    type="date"
                    value={formData.sowingDate}
                    onChange={(e) => handleInputChange('sowingDate', e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#080D0A] border border-[#203227] text-[#F1F6F3] text-sm font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* STEP 4: Agricultural Baseline */}
        {step === 4 && (
          <Card className="border-[#1E2E25] bg-[#0E1511] shadow-2xl">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-[#F1F6F3]">
                Step 4: Soil Chemistry & Biophysical Baseline
              </CardTitle>
              <CardDescription className="text-xs text-[#7B9587]">
                Initial soil test health card parameters for the 3D Digital Twin engine
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-xs font-mono">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="font-medium text-[#BDD1C6] font-sans block mb-1.5">
                    Soil Reaction (pH)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="4"
                    max="10"
                    value={formData.soilPh}
                    onChange={(e) => handleInputChange('soilPh', Number(e.target.value))}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#080D0A] border border-[#203227] text-purple-400 font-bold text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="font-medium text-[#BDD1C6] font-sans block mb-1.5">
                    Organic Carbon (%)
                  </label>
                  <input
                    type="number"
                    step="0.05"
                    min="0.1"
                    max="3.0"
                    value={formData.organicCarbonPercent}
                    onChange={(e) => handleInputChange('organicCarbonPercent', Number(e.target.value))}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#080D0A] border border-[#203227] text-emerald-400 font-bold text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="font-medium text-[#BDD1C6] font-sans block mb-1.5">
                    Baseline Moisture (%)
                  </label>
                  <input
                    type="number"
                    step="1"
                    min="10"
                    max="80"
                    value={formData.baselineMoisturePercent}
                    onChange={(e) => handleInputChange('baselineMoisturePercent', Number(e.target.value))}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#080D0A] border border-[#203227] text-sky-400 font-bold text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div>
                  <label className="font-medium text-[#BDD1C6] font-sans block mb-1.5">
                    Nitrogen (ppm)
                  </label>
                  <input
                    type="number"
                    value={formData.nitrogenPpm}
                    onChange={(e) => handleInputChange('nitrogenPpm', Number(e.target.value))}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#080D0A] border border-[#203227] text-[#F1F6F3] text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="font-medium text-[#BDD1C6] font-sans block mb-1.5">
                    Phosphorus (ppm)
                  </label>
                  <input
                    type="number"
                    value={formData.phosphorusPpm}
                    onChange={(e) => handleInputChange('phosphorusPpm', Number(e.target.value))}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#080D0A] border border-[#203227] text-[#F1F6F3] text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="font-medium text-[#BDD1C6] font-sans block mb-1.5">
                    Potassium (ppm)
                  </label>
                  <input
                    type="number"
                    value={formData.potassiumPpm}
                    onChange={(e) => handleInputChange('potassiumPpm', Number(e.target.value))}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#080D0A] border border-[#203227] text-[#F1F6F3] text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* STEP 5: Review & Launch Workspace */}
        {step === 5 && (
          <Card className="border-[#1E2E25] bg-[#0E1511] shadow-2xl">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-[#F1F6F3]">
                Step 5: Review & Launch Farm Workspace
              </CardTitle>
              <CardDescription className="text-xs text-[#7B9587]">
                Confirm your configuration before provisioning cryptographic tenant storage
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-xs font-mono">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3.5 rounded-xl bg-[#080D0A] border border-[#18261E] space-y-1">
                  <div className="text-[10px] text-[#63796E] font-sans">GROWER & JURISDICTION</div>
                  <div className="font-bold text-[#F1F6F3] text-sm font-sans">{formData.fullName}</div>
                  <div className="text-[#8EA698]">{formData.district}, {formData.state} ({formData.pinCode})</div>
                  <div className="text-emerald-400 font-sans mt-1">Role: {formData.role}</div>
                </div>

                <div className="p-3.5 rounded-xl bg-[#080D0A] border border-[#18261E] space-y-1">
                  <div className="text-[10px] text-[#63796E] font-sans">PROPERTY DETAILS</div>
                  <div className="font-bold text-[#F1F6F3] text-sm font-sans">{formData.farmName}</div>
                  <div className="text-[#8EA698]">{formData.totalAreaHectares} Hectares · {formData.soilType}</div>
                  <div className="text-sky-400 font-sans mt-1">Irrigation: {formData.primaryIrrigation}</div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#080D0A] border border-[#18261E] space-y-2">
                <div className="text-[10px] text-[#63796E] font-sans">CROP PARCEL SPECIFICATION</div>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="font-sans font-bold text-emerald-400">
                    {formData.fieldName} ({formData.fieldCode})
                  </div>
                  <div className="text-[#8EA698]">{formData.cropName} ({formData.cropVariety})</div>
                </div>
                <div className="text-[#7B9587] text-[11px]">
                  Area: {formData.fieldAreaHectares} ha · Sowing: {formData.sowingDate} · pH: {formData.soilPh} · Moisture: {formData.baselineMoisturePercent}%
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#14231A] border border-emerald-600/40 text-emerald-300 flex items-center gap-3">
                <ShieldCheck className="h-5 w-5 shrink-0 text-emerald-400" />
                <div className="font-sans text-xs">
                  Row-Level Security Active: All data is bound to your private user ID.
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Wizard Footer Controls */}
        <div className="flex items-center justify-between mt-8 pt-4 border-t border-[#18261E]">
          {step > 1 ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleBack}
              className="text-xs gap-1.5 text-[#8EA698] border-[#22352A]"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Previous Step</span>
            </Button>
          ) : (
            <div />
          )}

          {step < 5 ? (
            <Button
              type="button"
              size="sm"
              onClick={handleNext}
              className="text-xs gap-1.5 bg-[#10B981] text-[#070B09] hover:bg-[#34D399] font-bold px-5"
            >
              <span>Continue</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          ) : (
            <Button
              type="button"
              size="sm"
              disabled={isSubmitting}
              onClick={handleCompleteOnboarding}
              className="text-xs gap-2 bg-[#10B981] text-[#070B09] hover:bg-[#34D399] font-extrabold px-6 py-2.5 shadow-lg shadow-emerald-950/60"
            >
              <Sparkles className="h-4 w-4" />
              <span>{isSubmitting ? 'Provisioning Farm...' : 'Complete & Open Workspace'}</span>
            </Button>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-4 text-xs text-[#556D60] font-mono">
        NEXFIELD Onboarding Protocol · ADAPPT 5.0 Agri-Tech OS
      </footer>
    </div>
  );
}
