import { useAppContext } from "@/context/appContext";
import { SessionTrackerActorRef } from "@/machines/Tracker/SessionTrackerMachine";
import { useSelector } from "@xstate/react";
import type { SetFormActorRef } from "@/machines/Tracker/SetFormMachine"
import invariant from "invariant";
import { ExerciseTrackerActorRef } from "@/machines/Tracker/ExerciseTrackerMachine";

export function useSessionTrackerActorRef(sessionTrackerId: string): SessionTrackerActorRef {
    console.log("useSessionTrackerActorRef")
    const { trackerService } = useAppContext()

    const sessionActorRefList = useSelector(
        trackerService,
        (state) => state.context.sessionTrackerActorRef
    );

    const actorRef = sessionActorRefList.find((actor) => actor.id === sessionTrackerId)
    invariant(actorRef !== undefined, "We should handle this with a redirection to home with modal or to an unknown error screen")

    return actorRef
}

interface UseExerciseTrackerActorRefArgs {
    sessionTrackerId: string,
    exerciseId: string
}
export function useExerciseTrackerActorRef({ exerciseId, sessionTrackerId }: UseExerciseTrackerActorRefArgs): ExerciseTrackerActorRef {
    console.log("useExerciseTrackerActorRef")
    const sessionTrackerActorRef = useSessionTrackerActorRef(sessionTrackerId);

    const actorRef = useSelector(
        sessionTrackerActorRef,
        (state) => state.context.exerciseTrackerActorList
    ).find((actor) => actor.id === exerciseId);
    invariant(actorRef !== undefined, "We should handle this with a redirection to home with modal or to an unknown error screen")

    return actorRef
}

export function useSetFormMachine(args: UseExerciseTrackerActorRefArgs) {
    const exerciseTrackerActorRef = useExerciseTrackerActorRef(args);
    return useSelector(exerciseTrackerActorRef, (state) => state.children.SetFormMachine as
        | SetFormActorRef
        | undefined)

}