import React from "react";

const sizeMap = {
  sm: "w-7 h-7 text-[11px]",
  md: "w-9 h-9 text-xs",
  lg: "w-16 h-16 text-xl",
};

export default function UserAvatar({ user, size = "md" }) {
  const name = user?.nome || user?.full_name || user?.email || "?";
  const initials = name.charAt(0).toUpperCase();

  if (user?.foto_url) {
    return (
      <img
        src={user.foto_url}
        alt={name}
        className={`${sizeMap[size]} rounded-full object-cover shrink-0`}
      />
    );
  }

  return (
    <div
      className={`${sizeMap[size]} rounded-full flex items-center justify-center font-semibold shrink-0`}
      style={{
        background: "hsl(var(--primary) / 0.15)",
        color: "hsl(var(--primary))",
      }}
    >
      {initials}
    </div>
  );
}