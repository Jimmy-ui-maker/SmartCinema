"use client";

import QRCode from "react-qr-code";
import { useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function TicketCard({ ticket }) {
  const ticketRef = useRef(null);

  // ============================================
  // DOWNLOAD PDF
  // ============================================

  const downloadPDF = async () => {
    const element = ticketRef.current;

    const canvas = await html2canvas(element, {
      scale: 2,
    });

    const image = canvas.toDataURL("image/png");

    const pdf = new jsPDF("portrait", "mm", "a4");

    const width = 190;

    const height = (canvas.height * width) / canvas.width;

    pdf.addImage(image, "PNG", 10, 10, width, height);

    pdf.save(`${ticket.ticketNumber}.pdf`);
  };

  // ============================================
  // PRINT
  // ============================================

  const printTicket = () => {
    const content = ticketRef.current.innerHTML;

    const win = window.open("", "", "width=900,height=700");

    win.document.write(`
      <html>
        <head>
          <title>${ticket.ticketNumber}</title>

          <style>

            body{
              font-family:Arial;
              padding:30px;
              background:#f4f4f4;
            }

            .ticket{
              border:2px dashed #333;
              border-radius:20px;
              padding:25px;
              max-width:700px;
              margin:auto;
              background:white;
            }

            h2,h3,p{
              margin:8px 0;
            }

            .header{
              text-align:center;
              margin-bottom:20px;
            }

            .section{
              display:flex;
              justify-content:space-between;
              margin:8px 0;
            }

            .footer{
              text-align:center;
              margin-top:25px;
              font-size:14px;
              color:#666;
            }

          </style>

        </head>

        <body onload="window.print();window.close();">

          <div class="ticket">
            ${content}
          </div>

        </body>

      </html>
    `);

    win.document.close();
  };

  const showDate = new Date(
    ticket.booking.schedule.showDate,
  ).toLocaleDateString();

  const showTime = new Date(
    ticket.booking.schedule.showTime,
  ).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="ticket-card border-0">
      <div className="ticket-body">
        <div ref={ticketRef}>
          {/* HEADER */}

          <div className="ticket-header">
            <h3 className="ticket-logo">🎬 CinemaHub</h3>

            <small className="ticket-subtitle">
              Official Cinema Admission Ticket
            </small>
          </div>

          <hr className="ticket-divider" />

          <h4 className="ticket-movie">
            {ticket.booking.schedule.movie.title}
          </h4>

          <div className="row mt-4">
            <div className="col-6">
              <p>
                <span className="ticket-label">Ticket Number</span>
                <span className="ticket-value">{ticket.ticketNumber}</span>
              </p>

              <p>
                <span className="ticket-label">Hall</span>
                <span className="ticket-value">
                  {ticket.booking.schedule.hall.name}
                </span>
              </p>

              <p>
                <span className="ticket-label">Seats</span>
                <span className="ticket-value">
                  {ticket.booking.seats.join(", ")}
                </span>
              </p>
              <p>
                <span className="ticket-label">Date</span>
                <span className="ticket-value"> {showDate}</span>
              </p>
            </div>

            <div className="col-6">
              <p>
                <span className="ticket-label">Time</span>
                <span className="ticket-value"> {showTime}</span>
              </p>
              <p>
                <span className="ticket-label">Amount</span>
                <span className="ticket-value">
                  {" "}
                  ₦{ticket.booking.totalAmount}
                </span>
              </p>

              <p>
                <strong>Status</strong>
                <br />

                <span
                  className={`badge ticket-status ${
                    ticket.ticketStatus === "Valid"
                      ? "bg-success"
                      : ticket.ticketStatus === "Used"
                        ? "bg-secondary"
                        : "bg-danger"
                  }`}
                >
                  {ticket.ticketStatus}
                </span>
              </p>
            </div>
          </div>

          <hr />

          {/* QR */}

          <div className="ticket-qr">
            <QRCode
              value={`${window.location.origin}/verify/${ticket._id}`}
              size={170}
            />

            <p className="ticket-note">
              Present this QR code at the cinema gate.
            </p>
          </div>
        </div>

        {/* ACTION BUTTONS */}

        <div className="ticket-actions">
          <button className="btn btn-primary w-100" onClick={downloadPDF}>
            📄 Download PDF
          </button>

          <button className="btn btn-success w-100" onClick={printTicket}>
            🖨 Print
          </button>
        </div>
      </div>
    </div>
  );
}
