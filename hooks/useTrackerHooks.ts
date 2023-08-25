import { useAppContext } from "@/context/appContext";
import { SessionTrackerActorRef } from "@/machines/Tracker/SessionTrackerMachine";
import { useActor, useSelector } from "@xstate/react";
import invariant from "invariant";

export function useSessionTrackerActorRef(sessionTrackerId: string): SessionTrackerActorRef {
    const { trackerService } = useAppContext()

    const sessionActorRefList = useSelector(
        trackerService,
        (state) => state.context.sessionTrackerActorRef
    );

    const actorRef = sessionActorRefList.find((actor) => actor.id === sessionTrackerId)
    invariant(actorRef !== undefined, "We should handle this with a redirection to home with modal or to an unknown error screen")

    return actorRef
}