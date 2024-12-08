import EventHeader from "components/EventHeader";

export default function EventNestedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="mb-8 flex flex-col gap-y-8">
      <EventHeader />

      {children}
    </main>
  );
}
