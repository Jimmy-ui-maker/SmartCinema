"use client";

import { useParams } from "next/navigation";
import { useEffect } from "react";

export default function VerifyRedirect() {
  const { id } = useParams();

  useEffect(() => {
    window.location.href = "/gate?ticket=" + id;
  }, [id]);

  return (
    <div className="container py-5 text-center">
      <h2>Verifying Ticket...</h2>
    </div>
  );
}
