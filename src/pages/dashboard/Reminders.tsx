        {reminders
          ?.sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1))
          .sort((a, b) =>
            (a?.completedAt ?? 0) > (b?.completedAt ?? 0) ? -1 : 1
          )
          .sort((a, b) => (a.completed ? 1 : b.completed ? -1 : 0))
