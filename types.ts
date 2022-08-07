import z from "zod";

export const NonEmptyString = z.string().min(1);

export const TrainingSessionExercise = z.object({
  uuid: z.string().uuid(),
  exerciseName: NonEmptyString,
});
export type TrainingSessionExercise = z.infer<typeof TrainingSessionExercise>;

export const TrainingSession = z.object({
  uuid: z.string().uuid(),
  trainingSessionName: NonEmptyString,
  exercises: TrainingSessionExercise.array(),
});
export type TrainingSession = z.infer<typeof TrainingSession>;
export type TrainingSessionCollection = TrainingSession[];

export const TrainingProgram = z.object({
  uuid: z.string().uuid(),
  programName: NonEmptyString,
  trainingSessions: TrainingSession.array(),
});
export type BodybuildingProgram = z.infer<typeof TrainingProgram>;
