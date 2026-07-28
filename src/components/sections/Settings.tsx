import React from "react";
import Card from "../ui/Card";
import { SectionHeader, PrimaryButton } from "../ui/SectionHeader";
import { Field } from "../ui/Drawer";

export default function SettingsSection() {
  return (
    <div>
      <SectionHeader title="Settings" description="General configuration for the workspace." />
      <Card className="max-w-lg p-5">
        <div className="space-y-4">
          <Field label="Workspace name" placeholder="City Language" />
          <Field label="Default language" placeholder="German" />
          <Field label="Support email" placeholder="support@citylanguage.app" />
        </div>
        <div className="mt-5 flex justify-end">
          <PrimaryButton>Save changes</PrimaryButton>
        </div>
      </Card>
    </div>
  );
}
