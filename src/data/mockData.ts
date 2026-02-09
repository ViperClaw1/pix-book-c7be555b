import place1 from "@/assets/place-1.jpg";
import place2 from "@/assets/place-2.jpg";
import place3 from "@/assets/place-3.jpg";
import place4 from "@/assets/place-4.jpg";
import place5 from "@/assets/place-5.jpg";
import place6 from "@/assets/place-6.jpg";
import heroRestaurant from "@/assets/hero-restaurant.jpg";
import heroBeauty from "@/assets/hero-beauty.jpg";
import heroEvents from "@/assets/hero-events.jpg";

export type Category = "restaurant" | "beauty" | "entertainment";

export interface Place {
  id: string;
  name: string;
  category: Category;
  image: string;
  rating: number;
  reviewCount: number;
  tags: string[];
  address: string;
  priceRange: string;
  description: string;
  openHours: string;
  phone: string;
  isFeatured?: boolean;
}

export interface BannerSlide {
  id: string;
  image: string;
  title: string;
  subtitle: string;
}

export interface Booking {
  id: string;
  placeId: string;
  placeName: string;
  placeImage: string;
  date: string;
  time: string;
  guests: number;
  status: "upcoming" | "completed" | "cancelled";
  category: Category;
}

export const banners: BannerSlide[] = [
  { id: "1", image: heroRestaurant, title: "Fine Dining Week", subtitle: "Up to 30% off at top restaurants" },
  { id: "2", image: heroBeauty, title: "Beauty & Wellness", subtitle: "Book your perfect spa day" },
  { id: "3", image: heroEvents, title: "Live Events", subtitle: "Concerts, shows & festivals" },
];

export const categories: { id: Category; label: string; icon: string; count: number }[] = [
  { id: "restaurant", label: "Restaurants", icon: "🍽️", count: 248 },
  { id: "beauty", label: "Beauty", icon: "💆", count: 156 },
  { id: "entertainment", label: "Events", icon: "🎭", count: 89 },
];

export const places: Place[] = [
  {
    id: "1", name: "The Golden Table", category: "restaurant", image: place1,
    rating: 4.8, reviewCount: 324, tags: ["Fine Dining", "European"],
    address: "15 Abay Ave, Almaty", priceRange: "$$$$",
    description: "An exquisite fine dining experience with European-inspired cuisine and an award-winning wine list. Perfect for special occasions and romantic evenings.",
    openHours: "12:00 – 23:00", phone: "+7 727 123 4567", isFeatured: true,
  },
  {
    id: "2", name: "Serenity Spa", category: "beauty", image: place2,
    rating: 4.9, reviewCount: 187, tags: ["Spa", "Massage", "Skincare"],
    address: "42 Dostyk St, Almaty", priceRange: "$$$",
    description: "A luxury spa offering world-class treatments, from deep tissue massages to advanced skincare routines. Unwind in a serene environment.",
    openHours: "09:00 – 21:00", phone: "+7 727 234 5678", isFeatured: true,
  },
  {
    id: "3", name: "Brick & Brew", category: "restaurant", image: place3,
    rating: 4.5, reviewCount: 562, tags: ["Cafe", "Brunch", "Coffee"],
    address: "8 Nazarbayev St, Almaty", priceRange: "$$",
    description: "A cozy artisan coffee shop with specialty brews and fresh pastries. The perfect spot for brunch with friends.",
    openHours: "07:00 – 22:00", phone: "+7 727 345 6789", isFeatured: true,
  },
  {
    id: "4", name: "Blue Velvet Lounge", category: "entertainment", image: place4,
    rating: 4.6, reviewCount: 203, tags: ["Bar", "Live Music", "Cocktails"],
    address: "23 Tole Bi St, Almaty", priceRange: "$$$",
    description: "An upscale cocktail lounge with live jazz performances and handcrafted drinks.",
    openHours: "18:00 – 02:00", phone: "+7 727 456 7890",
  },
  {
    id: "5", name: "Glow Studio", category: "beauty", image: place5,
    rating: 4.7, reviewCount: 98, tags: ["Hair", "Styling", "Color"],
    address: "56 Auezov St, Almaty", priceRange: "$$",
    description: "Professional hair styling with expert colorists and modern techniques.",
    openHours: "10:00 – 20:00", phone: "+7 727 567 8901", isFeatured: true,
  },
  {
    id: "6", name: "Sunset Festival", category: "entertainment", image: place6,
    rating: 4.4, reviewCount: 1205, tags: ["Festival", "Music", "Outdoor"],
    address: "Central Park, Almaty", priceRange: "$$",
    description: "The biggest outdoor music festival of the summer with food trucks, art installations, and top artists.",
    openHours: "14:00 – 23:00", phone: "+7 727 678 9012",
  },
];

export const mockBookings: Booking[] = [
  {
    id: "b1", placeId: "1", placeName: "The Golden Table", placeImage: place1,
    date: "2026-02-14", time: "19:00", guests: 2, status: "upcoming", category: "restaurant",
  },
  {
    id: "b2", placeId: "2", placeName: "Serenity Spa", placeImage: place2,
    date: "2026-02-10", time: "14:00", guests: 1, status: "upcoming", category: "beauty",
  },
  {
    id: "b3", placeId: "3", placeName: "Brick & Brew", placeImage: place3,
    date: "2026-01-28", time: "11:00", guests: 4, status: "completed", category: "restaurant",
  },
];

export const specialists = [
  { id: "s1", name: "Anna Kim", role: "Senior Stylist", rating: 4.9, image: "👩‍🦰" },
  { id: "s2", name: "Maria Lee", role: "Colorist", rating: 4.8, image: "👩" },
  { id: "s3", name: "Elena Park", role: "Massage Therapist", rating: 5.0, image: "👩‍⚕️" },
];

export const services = [
  { id: "sv1", name: "Haircut & Styling", duration: "60 min", price: "8,000 ₸" },
  { id: "sv2", name: "Hair Coloring", duration: "120 min", price: "15,000 ₸" },
  { id: "sv3", name: "Deep Tissue Massage", duration: "90 min", price: "12,000 ₸" },
  { id: "sv4", name: "Facial Treatment", duration: "45 min", price: "10,000 ₸" },
];
