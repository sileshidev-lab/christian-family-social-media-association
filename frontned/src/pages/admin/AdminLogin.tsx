import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAdminAuth } from "@/context/AdminAuthContext";

const AdminLoginPage = () => {
  const navigate = useNavigate();
  const { login, setup, hasAdmin, loading, refreshStatus } = useAdminAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSetup, setIsSetup] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    refreshStatus();
  }, [refreshStatus]);

  useEffect(() => {
    if (hasAdmin === false) setIsSetup(true);
  }, [hasAdmin]);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      if (isSetup) {
        await setup(email, password);
      } else {
        await login(email, password);
      }
      navigate("/admin/messages");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-md">
      <Card className="card-elevated">
        <CardHeader>
          <CardTitle>{isSetup ? "Admin Setup" : "Admin Login"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={onSubmit}>
            {loading ? (
              <p className="text-sm text-muted-foreground">Checking admin status...</p>
            ) : (
              <p className="text-sm text-muted-foreground">
                {isSetup
                  ? "Create the first admin account for CFSMCCA."
                  : "Sign in to manage the site content."}
              </p>
            )}
            {error && <p className="text-sm text-destructive">{error}</p>}
            <div className="space-y-2">
              <Label htmlFor="admin-email">Email</Label>
              <Input
                id="admin-email"
                type="email"
                autoComplete="username"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="admin@cfsmcca.org"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="admin-password">Password</Label>
              <Input
                id="admin-password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="••••••••"
              />
            </div>
            <Button type="submit" className="w-full" disabled={submitting || loading}>
              {submitting ? "Please wait..." : isSetup ? "Create Admin" : "Continue to Dashboard"}
            </Button>
            {hasAdmin && (
              <Button
                type="button"
                variant="ghost"
                className="w-full"
                onClick={() => setIsSetup((prev) => !prev)}
              >
                {isSetup ? "I already have an account" : "First time setup"}
              </Button>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLoginPage;
