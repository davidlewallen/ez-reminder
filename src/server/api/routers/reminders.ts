import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const remindersRouter = createTRPCRouter({
  add: protectedProcedure
    .input(
      z.object({
        text: z.string(),
      })
    )
    .mutation(({ ctx, input }) =>
      ctx.prisma.user.update({
        where: {
          id: ctx.session.user.id,
        },
        data: {
          reminders: {
            create: {
              text: input.text,
            },
          },
        },
      })
    ),
  getById: protectedProcedure.input(z.string()).query(({ ctx, input }) =>
    ctx.prisma.reminder.findFirst({
      where: {
        id: input,
      },
    })
  ),
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const reminders = await ctx.prisma.user.findFirst({
      where: {
        id: ctx.session.user.id,
      },
      select: {
        reminders: true,
      },
    });

    return reminders?.reminders ?? [];
  }),
  complete: protectedProcedure.input(z.string()).mutation(({ ctx, input }) =>
    ctx.prisma.reminder.update({
      where: {
        id: input,
      },
      data: {
        completed: true,
        completedAt: new Date(),
      },
    })
  ),
  delete: protectedProcedure.input(z.string()).mutation(({ ctx, input }) =>
    ctx.prisma.reminder.delete({
      where: {
        id: input,
      },
    })
  ),
});
