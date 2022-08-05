import { useSelector } from "@xstate/react";
import React from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { Text, TextInput, View } from "react-native";
import { useAppContext } from "../contexts/AppContext";

export interface MusicTrackVoteCreationFormNameFormFieldValues {
  roomName: string;
}

interface MusicTrackVoteCreationFormNameContentProps {
  handleGoBack: () => void;
  handleGoNext: SubmitHandler<MusicTrackVoteCreationFormNameFormFieldValues>;
}

const TrainingSessionFormNameContent: React.FC<
  MusicTrackVoteCreationFormNameContentProps
> = ({ handleGoBack, handleGoNext }) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<MusicTrackVoteCreationFormNameFormFieldValues>();

  const defaultTrainingSessionName = "Training Session Name";
  return (
    <>
      <View>
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
              placeholder="Playlist name"
              placeholderTextColor="#fff"
            />
          )}
          name="roomName"
          defaultValue={defaultTrainingSessionName}
        />
        {errors.roomName && (
          <Text accessibilityRole="alert">A room name must be set.</Text>
        )}
      </View>
    </>
  );
};

interface MusicPlaylistEditorCreationFormNameProps {
  creationFormActor: any;
}

const TrainingSessionCreationFormName: React.FC<
  MusicPlaylistEditorCreationFormNameProps
> = ({ creationFormActor }) => {
  function handleGoBack() {
    creationFormActor.send({
      type: "GO_BACK",
    });
  }

  function handleGoNext(roomName: string) {
    creationFormActor.send({
      type: "SET_ROOM_NAME_AND_GO_NEXT",
      roomName,
    });
  }

  return (
    <TrainingSessionFormNameContent
      handleGoBack={handleGoBack}
      handleGoNext={({ roomName }) => {
        handleGoNext(roomName);
      }}
    />
  );
};

const TrainingSessionFormNameWrapper: React.FC = () => {
  //   const {programBuilderService} = useAppContext();

  //   if (creationFormActor === undefined) {
  //     return (
  //       <AppScreen testID="music-playlist-editor-creation-form-name-screen-default" />
  //     );
  //   }

  return <TrainingSessionCreationFormName creationFormActor={{} as any} />;
};

export default TrainingSessionFormNameWrapper;
