import { getTranslations } from "next-intl/server";
import { LearnLoading } from "@/components/learn/LearnLoading";

export default async function Loading() {
  const t = await getTranslations("Learn");
  return <LearnLoading label={t("loadingClass")} />;
}
