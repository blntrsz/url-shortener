import { prisma } from "@utils/prisma";
import { z } from "zod";
import { createRouter } from "../createRouter";

export const link = createRouter()
  .mutation("create", {
    input: z.object({
      slug: z.string(),
      url: z.string(),
    }),
    async resolve({ input }) {
      try {
        await prisma.link.create({
          data: {
            ...input,
          },
        });
      } catch (e) {
        console.log(e);
      }
    },
  })
  .query("is-available", {
    input: z.object({
      slug: z.string(),
    }),
    async resolve({ input: { slug } }) {
      const firstSlug = await prisma.link.findFirst({
        where: {
          slug,
        },
      });

      return {
        isAvailable: !firstSlug,
      };
    },
  })
  .query("get-link-for-slug", {
    input: z.object({
      slug: z.string(),
    }),
    async resolve({ input: { slug } }) {
      try {
        const link = await prisma.link.findFirst({
          where: {
            slug,
          },
        });

        return {
          url: link?.url,
        };
      } catch (e) {
        return {};
      }
    },
  });
