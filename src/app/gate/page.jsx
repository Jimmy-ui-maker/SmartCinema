"use client";

import { useEffect, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { useRef } from "react";
import { useSearchParams } from "next/navigation";

export default function GateScannerPage() {
  const [result, setResult] = useState(null);
  const [processing, setProcessing] = useState(false);

  const [message, setMessage] = useState(
    "Point the camera at a customer's ticket QR code.",
  );

  const searchParams = useSearchParams();

  const ticketId = searchParams.get("ticket");

  // ==========================================
  // VERIFY TICKET
  // ==========================================

  const handleTicket = async (id) => {
    try {
      const res = await fetch("/api/tickets/scan", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",

          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },

        body: JSON.stringify({
          ticketId: id,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setResult(data);

        setMessage("✅ Ticket verified successfully.");
      } else {
        setResult(null);

        setMessage(`❌ ${data.message}`);
      }
    } catch (error) {
      setResult(null);

      setMessage("❌ Unable to verify ticket.");
    }
  };

  // ==========================================
  // AUTO VERIFY FROM URL
  // ==========================================

  useEffect(() => {
    if (ticketId) {
      handleTicket(ticketId);
    }
  }, [ticketId]);

  // ==========================================
  // QR SCAN
  // ==========================================

  const handleScan = async (scanResult) => {
    if (!scanResult || processing) return;

    setProcessing(true);

    try {
      const text = scanResult.text;

      let scannedTicketId = "";

      // QR contains URL
      if (text.includes("/verify/")) {
        scannedTicketId = text.split("/verify/")[1];
      }

      // QR contains JSON
      else {
        try {
          scannedTicketId = JSON.parse(text).ticketId;
        } catch {
          scannedTicketId = text;
        }
      }

      await handleTicket(scannedTicketId);
    } catch {
      setResult(null);

      setMessage("❌ Invalid QR Code.");
    } finally {
      setTimeout(() => {
        setProcessing(false);
      }, 2000);
    }
  };
  const scannerRef = useRef(null);

  useEffect(() => {
    if (scannerRef.current) return;

    const scanner = new Html5Qrcode("reader");

    scannerRef.current = scanner;

    scanner
      .start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: {
            width: 250,
            height: 250,
          },
        },
        (decodedText) => {
          handleScan({
            text: decodedText,
          });
        },
        () => {},
      )
      .catch((err) => {
        console.log(err);
      });

    return () => {
      if (scannerRef.current && scannerRef.current.isScanning) {
        scannerRef.current
          .stop()
          .then(() => {
            scannerRef.current.clear();
          })
          .catch(() => {});
      }
    };
  }, []);

  return (
    <div className="container py-5">
      <div className="text-center mb-4">
        <h2>🎬 CinemaHub Gate Scanner</h2>

        <p className="text-muted">
          Scan customer tickets for entry validation.
        </p>
      </div>

      {/** 
      <div className="row justify-content-center">
        <div className="col-lg-6">
          <div className="card shadow">
            <div className="card-body">
              <div
                id="reader"
                style={{
                  width: "100%",
                  minHeight: "350px",
                }}
              ></div>
            </div>
          </div>

          <div
            className={`alert mt-4 ${
              result ? "alert-success" : "alert-secondary"
            }`}
          >
            {message}
          </div>

          {result && (
            <div className="card shadow mt-4 border-success">
              <div className="card-header bg-success text-white">
                <h4 className="mb-0">✅ Access Granted</h4>
              </div>

              <div className="card-body">
                <h3 className="fw-bold">{result.movie.title}</h3>

                <hr />

                <div className="row">
                  <div className="col-md-6">
                    <p>
                      <strong>Customer</strong>
                      <br />
                      {result.customer.name}
                    </p>

                    <p>
                      <strong>Ticket Number</strong>
                      <br />
                      {result.ticket.ticketNumber}
                    </p>

                    <p>
                      <strong>Booking Number</strong>
                      <br />
                      {result.booking.bookingNumber}
                    </p>
                  </div>

                  <div className="col-md-6">
                    <p>
                      <strong>Hall</strong>
                      <br />
                      {result.hall.name}
                    </p>

                    <p>
                      <strong>Seats</strong>
                      <br />
                      {result.booking.seats.join(", ")}
                    </p>

                    <p>
                      <strong>Status</strong>
                      <br />

                      <span className="badge bg-success">
                        {result.ticket.ticketStatus}
                      </span>
                    </p>
                  </div>
                </div>

                <hr />

                <div className="alert alert-success text-center mb-0">
                  <h5 className="mb-1">🎉 Welcome!</h5>
                  Enjoy your movie.
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      */}
    </div>
  );
}
