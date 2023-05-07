import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const utilityRouter = createTRPCRouter({
  currentTime: protectedProcedure.query(() => new Date()),
});
