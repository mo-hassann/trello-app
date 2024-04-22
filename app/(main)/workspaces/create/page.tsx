import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import CreateWorkspaceFrom from "./_components/create-workspace-form";

export default function CreateWorkSpacePage() {
  return (
    <div className="flex items-center justify-center h-full">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle className="capitalize">create new workspace</CardTitle>
          <CardDescription>create a new workspace with name</CardDescription>
        </CardHeader>
        <CardContent>
          <CreateWorkspaceFrom />
        </CardContent>
      </Card>
    </div>
  );
}
