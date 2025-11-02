export default async function PlayerPage({ params }: { params: { lang: string } }) {
  const { lang } = await params;

  return <main className="">player</main>;
}
