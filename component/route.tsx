"use client";

import { useRouter, redirect } from "next/navigation";

interface Props {
  message: string;
  path: string;
  className: string;
}

const Route = ({ message, path, className }: Props) => {
  const route = useRouter();
  return (
    <button onClick={() => route.push(path)} className={className}>
      {message}
    </button>
  );
};
const Redirect = ({ message, path, className }: Props) => {
  return (
    <button onClick={() => redirect(path)} className={className}>
      {message}
    </button>
  );
};

export { Route, Redirect };
