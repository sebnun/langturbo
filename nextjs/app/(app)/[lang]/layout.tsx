import Nav from "@/components/shell/Nav";

export default async function AppLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  return (
    <>
      <Nav lang={lang} />
      {children}
    </>
  );
}
