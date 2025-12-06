export const metadata = {
  title: "Request account termination - LangTurbo",
};

export default async function Delete() {
  return (
    <main className="max-w-6xl mx-auto p-6">
      <h1 className="font-cormorant-garamond scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl my-6">
        Request Account Termination
      </h1>
      <article className="prose prose-invert max-w-none py-12">
        <p>
          Send us an email to <span className="underline">contact [at] langturbo [dot] com</span> from the same email
          address that you used to register your account.
        </p>
        <p>
          See our terms and conditions and privacy policy to learn about the data that is retained and the data
          retention period.
        </p>
        <p>
          You can also request to have your data deleted by simply deleting your account on the iOS, Android or web app.
        </p>
      </article>
    </main>
  );
}
