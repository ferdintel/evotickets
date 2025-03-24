import ProtectedLayout from "@/components/ProtectedLayout";
import EventHeader from "components/EventHeader";

export default function EventNestedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ProtectedLayout>
      <main className="mb-8 h-full flex flex-col gap-y-8">
        <EventHeader />

        {children}
      </main>
    </ProtectedLayout>
  );
}
