"use client";

import AuthHeader from "./AuthHeader";

export default function AuthLayout({ children }) {
  return (
    <section className="auth-wrapper">
      <div className="container">
        <div className="row auth-containe rounded-3 shadow-lg">
          {/* Left */}

          <div className="col-lg-5 d-none d-lg-flex auth-left">
            <AuthHeader />
          </div>

          {/* Right */}

          <div className="col-lg-7 col-12 auth-right">
            <div className="auth-form-card">{children}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
