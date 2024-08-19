import React from "react";
import Alert from "react-bootstrap/Alert";

interface AlertBannerProps {
  message?: string | null;
  variant?: string | null;
}

export default function AlertBanner({ message, variant }: AlertBannerProps) {
  const alertMessage =
    message ?? "An unexpected error occurred. Please try again later.";
  const alertVariant = variant ?? "danger";

  return (
    <Alert variant={alertVariant} style={{ backgroundColor: "red" }}>
      {alertMessage}
    </Alert>
  );
}
