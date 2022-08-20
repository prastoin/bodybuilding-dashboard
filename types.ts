import z from "zod";

export const SERVER_ENDPOINT = `http://${process.env.SERVER_HOST!}:${process.env
  .SERVER_PORT!}`;

export const NonEmptyString = z.string().min(1);

export const MinuteSecondDuration = z.number().min(0).max(59);
export type MinuteSecondDuration = z.infer<typeof MinuteSecondDuration>;

export const LoadUnit = z.enum(["lbs", "kg"]);
export type LoadUnit = z.infer<typeof LoadUnit>;

export const ExerciseLoad = z.object({
  unit: LoadUnit,
  value: z.number().positive(),
});
export type ExerciseLoad = z.infer<typeof ExerciseLoad>;

export const ExerciseRest = z.object({
  minute: MinuteSecondDuration,
  second: MinuteSecondDuration,
});
export type ExerciseRest = z.infer<typeof ExerciseRest>;

export const TrainingSessionExercise = z.object({
  uuid: z.string().uuid(),
  exerciseName: NonEmptyString,
  setCounter: z.number().min(1).max(10),
  repCounter: z.number().min(1).max(20),
  load: ExerciseLoad,
  rest: ExerciseRest,
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
