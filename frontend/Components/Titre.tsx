"use client";

import React from "react";

interface UserProps {
  titre: string;
  width?: number;
  fontSize?: number;
  className?: string;
}

const User: React.FC<UserProps> = ({ titre, fontSize = 16, className = "" }) => {
  const titleClassName = `font-bold tracking-tight ${
    className || "text-base-content"
  }`;

  return (
    <section className="w-full text-center">
      <h1
        className={titleClassName}
        style={{ fontSize: `${fontSize}px` }}
      >
        {titre}
      </h1>
    </section>
  );
};

export default User;
