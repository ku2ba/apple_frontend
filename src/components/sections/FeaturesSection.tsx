import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";

export function FeaturesSection() {
  return (
    <Section id="features" className="py-16 sm:py-24 bg-neutral-50">
      <Container>
        <Heading level={2} className="text-center mb-12">
          Features
        </Heading>
        <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <li key={i}>
              <Heading level={4}>Feature {i}</Heading>
              <Text size="sm" className="mt-2">
                Feature description placeholder. Update from Figma.
              </Text>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
