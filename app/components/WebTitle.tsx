import Head from "expo-router/head";

export default function WebTitle({ title }: { title: string }) {
  return (
    <Head>
      <title>{title} | LangTurbo</title>
    </Head>
  );
}
