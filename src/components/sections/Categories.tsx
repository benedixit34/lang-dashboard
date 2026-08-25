import { Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import Card from "../ui/Card";
import {
  SectionHeader,
  PrimaryButton,
} from "../ui/SectionHeader";
import {
  Th,
  Td,
  Row,
  RowMenu,
} from "../ui/Table";

import { getCategories } from "../../data/api";

interface CategoriesProps {
  onCreate: () => void;
}

export default function Categories({
  onCreate,
}: CategoriesProps) {
  const {
    data: categories = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });
console.log(categories)
  return (
    <div>
      <SectionHeader
        title="Categories"
        description="Categories organize vocabulary into meaningful groups."
        action={
          <PrimaryButton onClick={onCreate}>
            <Plus size={14} />
            Create category
          </PrimaryButton>
        }
      />

      <Card>
        {isLoading && (
          <div className="p-6 text-sm text-neutral-500">
            Loading categories...
          </div>
        )}

        {isError && (
          <div className="p-6 text-sm text-red-500">
            {error instanceof Error
              ? error.message
              : "Failed to load categories."}
          </div>
        )}

        {!isLoading &&
          !isError &&
          categories.length === 0 && (
            <div className="p-6 text-sm text-neutral-500">
              No categories found.
            </div>
          )}

        {!isLoading &&
          !isError &&
          categories.length > 0 && (
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <Th>Category</Th>
                  <Th className="w-10"></Th>
                </tr>
              </thead>

              <tbody>
                {categories.map((category) => (
                  <Row key={category.id}>
                    <Td className="font-medium text-neutral-900">
                      {category.name}
                    </Td>

                    <Td>
                      <RowMenu />
                    </Td>
                  </Row>
                ))}
              </tbody>
            </table>
          )}
      </Card>
    </div>
  );
}