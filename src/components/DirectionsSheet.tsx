import { useState, useEffect, useCallback } from "react";
import { Car, Footprints, Train, ExternalLink, X, MapPin, Loader2 } from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerClose,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const getAuthHeader = async () => {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token ?? import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
  return { Authorization: `Bearer ${token}`, apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY };
};

interface DirectionsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  placeName: string;
  address: string;
}

type TravelMode = "driving" | "transit" | "walking";

const travelModes = [
  { mode: "driving" as TravelMode, label: "Drive", icon: Car },
  { mode: "transit" as TravelMode, label: "Transit", icon: Train },
  { mode: "walking" as TravelMode, label: "Walk", icon: Footprints },
];

const DirectionsSheet = ({ open, onOpenChange, placeName, address }: DirectionsSheetProps) => {
  const encoded = encodeURIComponent(address);
  const [placeEmbedUrl, setPlaceEmbedUrl] = useState(
    `https://maps.google.com/maps?q=${encoded}&t=&z=15&ie=UTF8&iwloc=&output=embed`
  );
  const [mapEmbedUrl, setMapEmbedUrl] = useState(placeEmbedUrl);
  const [selectedMode, setSelectedMode] = useState<TravelMode | null>(null);
  const [loading, setLoading] = useState(false);

  // Fetch place embed on open
  useEffect(() => {
    if (!open) {
      setSelectedMode(null);
      return;
    }
    const fetchPlaceEmbed = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/maps-embed?address=${encoded}`,
          { headers: await getAuthHeader() }
        );
        if (res.ok) {
          const json = await res.json();
          if (json.embedUrl) {
            setPlaceEmbedUrl(json.embedUrl);
            if (!selectedMode) setMapEmbedUrl(json.embedUrl);
          }
        }
      } catch {
        // fallback already set
      }
    };
    fetchPlaceEmbed();
  }, [open, encoded]);

  const getUserLocation = (): Promise<{ lat: number; lng: number }> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation not supported"));
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        (err) => reject(err),
        { enableHighAccuracy: true, timeout: 10000 }
      );
    });
  };

  const handleModeClick = useCallback(async (mode: TravelMode) => {
    // Toggle off if already selected
    if (selectedMode === mode) {
      setSelectedMode(null);
      setMapEmbedUrl(placeEmbedUrl);
      return;
    }

    setSelectedMode(mode);
    setLoading(true);

    try {
      const location = await getUserLocation();
      const origin = `${location.lat},${location.lng}`;
      const res = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/maps-embed?address=${encoded}&origin=${encodeURIComponent(origin)}&mode=${mode}`,
        { headers: await getAuthHeader() }
      );
      if (res.ok) {
        const json = await res.json();
        if (json.embedUrl) {
          setMapEmbedUrl(json.embedUrl);
        }
      }
    } catch {
      toast({ title: "Could not get your location", description: "Please allow location access to see routes.", variant: "destructive" });
      setSelectedMode(null);
      setMapEmbedUrl(placeEmbedUrl);
    } finally {
      setLoading(false);
    }
  }, [selectedMode, placeEmbedUrl, encoded]);

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[92vh]">
        <DrawerHeader className="relative pb-2">
          <DrawerClose className="absolute right-4 top-4 p-1 rounded-full bg-secondary">
            <X className="w-4 h-4 text-secondary-foreground" />
          </DrawerClose>
          <DrawerTitle className="text-lg">{placeName}</DrawerTitle>
          <DrawerDescription className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
            {address}
          </DrawerDescription>
        </DrawerHeader>

        <div className="px-4 pb-4 space-y-4 overflow-y-auto">
          {/* Map embed */}
          <div className="w-full aspect-[4/3] rounded-xl overflow-hidden border border-border relative">
            {loading && (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/60">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            )}
            <iframe
              src={mapEmbedUrl}
              className="w-full h-full border-0"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title={`Map of ${placeName}`}
            />
          </div>

          {/* Route options */}
          <div className="grid grid-cols-3 gap-2">
            {travelModes.map(({ mode, label, icon: Icon }) => (
              <button
                key={mode}
                onClick={() => handleModeClick(mode)}
                className={`flex flex-col items-center gap-1.5 p-3 rounded-xl transition-colors ${
                  selectedMode === mode
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary hover:bg-secondary/80 text-secondary-foreground"
                }`}
              >
                <Icon className={`w-5 h-5 ${selectedMode === mode ? "text-primary-foreground" : "text-primary"}`} />
                <span className="text-xs font-medium">{label}</span>
              </button>
            ))}
          </div>

          {/* External link */}
          <Button
            variant="outline"
            className="w-full gap-2"
            onClick={() =>
              window.open(
                `https://www.google.com/maps/dir/?api=1&destination=${encoded}`,
                "_blank"
              )
            }
          >
            <ExternalLink className="w-4 h-4" />
            Open in Google Maps
          </Button>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default DirectionsSheet;
