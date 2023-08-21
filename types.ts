import * as z from "zod";

export const SERVER_ENDPOINT = `http://${process.env.EXPO_PUBLIC_SERVER_HOST!}:${process.env
  .EXPO_PUBLIC_SERVER_PORT!}`;

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

const ExerciseMetrics = z.object({
  setCounter: z.number().min(1).max(10),
  repCounter: z.number().min(1).max(20),
  load: ExerciseLoad,
  rest: ExerciseRest,
})
type ExerciseMetrics = z.infer<typeof ExerciseMetrics>

export const Exercise = ExerciseMetrics.extend({
  uuid: z.string().uuid(),
  name: NonEmptyString,
});
export type Exercise = z.infer<typeof Exercise>;

export const Session = z.object({
  uuid: z.string().uuid(),
  name: NonEmptyString,
  exerciseList: Exercise.array(),
});
export type Session = z.infer<typeof Session>;
export type SessionList = Session[];

export const Program = z.object({
  uuid: z.string().uuid(),
  name: NonEmptyString,
  sessionList: Session.array(),
});
export type Program = z.infer<typeof Program>;

// Http types

export const RetrieveUserProgramResponseBody = Program;
export type RetrieveUserProgramResponseBody = z.infer<
  typeof RetrieveUserProgramResponseBody
>;

export const IS_TEST = process.env.NODE_ENV == "test";

// Training

export type ExerciseTracker = {
  exerciseId: string,
  name: string,
  createdOn: string,
} & ExerciseMetrics

export interface SessionTracker {
  uuid: string,
  sessionId: string,
  name: string,
  exerciseList: Exercise[]
  exerciseRecapList: ExerciseTracker[]
  createdOn: number,
}