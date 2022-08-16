import z from "zod";

export const NonEmptyString = z.string().min(1);

export const TrainingSessionExercise = z.object({
  uuid: z.string().uuid(),
  exerciseName: NonEmptyString,
  setCounter: z.number().min(1).max(10),
  repCounter: z.number().min(1).max(20),
});
export type TrainingSessionExercise = z.infer<typeof TrainingSessionExercise>;

export const TrainingSession = z.object({
  uuid: z.string().uuid(),
  trainingSessionName: NonEmptyString,
  exercises: TrainingSessionExercise.array(),
});
export type TrainingSession = z.infer<typeof TrainingSession>;
export type TrainingSessionCollection = TrainingSession[];

export const BodybuildingProgram = z.object({
  uuid: z.string().uuid(),
  programName: NonEmptyString,
  trainingSessions: TrainingSession.array(),
});
export type BodybuildingProgram = z.infer<typeof BodybuildingProgram>;

// Http types

export const RetrieveUserBodyBuildingProgramResponseBody = BodybuildingProgram;
export type RetrieveUserBodyBuildingProgramResponseBody = z.infer<
  typeof RetrieveUserBodyBuildingProgramResponseBody
>;

export const IS_TEST = process.env.NODE_ENV;
