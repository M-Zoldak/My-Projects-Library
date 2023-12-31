import AppLayout from "../../layouts/AppLayout";
import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";

import { http_methods } from "../../Functions/HTTPMethods";
import ContentLoader from "../../components/Loader";

import PermissionsTable from "../../components/Data/PermissionsTable";
import { useNotificationsContext } from "../../contexts/NotificationsContext";
import { AppRoleType } from "../../interfaces/EntityTypes/AppRoleType";
import { useAppDataContext } from "../../contexts/AppDataContext";
import Backlink from "../../components/Buttons/Backlink";
import { PermissionsType } from "../../interfaces/DefaultTypes";
import Submit from "../../components/Buttons/Submit";
import InputButtonGroup from "../../components/Forms/InputButtonGroup";
import { Input } from "rsuite";
import { AppType } from "../../interfaces/EntityTypes/AppType";

export default function AppRoleOptions() {
  const params = useParams();
  const { state } = useLocation();
  const { appData } = useAppDataContext();
  const [loaded, setLoaded] = useState(false);
  const [appRole, setAppRole] = useState<AppRoleType>();
  const [app, setApp] = useState<AppType>();
  const [tableLoading, setTableLoading] = useState<boolean>(false);
  const [roleName, setRoleName] = useState<string>("");

  const { addNotification } = useNotificationsContext();

  useEffect(() => {
    http_methods
      .fetch<AppRoleType>(`/app-roles/${params.id}/options`)
      .then((data) => {
        setApp(data.ownerApp);
        setAppRole(data);
        setRoleName(data.name);
        setLoaded(true);
      })
      .catch((err: Error) => {
        addNotification({ text: "test" });
      });
  }, []);

  const handleChange = (
    item: PermissionsType,
    value: any,
    updatedKey: string
  ) => {
    Object.values(appRole.permissions).forEach((permissions) => {
      if (permissions.id == item.id) {
        appRole.permissions[item.name.toLowerCase()][updatedKey] = !value;
        setAppRole({ ...appRole });
      }
    });
  };

  const saveChanges = () => {
    setTableLoading(true);
    http_methods
      .put<AppRoleType>(`/app-roles/${appRole.id}`, appRole)
      .then((data) => {
        setAppRole(data);
        addNotification({
          text: "Changes saved",
          notificationProps: { type: "success" },
        });
        setTableLoading(false);
      });
  };

  const updateName = (roleName: string) => {
    http_methods
      .put<AppRoleType>(`/app-roles/${appRole.id}/updateName`, {
        name: roleName,
      })
      .then((data) => {
        setAppRole(data);
        addNotification({
          text: "Role name was succesfully updated",
          notificationProps: { type: "success" },
        });
      });
  };

  return (
    <AppLayout title="Role options" activePage="My Apps">
      <Backlink link={state?.backlink} />

      <ContentLoader loaded={loaded}>
        {appRole && (
          <>
            <h2>{appRole?.name} options</h2>
            <InputButtonGroup
              label="Role name: "
              buttonText="Update"
              onSubmit={updateName}
              onChange={setRoleName}
              value={roleName}
            />
            <h3>Permissions</h3>

            <PermissionsTable
              id={appRole?.id.toString()}
              items={appRole.permissions}
              label="none yet"
              name="some Name"
              isLoading={tableLoading}
              propsToRender={[
                { key: "name", label: "Section", fieldType: "description" },
                {
                  key: "hasView",
                  label: "Read",
                  values: appRole.permissions,
                  fieldType: "checkbox",
                  onChange: handleChange,
                  disabled: () => appRole.isOwnerRole,
                  disabledMessage: "You can't edit permissions on main role",
                },
                {
                  key: "hasOptions",
                  label: "Edit",
                  values: appRole.permissions,
                  fieldType: "checkbox",
                  onChange: handleChange,
                  disabled: () => appRole.isOwnerRole,
                  disabledMessage: "You can't edit permissions on main role",
                },
                {
                  key: "deleteable",
                  label: "Delete",
                  values: appRole.permissions,
                  fieldType: "checkbox",
                  onChange: handleChange,
                  disabled: () => appRole.isOwnerRole,
                  disabledMessage: "You can't edit permissions on main role",
                },
              ]}
            />
            <Submit onSubmit={saveChanges}>Update permissions</Submit>
          </>
        )}
      </ContentLoader>
    </AppLayout>
  );
}
