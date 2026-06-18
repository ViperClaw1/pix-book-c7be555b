import { useState } from "react";
import { usePixapAuth } from "@/pixap-web/app/providers/AuthProvider";
import { HomeHeader } from "@/pixap-web/widgets/home/HomeHeader";
import { CategoriesScroll } from "@/pixap-web/widgets/home/CategoriesScroll";
import { TonightForYou } from "@/pixap-web/widgets/home/TonightForYou";
import { RecommendedList } from "@/pixap-web/widgets/home/RecommendedList";
import { FloatingCTA } from "@/pixap-web/widgets/home/FloatingCTA";

const CITIES = ["Almaty", "Astana", "Shymkent", "Yerevan"];

export default function HomePage() {
  const { user } = usePixapAuth();
  const savedCity =
    (user?.user_metadata?.pixap_prefs as { city?: string } | undefined)?.city;
  const [city, setCity] = useState<string>(savedCity || "Almaty");
  const [categoryId, setCategoryId] = useState<string | undefined>();

  return (
    <main className="pixap-shell pb-12">
      <HomeHeader
        city={city}
        cities={CITIES}
        onSelectCity={setCity}
      />
      <CategoriesScroll selectedId={categoryId} onSelect={setCategoryId} />
      <TonightForYou city={city} categoryId={categoryId} />
      <RecommendedList city={city} categoryId={categoryId} />
      <FloatingCTA city={city} />
    </main>
  );
}
