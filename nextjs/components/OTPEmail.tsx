import { Body, Container, Head, Heading, Html, Img, Link, Preview, render, Text } from "@react-email/components";

interface OTPEmailProps {
  otp?: string;
}

const baseUrl = `https://www.langturbo.com`;

const OTPEmail = ({ otp }: OTPEmailProps) => (
  <Html>
    <Head />
    <Preview>LangTurbo Verification Code</Preview>
    <Body style={main}>
      <Container style={container}>
        <Img style={img} src={`${baseUrl}/images/email.png`} width="64" height="64" alt="Langturbo's Logo" />
        <Heading style={h1}>Verification Code</Heading>
        <Text style={{ ...text, marginBottom: "14px" }}>Copy and paste this code in LangTurbo:</Text>
        <code style={code}>{otp}</code>
        <Text
          style={{
            ...text,
            color: "#ababab",
            marginTop: "14px",
            marginBottom: "16px",
          }}
        >
          The code expires in 5 minutes.
        </Text>
        <Text
          style={{
            ...text,
            color: "#ababab",
            marginTop: "14px",
            marginBottom: "16px",
          }}
        >
          If you didn&apos;t try to sign in, you can safely ignore this email.
        </Text>
      </Container>
    </Body>
  </Html>
);

OTPEmail.PreviewProps = {
  otp: "568490",
} as OTPEmailProps;

export default OTPEmail;

const main = {
  backgroundColor: "#ffffff",
};

const container = {
  paddingLeft: "12px",
  paddingRight: "12px",
  margin: "0 auto",
};

const h1 = {
  color: "#333",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: "24px",
  fontWeight: "bold",
  margin: "40px 0",
  padding: "0",
  textAlign: "center" as const,
};

const text = {
  color: "#333",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: "14px",
  margin: "24px 0",
  textAlign: "center" as const,
};

const code = {
  display: "inline-block",
  padding: "16px 4.5%",
  width: "90.5%",
  backgroundColor: "#f4f4f4",
  borderRadius: "5px",
  border: "1px solid #eee",
  color: "#333",
  textAlign: "center" as const,
  fontSize: "24px",
  fontWeight: "bold",
};

const img = {
  margin: "40px auto",
};

// Need to export it here due to ts issues
export const getHtml = async (otp: string) => await render(<OTPEmail otp={otp} />);
