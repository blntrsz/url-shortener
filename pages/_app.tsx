import { withTRPC } from "@trpc/next";
import { AppType } from "next/dist/shared/lib/utils";
import { AppRouter } from "./api/trpc/[trpc]";
import "../styles/globals.css";
import { trpc } from "@utils/trpc";
import { useRouter } from "next/router";

const MyApp: AppType = ({ Component, pageProps }) => {
  return <Component className="bg-zinc-800" {...pageProps} />;
};

export default withTRPC<AppRouter>({
  config: ({ ctx }) => ({
    url: "/api/trpc",
  }),
  ssr: false,
})(MyApp);
