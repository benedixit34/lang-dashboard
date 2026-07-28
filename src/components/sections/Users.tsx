import Card from "../ui/Card";
import { SectionHeader } from "../ui/SectionHeader";
import { Th, Td, Row } from "../ui/Table";
import { USERS } from "../../data/mockData";

export default function UsersSection() {
  return (
    <div>
      <SectionHeader
        title="Users"
        description="Learners and their progress through the cities."
      />

      <Card>
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <Th>Name</Th>
              <Th>Email</Th>
              <Th>Completed cities</Th>
              <Th>Progress</Th>
              <Th>Joined</Th>
            </tr>
          </thead>

          <tbody>
            {USERS.map((u) => (
              <Row key={u.id}>
                <Td className="font-medium text-neutral-900">
                  {u.name}
                </Td>

                <Td className="text-neutral-500">
                  {u.email}
                </Td>

                <Td className="text-neutral-500">
                  {u.completed}
                </Td>

                <Td>
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-24 rounded-full bg-neutral-100">
                      <div
                        className="h-1.5 rounded-full bg-neutral-900"
                        style={{ width: `${u.progress}%` }}
                      />
                    </div>

                    <span className="text-[12px] text-neutral-500">
                      {u.progress}%
                    </span>
                  </div>
                </Td>

                <Td className="text-neutral-500">
                  {u.joined}
                </Td>
              </Row>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}