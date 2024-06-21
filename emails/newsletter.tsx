import {
  Body,
  Container,
  Column,
  Head,
  Hr,
  Html,
  Row,
  Section,
  Text,
  Markdown,
  Tailwind
} from "@react-email/components";

export interface NewsLetterMail {
  title: string;
  content: string;
}

const DarkNewsletterEmail = ({ title, content }: NewsLetterMail) => {
  return (
    <Html lang="en" dir="ltr">
      <Tailwind>
      <Head>
        <title>{title}</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <Body>
        <Container>
          <Section>
            <Row>
              <Column>
                <Text className="text-3xl font-bold text-gray-100">
                  {title}
                </Text>
                <Hr />
                <Markdown
                  markdownCustomStyles={{
                    h1: { color: "#f0f0f0" },
                    h2: { color: "c0c0c0" },
                    codeInline: { background: "grey" },
                  }}
                  markdownContainerStyles={{
                    padding: "12px",
                    border: "solid 1px black",
                  }}
                >
                  {content}
                </Markdown>
              </Column>
            </Row>
          </Section>
        </Container>
      </Body>
    </Tailwind>
    </Html>
  );
};

export default DarkNewsletterEmail;
