import { Hero } from "@/components/sections/Hero";
import { ValueProp } from "@/components/sections/ValueProp";
import { LatestIssue } from "@/components/sections/LatestIssue";
import { TrendShowcase } from "@/components/sections/TrendShowcase";
import { Manifesto } from "@/components/sections/Manifesto";
import { SocialProof } from "@/components/sections/SocialProof";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { JsonLd } from "@/components/JsonLd";
import { organizationSchema, websiteSchema } from "@/lib/jsonld";

export default function HomePage() {
  return (
    <>
      <JsonLd data={organizationSchema()} />
      <JsonLd data={websiteSchema()} />
      <Hero />
      <ValueProp />
      <LatestIssue />
      <TrendShowcase />
      <Manifesto />
      <SocialProof />
      <FinalCTA />
    </>
  );
}
