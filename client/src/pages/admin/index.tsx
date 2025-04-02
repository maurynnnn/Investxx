import { useEffect } from "react";
import { Redirect } from "wouter";

export default function AdminIndex() {
  return <Redirect to="/admin/dashboard" />;
}