"use client";

import Link from "next/link";
import React from "react";

export default function NotFound() {
  return (
    <section
      id="not-found"
      className="not-found w-100 vh-100 d-flex flex-column justify-content-center align-items-center text-center"
    >
      <div className="container">
        {/* Big Emoji */}
        <div className="emoji">😂😵‍💫🤯</div>

        {/* Heading */}
        <h1 className="oops-title">Oooops...!!!</h1>
        <h4 className="oops-subtitle">
          You just unlocked a secret level… but it&apos;s under construction 🚧👷
        </h4>

        {/* Fun Message */}
        <p className="funny-text">
          Seems like you took a wrong turn at the Internet highway 🛣️😵 <br />
          Don’t panic! Even Google Maps can’t find this page. 🗺️🤣
        </p>

        {/* Link Back */}
        <Link href="/" className="btn-back-home">
          ⬅️ Beam Me Back to Main Dashboard 🎮
        </Link>

        {/* Extra Funny Footer */}
        <p className="mt-3 small ">
          (Our developer might be busy debugging 🐛, eating 🍕, or enjoying a ☕
          power-up... Please forgive him 🤓💻)
        </p>
      </div>
    </section>
  );
}
