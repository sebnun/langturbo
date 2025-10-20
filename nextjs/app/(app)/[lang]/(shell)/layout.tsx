import Link from "next/link";

export default async function ShellLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: { lang: string };
}>) {
  const { lang } = await params;

  return (
    <>
      <p>search and saved layout</p>
      <p>
        <Link href={`/${lang}/podcast?id=345345`}>A saved podcast</Link>
      </p>
      {children}
    </>
  );
}
