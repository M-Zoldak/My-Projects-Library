import { useParams } from "react-router-dom";
import StandardLayout from "../../layouts/StandardLayout";
import { useEffect, useState } from "react";
import { http_methods } from "../../Functions/Fetch";
import { useAppDataContext } from "../../contexts/AppDataContext";
import { WebsiteType } from "../../interfaces/EntityTypes/WebsiteType";
import Backlink from "../../components/Buttons/Backlink";
import { ButtonToolbar } from "rsuite";
import { useNotificationsContext } from "../../contexts/NotificationsContext";
import MainTitle from "../../components/Text/MainTitle";
import FormComponent from "../../components/Forms/FormComponent";

export default function WebsiteOptions() {
  const params = useParams();
  const { appData } = useAppDataContext();
  const { addNotification } = useNotificationsContext();
  const [website, setWebsite] = useState<WebsiteType>(null);
  // const [tasks, setTasks] = useState<TaskType[]>(null);

  useEffect(() => {
    http_methods
      .fetch<WebsiteType>(appData.token, `/websites/${params.id}`)
      .then(setWebsite);
  }, []);

  return (
    <StandardLayout title="Website overview" activePage="Websites">
      <ButtonToolbar>
        <Backlink link="/Websites" />
      </ButtonToolbar>
      <MainTitle>
        {website &&
          `[${website.postal}] ${website.city} ${website.street} options`}
      </MainTitle>
      <FormComponent<WebsiteType>
        entity="websitees"
        updatePath={{ id: params.id }}
        onSuccess={(website) => {
          setWebsite(website);
          addNotification({
            text: `Address was succesfully updated.`,
            notificationProps: { type: "success" },
          });
        }}
      />
    </StandardLayout>
  );
}
