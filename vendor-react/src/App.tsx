import { lazy, useState } from "react";

const Badge = lazy(() => import("franchise/badge"));
const Button = lazy(() => import("franchise/button"));
const Card = lazy(() => import("franchise/card"));
const Input = lazy(() => import("franchise/input"));
const Label = lazy(() => import("franchise/label"));
const TextArea = lazy(() => import("franchise/textArea"));
const Calendar = lazy(() => import("franchise/calendar"));
const ErrorMessage = lazy(() => import("franchise/ErrorMessage"));
const AnnouncementBar = lazy(() => import("franchise/AnnouncementBar"));
const ButtonWithIcon = lazy(() => import("franchise/ButtonWithIcon"));
const FileInput = lazy(() => import("franchise/FileInput"));
const FileInputEditable = lazy(() => import("franchise/FileInputEditable"));
const InfoBox = lazy(() => import("franchise/InfoBox"));
const LoadingButton = lazy(() => import("franchise/LoadingButton"));
const LoadingIconButton = lazy(() => import("franchise/LoadingIconButton"));
const LoadingScreen = lazy(() => import("franchise/LoadingScreen"));
const PhoneCode = lazy(() => import("franchise/PhoneCode"));
const ProfileIcon = lazy(() => import("franchise/ProfileIcon"));
const SearchForm = lazy(() => import("franchise/SearchForm"));
const SuccessMessage = lazy(() => import("franchise/SuccessMessage"));
const SGAccordion = lazy(() => import("franchise/SGAccordion"));

function App() {
  const Announcement = ["This is an annoucementbar component"];
  const [fileId, setFileId] = useState<string>("");
  const [fileIdEdit, setFileIdEdit] = useState<string>("");
  return (
    <>
      <AnnouncementBar announcements={Announcement} />
      <div className="grid grid-cols-2 mt-16 gap-4  ml-4">
        <Badge variant="success" className="max-w-max">
          This is badge component
        </Badge>
        <Button variant="default" className="max-w-max">
          This is button component
        </Button>
        <Card className="max-w-max mx-0">This is card component</Card>
        <Input type="text" className="max-w-max" placeholder="This is input component" />
        <Label className="max-w-max">This is label component</Label>
        <TextArea className="max-w-max" placeholder="This is text area component" />
        <ErrorMessage error="This is the error message component" className="max-w-max max-h-min" />
        <ButtonWithIcon
          text="This is button with icon component"
          variant="secondary"
          iconName="bx:bx-home"
          className="max-w-max"
        />
        <FileInput
          label="This is file input component"
          required={true}
          className="max-w-max"
          name="file"
          setFileId={setFileId}
        />
        <div className="max-w-72">
          <FileInputEditable
            label="This is file input editable component"
            required={true}
            name="fileedit"
            fileId={fileIdEdit}
            setFileId={setFileIdEdit}
          />
        </div>
        <InfoBox title="This is info box component" className="max-w-max" />

        <LoadingButton loading={true} text="this is loading button" />
        <LoadingIconButton loading={true} className="max-w-72" text="This is loading icon button" />
        <div>
          This is loading screen component
          <LoadingScreen />
        </div>
        <PhoneCode />
        <ProfileIcon text="MicroFC" className="max-w-max" />
        <SearchForm placeholder="This is search form component" />
        <SuccessMessage success="This is success message component" className="max-w-max" />
        <div className="max-w-72">
          <SGAccordion />
        </div>
      </div>
      <Calendar
        mode="single"
        className="max-w-max"
        captionLayout="dropdown-buttons"
        onSelect={(value: any) => {
          console.log(value);
        }}
        fromYear={1900}
        toYear={2012}
      />
    </>
  );
}

export default App;
