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
                <Text className="text-3xl font-bold">
                  {title}
                </Text>
                <Hr />
                <div dangerouslySetInnerHTML={{ __html: content }}/>
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
