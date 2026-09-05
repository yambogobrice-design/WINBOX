"use client"
import React from "react";

interface UserProps {
  img: string;
  name: string;
  width?: number;
}

const User: React.FC<UserProps> = ({ img, name, width = 200 }) => {
  return (
    <section>
      <img src={img} alt={name} width={width} />
    </section>
  );
};

export default User;