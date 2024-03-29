import { FlexboxGrid } from "rsuite";
import AppLayout from "../../layouts/AppLayout";
import { useEffect, useState } from "react";
import CommonList from "../../components/Data/CommonList";
import { http_methods } from "../../Functions/HTTPMethods";
import ContentLoader from "../../components/Loader";
import SimpleCreateModal from "../../components/Modals/SimpleCreateModal";
import { useNotificationsContext } from "../../contexts/NotificationsContext";
import { useAppDataContext } from "../../contexts/AppDataContext";
import { ClientType } from "../../interfaces/EntityTypes/ClientType";

export default function ClientsList() {
  const { appData } = useAppDataContext();
  const [loaded, setLoaded] = useState(false);
  const { addNotification } = useNotificationsContext();
  const [clients, setClients] = useState<ClientType[]>([]);

  useEffect(() => {
    setLoaded(false);
    http_methods
      .fetch<ClientType[]>(`/clients`)
      .then((data) => {
        setClients(data);
        setLoaded(true);
      })
      .catch((err: Error) => {
        addNotification({ text: err.message });
      });
  }, [appData]);

  return (
    <AppLayout title="Clients overview" activePage="Clients">
      <FlexboxGrid className="buttons_container">
        {appData?.currentUser?.currentAppRole?.permissions?.clients
          ?.hasOptions &&
          clients && (
            <SimpleCreateModal<ClientType>
              title="New client"
              entity="clients"
              onSuccess={(client) => {
                setClients([...clients, client]);
                addNotification({
                  text: `Client ${client.name} was created succesfully!`,
                  notificationProps: {
                    type: "success",
                  },
                });
              }}
            />
          )}
      </FlexboxGrid>

      <ContentLoader loaded={loaded}>
        <h3>Active clients</h3>
        {clients && (
          <CommonList<ClientType>
            onEmpty="You don't have any clients yet. Create one now!"
            items={clients}
            label={(client) => client.name}
            entity="clients"
            onDelete={(item) => {
              let newClients = clients.filter((client) => client.id != item.id);
              setClients(newClients);
              addNotification({
                text: `Client ${item.name} was deleted succesfully`,
                notificationProps: { type: "success" },
              });
            }}
            search={{ label: "name", value: "name" }}
            // filters={[
            //   { label: "Project state", value: "projectState" },
            //   { label: "Client", value: "client" },
            //   { label: "Project manager", value: "manager" },
            // ]}
            sortingDefaults={{ field: "name" }}
            sortingItems={[{ value: "name", label: "Name" }]}
            buttons={{
              deleteable:
                appData?.currentUser?.currentAppRole?.permissions?.clients
                  ?.deleteable,
              hasOptions:
                appData?.currentUser?.currentAppRole?.permissions?.clients
                  ?.hasOptions,
              hasView:
                appData?.currentUser?.currentAppRole?.permissions?.clients
                  ?.hasView,
            }}
          />
        )}
      </ContentLoader>
    </AppLayout>
  );
}
