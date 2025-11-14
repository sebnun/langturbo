import Link from "next/link";

export const metadata = {
  title: "Contact - LangTurbo",
};

export default async function Contact() {
  return (
    <main className="max-w-6xl mx-auto p-6">
      <h1 className="font-old-standard-tt scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl my-6">Contact</h1>
      <article className="py-12">
        <p>Your feedback and questions are always welcome!</p>
        <div>
          Send an email to contact [at] langturbo [dot] com, or on X at{" "}
          <Link className="underline" href="https://twitter.com/LangTurbo">
            @LangTurbo
          </Link>
          .
        </div>
      </article>
    </main>
  );
}
