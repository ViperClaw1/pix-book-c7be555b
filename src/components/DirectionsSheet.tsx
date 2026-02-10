import { Car, Footprints, Train, ExternalLink, X, MapPin } from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerClose,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";

interface DirectionsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  placeName: string;
  address: string;
}

const travelModes = [
  { mode: "driving", label: "Drive", icon: Car },
  { mode: "transit", label: "Transit", icon: Train },
  { mode: "walking", label: "Walk", icon: Footprints },
] as const;

const DirectionsSheet = ({ open, onOpenChange, placeName, address }: DirectionsSheetProps) => {
  const encoded = encodeURIComponent(address);
  const mapEmbedUrl = `https://maps.google.com/maps?q=${encoded}&t=&z=15&ie=UTF8&iwloc=&output=embed`;

  const openRoute = (mode: string) => {
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${encoded}&travelmode=${mode}`,
      "_blank"
    );
  };

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
          <div className="w-full aspect-[4/3] rounded-xl overflow-hidden border border-border">
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
                onClick={() => openRoute(mode)}
                className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-secondary hover:bg-secondary/80 transition-colors"
              >
                <Icon className="w-5 h-5 text-primary" />
                <span className="text-xs font-medium text-secondary-foreground">{label}</span>
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
