import Link from "next/link";

export default async function PodcastPage({ params }: { params: { lang: string } }) {
  const { lang } = await params;
  
  return (
    <main className="">
      <Link href={`/${lang}/player?episode=123`}>to an episode</Link>
    </main>
  );
}
