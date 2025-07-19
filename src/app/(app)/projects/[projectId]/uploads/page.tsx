"use client";
import { useParams } from "next/navigation";

export default function ProjectUploadsPage() {
  const params = useParams();
  const projectId = params.projectId as string;
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-2">Project Uploads</h1>
      <p className="text-gray-600">Project ID: {projectId}</p>
    </div>
  );
} 