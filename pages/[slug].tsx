import { trpc } from "@utils/trpc";
import Router, { useRouter } from "next/router";

export default function SlugHandler() {
  const router = useRouter();
  const link = trpc.useQuery([
    "link.get-link-for-slug",
    {
      slug: typeof router.query.slug === "string" ? router.query.slug : "",
    },
  ]);

  if (link.isFetched) {
    if (link.data?.url) {
      Router.replace(link.data.url);
    } else {
      Router.push("/");
    }
  }

  return <></>;
}
