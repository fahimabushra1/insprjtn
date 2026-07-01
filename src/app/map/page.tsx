import MapContainerWrapper from "@/components/map/MapContainerWrapper";

export const metadata = {
  title: "Sundarban Explorer Map - Insaniat Parjatan",
  description:
    "Follow the travel route from Khulna and Bagerhat down through Karamjal, Katka, and Dublar Char. Explore destinations, estimate travel times, and plan your cruise.",
};

export default function MapPage() {
  return (
    <div className="w-full h-screen">
      <MapContainerWrapper />
    </div>
  );
}
