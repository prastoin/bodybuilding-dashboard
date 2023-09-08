import { useAppContext } from "@/context/appContext";
import { SessionTrackerActorRef } from "@/machines/Tracker/SessionTrackerMachine";
import { useSelector } from "@xstate/react";
import type { SetFormActorRef } from "@/machines/Tracker/SetFormMachine"
import invariant from "invariant";
import { ExerciseTrackerActorRef } from "@/machines/Tracker/ExerciseTrackerMachine";

export function useSessionTrackerActorRef(sessionTrackerId: string): SessionTrackerActorRef {
    const { trackerService } = useAppContext()

    const sessionActorRefList = useSelector(
        trackerService,
        (state) => state.context.sessionTrackerActorRef
    );

    const actorRef = sessionActorRefList.find((actor) => actor.id === sessionTrackerId)
    invariant(actorRef !== undefined, "session tracker actor ref not found")

    return actorRef
}

interface UseExerciseTrackerActorRefArgs {
    sessionTrackerId: string,
    exerciseId: string
}
export function useExerciseTrackerActorRef({ exerciseId, sessionTrackerId }: UseExerciseTrackerActorRefArgs): ExerciseTrackerActorRef {
    const sessionTrackerActorRef = useSessionTrackerActorRef(sessionTrackerId);

    const actorRef = useSelector(
        sessionTrackerActorRef,
        (state) => state.context.exerciseTrackerActorList
    ).find((actor) => actor.id === exerciseId);
    invariant(actorRef !== undefined, "exercise tracker actor ref not found")

    return actorRef
}

export function useSetFormMachine(args: UseExerciseTrackerActorRefArgs) {
    const exerciseTrackerActorRef = useExerciseTrackerActorRef(args);
    return useSelector(exerciseTrackerActorRef, (state) =>
        state.children.SetFormMachine as
        | SetFormActorRef
        | undefined
    )

}