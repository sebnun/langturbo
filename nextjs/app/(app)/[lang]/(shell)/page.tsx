export default async function ShellPage({ params }: { params: { lang: string } }) {
  const { lang } = await params;

  return <main className="">{lang} discovery home</main>;
}
