import { Exercise, ExerciseTracker, Session } from "@/types";
import { ExerciseMachineState } from "../ExerciseMachine";
import { SessionMachineContext } from "../SessionMachine";

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

export function fromSessionMachineContextToSession({ uuid, name, exerciseActorRefList }: SessionMachineContext): Session {
    const exerciseList = exerciseActorRefList.map((actor) => actor.getSnapshot()).filter((el: undefined | ExerciseMachineState): el is ExerciseMachineState => el !== undefined).map(el => el.context)
    return {
        exerciseList,
        name,
        uuid
    }
}