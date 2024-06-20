import {
    Body,
    Container,
    Column,
    Head,
    Hr,
    Html,
    Img,
    Link,
    Preview,
    Row,
    Section,
    Text,
  } from "@react-email/components";

export interface NewsLetterMail {
  title: string;
  content: string;
}
  const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "";
  export const DarkNewsletterEmail = ({title, content}: NewsLetterMail) => (
    <Html>
      <Head />
      <Preview>Dark-themed Newsletter</Preview>
      <Body className="bg-gray-900 text-white font-sans">
        <Container className="max-w-4xl mx-auto">
          <Section>
            <Row>
              <Column>
                <Text className="text-2xl font-bold text-green-400">{title}</Text>
              </Column>
            </Row>
          </Section>
  
          <Section className="py-4">
            <Hr className="border-gray-600" />
            <Text className="text-xl font-bold text-green-400">NEWSLETTER UPDATE</Text>
            <Text className="text-lg">Hello Subscribers,</Text>
            <Text className="text-lg">
              I am pleased to share the latest updates with you.
            </Text>
            <Text className="text-lg">
              Here are some highlights from this month:
            </Text>
          </Section>
          <Section className="pl-8">
               {content}
          </Section>
          <Section className="py-4">
            <Text className="text-lg">
              Stay tuned for more updates in our next newsletter.
            </Text>
            <Hr className="border-gray-600" />
          </Section>
  
          <Section className="py-4">
            <Text className="text-lg">Best regards,</Text>
            <Text className="text-3xl font-bold">Your Organization</Text>
          </Section>
  
          <Section className="bg-gray-800 rounded-lg overflow-hidden">
            <Row>
              <Text className="text-lg p-4">Connect with us:</Text>
            </Row>
            <Row className="flex">
              <Column className="pr-2">
                <Link href="https://example.com">
                  <Img
                    className="w-10 h-10"
                    src={`${baseUrl}/static/twitter-icon.png`}
                    alt="Twitter"
                  />
                </Link>
              </Column>
              <Column className="pr-2">
                <Link href="https://example.com">
                  <Img
                    className="w-10 h-10"
                    src={`${baseUrl}/static/facebook-icon.png`}
                    alt="Facebook"
                  />
                </Link>
              </Column>
              <Column className="pr-2">
                <Link href="https://example.com">
                  <Img
                    className="w-10 h-10"
                    src={`${baseUrl}/static/linkedin-icon.png`}
                    alt="LinkedIn"
                  />
                </Link>
              </Column>
            </Row>
            <Row>
              <Img
                className="w-full"
                src={`${baseUrl}/static/dark-theme-footer.png`}
                alt="Footer"
              />
            </Row>
          </Section>
  
          <Section className="py-4">
            <Text className="text-sm text-center">
              &copy; {new Date().getFullYear()} All rights reserved.
            </Text>
            <Text className="text-sm text-center">
              You are receiving this email because you subscribed to our newsletter.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
  
  export default DarkNewsletterEmail;
  