import React from "react";

export default function AuthLayout({ icon: Icon, title, subtitle, footer, children }) {
  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ backgroundColor: "var(--bg)" }}
    >
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div
            className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4"
            style={{ backgroundColor: "var(--green-dark)" }}
          >
            <Icon className="w-7 h-7 text-white" aria-hidden="true" />
          </div>
          <h1
            className="text-3xl font-bold tracking-tight"
            style={{ fontFamily: "'Poppins', sans-serif", color: "var(--text)" }}
          >
            {title}
          </h1>
          {subtitle && (
            <p className="mt-2" style={{ color: "var(--text-light)" }}>
              {subtitle}
            </p>
          )}
        </div>

        <div
          className="p-8"
          style={{
            backgroundColor: "var(--white)",
            borderRadius: "var(--radius)",
            border: "1px solid var(--border)",
            boxShadow: "var(--shadow)",
          }}
        >
          {children}
        </div>

        {footer && (
          <p
            className="text-center text-sm mt-6"
            style={{ color: "var(--text-light)" }}
          >
            {footer}
          </p>
        )}
      </div>
    </div>
  );
}