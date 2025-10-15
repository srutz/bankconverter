import { Link } from "@tanstack/react-router";
import { Button } from "../ui/button";
import { H2 } from "./H2";

export function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-center space-y-4">
      <H2>404 - Page Not Found</H2>
      <p className="text-muted-foreground max-w-md">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Button asChild>
        <Link to="/">Go back home</Link>
      </Button>
    </div>
  );
}
