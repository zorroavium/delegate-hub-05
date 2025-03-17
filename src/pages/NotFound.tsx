
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      <div className="max-w-md w-full text-center">
        <h1 className="text-6xl font-bold mb-6 text-primary">404</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-6">
          Oops! We couldn't find the page you're looking for.
        </p>
        <p className="text-md text-gray-500 dark:text-gray-500 mb-8">
          The page at <span className="font-medium">{location.pathname}</span> might have been moved or deleted.
        </p>
        <Link to="/">
          <Button className="gap-2">
            <ArrowLeft size={16} />
            Return to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
