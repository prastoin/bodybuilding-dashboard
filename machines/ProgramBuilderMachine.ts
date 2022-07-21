import { createMachine } from "xstate";

export const createProgramBuilderMachine = () =>
  createMachine({
    tsTypes: {} as import("./ProgramBuilderMachine.typegen").Typegen0,
    id: "promise",
    initial: "pending",
    states: {
      pending: {
        on: {
          RESOLVE: { target: "resolved" },
          REJECT: { target: "rejected" },
        },
      },
      resolved: {
        type: "final",
      },
      rejected: {
        type: "final",
      },
    },
  });
