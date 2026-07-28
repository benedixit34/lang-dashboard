
import { Plus } from "lucide-react";
import Card from "../ui/Card";
import { SectionHeader, PrimaryButton } from "../ui/SectionHeader";
import { Th, Td, Row, RowMenu } from "../ui/Table";
import { Dot } from "../ui/Badges";
import { CITIES } from "../../data/mockData";

export default function Cities({ onCreate }: { onCreate: () => void }) {
  return (
    <div>
      <SectionHeader
        title="Cities"
        description="Cities are the levels learners progress through."
        action={
          <PrimaryButton onClick={onCreate}>
            <Plus size={14} /> Create city
          </PrimaryButton>
        }
      />
      <Card>
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <Th>City</Th>
              <Th>Country</Th>
              <Th>Level</Th>
              <Th>Words</Th>
              <Th>Status</Th>
              <Th className="w-10"></Th>
            </tr>
          </thead>
          <tbody>
            {CITIES.map((c) => (
              <Row key={c.id}>
                <Td className="font-medium text-neutral-900">{c.name}</Td>
                <Td className="text-neutral-500">{c.country}</Td>
                <Td className="text-neutral-500">Level {c.level}</Td>
                <Td className="text-neutral-500">{c.words}</Td>
                <Td><Dot status={c.status} /></Td>
                <Td><RowMenu /></Td>
              </Row>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}