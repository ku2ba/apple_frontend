import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";
import { Button } from "@/components/ui/button";

export function CtaSection() {
  return (
    <Section className="py-16 sm:py-24">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <Heading level={2}>Call to action</Heading>
          <Text size="lg" className="mt-4">
            CTA description placeholder. Replace with content from Figma.
          </Text>
          <div className="mt-8">
            <Button>Get started</Button>
          </div>
        </div>
      </Container>
    </Section>
  );
}
