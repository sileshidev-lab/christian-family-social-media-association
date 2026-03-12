import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const NotFoundPage = () => {
  return (
    <section className="container section-padding text-center">
      <h1 className="section-title text-4xl">404</h1>
      <p className="text-muted-foreground">The page you requested could not be found.</p>
      <Button asChild className="mt-4">
        <Link to="/">Back to Home</Link>
      </Button>
    </section>
  );
};

export default NotFoundPage;
