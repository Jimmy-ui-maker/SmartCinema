import HeroSection from "@/components/home/HeroSection";
import CategorySection from "@/components/home/CategorySection";
import MovieSection from "@/components/home/MovieSection";
import BookingCTA from "@/components/home/BookingCTA";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <HeroSection />

      <CategorySection />

      <MovieSection />

      <BookingCTA />

      <Footer />
    </>
  );
}
