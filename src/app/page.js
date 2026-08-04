import HeroSection from "@/components/home/HeroSection";
import CategorySection from "@/components/home/CategorySection";
import MovieSection from "@/components/home/MovieSection";
import BookingCTA from "@/components/home/BookingCTA";
import MovieCard from "@/components/home/MovieCard";

export default function Home() {
  return (
    <>
      <HeroSection />

      <CategorySection />

      <MovieCard />
      
      <MovieSection />

      <BookingCTA />
    </>
  );
}
