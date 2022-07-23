export interface TrainingSessionExercise {
  exerciseName: string; //unique
}

export interface TrainingSession {
  trainingSessionName: string;
  uuid: string;
  exercises: TrainingSessionExercise[];
}

export type TrainingSessionCollection = TrainingSession[];

export interface BodybuildingProgram {
  trainingSessions: TrainingSessionCollection;
}
