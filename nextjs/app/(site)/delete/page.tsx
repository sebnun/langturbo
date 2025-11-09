export const metadata = {
  title: "Request account termination - LangTurbo",
};

export default async function Delete() {
  return (
    <main className="flex flex-col flex-1 justify-center rounded-lg bg-colorscreenbackground">
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl text-center mb-6 font-proza">
        Request Account Termination
      </h1>
      <article className="ml-auto mr-auto space-y-4 text-center mt-4 px-4 max-w-lg">
        <p>
          Send us an email to{" "}
          <span className="underline">
            contact [at] langturbo [dot] com
          </span>{" "}
          from the same email address that you used to register your account.
        </p>
        {/* <ErrorTest /> */}
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
