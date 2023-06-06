import { Box, Text } from "@saleor/macaw-ui/next";
import Image from "next/image";
import { ProviderName } from "../providers-configuration/providers-config";
import { TaxJarIcon, AvataxIcon, StripeTaxIcon } from "../../assets";

type ProviderNameWithStripeTax = ProviderName | "stripeTax";

const providerConfig = {
  taxjar: {
    label: "TaxJar",
    icon: TaxJarIcon,
  },
  avatax: {
    label: "Avatax",
    icon: AvataxIcon,
  },
  stripeTax: {
    label: "Stripe Tax",
    icon: StripeTaxIcon,
  },
} satisfies Record<
  ProviderNameWithStripeTax,
  {
    label: string;
    icon: string;
  }
>;

export const ProviderLabel = ({ name }: { name: ProviderNameWithStripeTax }) => {
  const { label, icon } = providerConfig[name];

  return (
    <Box alignItems={"center"} display={"flex"} gap={6}>
      <Image src={icon} width={20} height={20} alt={`provider icon`} />
      <Text variant="bodyStrong">{label}</Text>
    </Box>
  );
};