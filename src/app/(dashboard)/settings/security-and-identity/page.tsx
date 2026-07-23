import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function SecurityIdentityPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Security & Identity</h1>
        <p className="text-sm text-muted-foreground">
          Manage authentication and security settings
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="p-6">
          <h3 className="font-medium">Single Sign-On (SSO)</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Configure SAML or OIDC SSO for your organization
          </p>
          <Button variant="outline" size="sm" className="mt-4">
            Configure
          </Button>
        </Card>
        <Card className="p-6">
          <h3 className="font-medium">Provisioning</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Set up SCIM provisioning for automated user management
          </p>
          <Button variant="outline" size="sm" className="mt-4">
            Configure
          </Button>
        </Card>
      </div>
    </div>
  );
}
