import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { Button, Text, TextInput, View } from "react-native";
import { useTailwind } from "tailwind-rn/dist";
import { useTrainingSessionCreationFormActor } from "../hooks/useTrainingSessionCreationFormActor";
import { TrainingSessionCreationFormActorRef } from "../machines/TrainingSessionCreationFormMachine";
import { ProgramBuilderTrainingSessionCreationFormNameScreenProps } from "../navigation/RootStack";

export interface MusicTrackVoteCreationFormNameFormFieldValues {
  sessionTrainingName: string;
}

interface MusicTrackVoteCreationFormNameContentProps {
  handleGoBack: () => void;
  handleGoNext: SubmitHandler<MusicTrackVoteCreationFormNameFormFieldValues>;
}

const TrainingSessionFormNameContent: React.FC<
  MusicTrackVoteCreationFormNameContentProps
> = ({ handleGoNext }) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<MusicTrackVoteCreationFormNameFormFieldValues>();

  const tailwind = useTailwind();
  const defaultTrainingSessionName = "";
  return (
    <View testID="training-session-creation-form-name-step">
      <Controller
        control={control}
        rules={{
          required: true,
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            value={value}
            onBlur={onBlur}
            onChangeText={onChange}
            placeholder="Name"
          />
        )}
        name="sessionTrainingName"
        defaultValue={defaultTrainingSessionName}
      />
      {errors.sessionTrainingName && (
        <Text style={tailwind("text-red-500")} accessibilityRole="alert">
          A session training name must be set.
        </Text>
      )}

      <Button title="Submit" onPress={handleSubmit(handleGoNext)}></Button>
    </View>
  );
};

interface MusicPlaylistEditorCreationFormNameProps {
  creationFormActor: TrainingSessionCreationFormActorRef;
}

const TrainingSessionCreationFormName: React.FC<
  MusicPlaylistEditorCreationFormNameProps
> = ({ creationFormActor }) => {
  //See https://reactnavigation.org/docs/preventing-going-back
  // React.useEffect(() => {
  //   const onScreenDeletion = () => {
  //     // sending the event here
  //     console.log("should dispatch go back");
  //   };

  //   navigation.addListener("beforeRemove", onScreenDeletion);
  //   return () => navigation.removeListener("beforeRemove", onScreenDeletion);
  // }, [navigation]);

  function handleGoBack() {
    creationFormActor.send({
      type: "GO_BACK",
    });
  }

  function handleGoNext(sessionTrainingName: string) {
    creationFormActor.send({
      type: "SET_ROOM_NAME_AND_GO_NEXT",
      name: sessionTrainingName,
    });
  }

  return (
    <TrainingSessionFormNameContent
      handleGoBack={handleGoBack}
      handleGoNext={({ sessionTrainingName }) => {
        handleGoNext(sessionTrainingName);
      }}
    />
  );
};

const TrainingSessionFormNameWrapper: React.FC<
  ProgramBuilderTrainingSessionCreationFormNameScreenProps
> = (props) => {
  const trainingSessionCreationFormActor =
    useTrainingSessionCreationFormActor();

  if (trainingSessionCreationFormActor === undefined) {
    return <View testID="training-session-creation-form-name-default" />;
  }

  return (
    <TrainingSessionCreationFormName
      creationFormActor={trainingSessionCreationFormActor}
    />
  );
};

export default TrainingSessionFormNameWrapper;
