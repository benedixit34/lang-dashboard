import { useState } from "react";
import Card from "../ui/Card";
import { SectionHeader, PrimaryButton } from "../ui/SectionHeader";
import { Field } from "../ui/Drawer";

export default function SettingsSection() {
  const [workspaceName, setWorkspaceName] = useState("City Language");
  const [defaultLanguage, setDefaultLanguage] = useState("German");
  const [supportEmail, setSupportEmail] = useState("support@citylanguage.app");

  const handleSave = () => {
    // Add your API/save logic here
    console.log({
      workspaceName,
      defaultLanguage,
      supportEmail,
    });
  };

  return (
    <div>
      <SectionHeader
        title="Settings"
        description="General configuration for the workspace."
      />

      <Card className="max-w-lg p-5">
        <div className="space-y-4">
          <Field
            label="Workspace name"
            type="text"
            placeholder="City Language"
            value={workspaceName}
            
          />

          <Field
            label="Default language"
            type="select"
            options={["German", "English", "French", "Spanish"]}
            value={defaultLanguage}
          />

          <Field
            label="Support email"
            type="text"
            placeholder="support@citylanguage.app"
            value={supportEmail}
          />
        </div>

        <div className="mt-5 flex justify-end">
          <PrimaryButton onClick={handleSave}>
            Save changes
          </PrimaryButton>
        </div>
      </Card>
    </div>
  );
}