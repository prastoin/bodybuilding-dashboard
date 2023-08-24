import { Exercise, ExerciseTracker } from "@/types";

export function fromExerciseListToExerciseTracker(exerciseList: Exercise[]): ExerciseTracker[] {
    const transpiler = ({ load, name, repCounter, rest, setCounter, uuid: exerciseId }: Exercise) => {
        return {
            exerciseId,
            expectedMetrics: {
                load,
                repCounter,
                rest,
                setCounter
            },
            name,
            setList: []
        }
    }

    return exerciseList.map(transpiler);
}