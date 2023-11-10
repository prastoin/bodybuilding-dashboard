import * as z from "zod";

const MUSCLES = [
  "Chest",
  "Biceps",
  "Deltoid",
  "Calves",
  "Adductor",
  "Abductor",
  "Glutes",
  "Harmstring", //Should create map and not array, this way could contain more information such as Deltoid : rear posterior middle etc same with back and more
  "Quadriceps",
  "Triceps",
  "Lats",
  "Trapeze",
  "Forearm",
  "Abs",
  "Back" //Quite generic should be replaced using precise muscle groups
] as const;

const Muscle = z.enum(MUSCLES);
type Muscle = z.infer<typeof Muscle>;

export const SERVER_ENDPOINT = `http://${process.env
  .EXPO_PUBLIC_SERVER_HOST!}:${process.env.EXPO_PUBLIC_SERVER_PORT!}`;

export const NonEmptyString = z.string().min(1);

export const LoadUnit = z.enum(["lbs", "kg"]);
export type LoadUnit = z.infer<typeof LoadUnit>;

export const Seconds = z.number();
export type Seconds = z.infer<typeof Seconds>;

export const Kilograms = z.number();
export type Kilograms = z.infer<typeof Kilograms>;

export const ExerciseMetrics = z.object({
  set: z.number().min(1).max(10),
  rep: z.number().min(1).max(20),
  // Load by default is in kg, should add a setting to show load in Lbs
  load: Kilograms,
  // Rest is in seconds
  rest: Seconds,
  targetMuscle: Muscle.array(),
});
export type ExerciseMetrics = z.infer<typeof ExerciseMetrics>;

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
export const SetTracker = z.object({
  rir: z.number(),
  rep: z.number(),
  index: z.number(),
  load: z.number(),
  rest: z.number(),
});
export type SetTracker = z.infer<typeof SetTracker>;

export const ExerciseTracker = z.object({
  exerciseId: z.string().uuid(),
  name: z.string(),
  expectedMetrics: ExerciseMetrics,
  setList: SetTracker.array(),
});
export type ExerciseTracker = z.infer<typeof ExerciseTracker>;

const SessionTracker = z.object({
  uuid: z.string().uuid(),
  sessionId: z.string().uuid(),
  name: z.string(),
  exerciseTrackerList: ExerciseTracker.array(),
  createdOn: z.number(), //TODO Refactor to be date
});
export type SessionTracker = z.infer<typeof SessionTracker>;

export const RetrieveUserSessionTrackerHistory = SessionTracker.array();
export type RetrieveUserSessionTrackerHistory = z.infer<
  typeof RetrieveUserSessionTrackerHistory
>;
