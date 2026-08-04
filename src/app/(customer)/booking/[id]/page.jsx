"use client";

import { useParams } from "next/navigation";

import SeatSelection from "@/components/CustomerDashboard/SeatSelection";

export default function BookingPage() {
  const params = useParams();

  const scheduleId = params.id;

  return (
    <div className="container py-5">
      <h2 className="mb-4 text-center">🎟 Complete Your Booking</h2>

      <SeatSelection scheduleId={scheduleId} />
    </div>
  );
}
