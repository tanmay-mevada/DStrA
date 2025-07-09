// src/app/programs/[id]/page.tsx
export default function ProgramDetailPage({ params }: { params: { id: string } }) {
  return <div>Program ID: {params.id}</div>;
}