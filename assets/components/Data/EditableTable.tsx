import { Link } from 'react-router-dom';
import { Button, FlexboxGrid, List, ListItemProps, Table } from 'rsuite';
import {
  NotificationsFunctionSignature,
  NotificationInterface,
} from '../../layouts/StandardLayout';

const { Column, HeaderCell, Cell } = Table;

export type CommonListItemProps = {
  // [key: 'string']: string;
  props?: ListItemProps;
  name: string;
  id: number;
  editable: boolean;
  hasOptions: boolean;
  destroyable: boolean;
};

type EditableListProps = {
  items: Array<CommonListItemProps>;
  editable?: boolean;
  destroyable?: boolean;
  copyable?: boolean;
  hasOptions?: boolean;
  entity: string;
  title?: string;
  propsToRender: Array<{
    id?: string;
    name: string;
    readableName: string;

    // id: number | string;
    sectionName: string;
    // readableName: string;
    delete: boolean;
    read: boolean;
    edit: boolean;

    options?: {
      tag?: boolean;
      checkbox?: boolean;
    };
  }>;
  token: string;
  setItems?: Function;
  setNotification: typeof NotificationsFunctionSignature;
  notifications: Array<NotificationInterface>;
};

export default function EditableTable({
  items,
  editable = true,
  destroyable = true,
  copyable = true,
  hasOptions = false,
  entity,
  title = 'name',
  propsToRender,
  token,
  setItems,
  setNotification,
}: EditableListProps) {
  const destroyAction = () => {};

  const copyAction = () => {};

  const renderActionButtons = (item: CommonListItemProps) => {
    let edit =
      editable && item.editable ? (
        <Button
          appearance="ghost"
          size="sm"
          as={Link}
          to={`/${entity}/edit/${item.id}`}
          color="blue"
        >
          Edit
        </Button>
      ) : (
        ''
      );
    let destroy =
      destroyable && item.destroyable ? (
        <Button
          appearance="ghost"
          size="sm"
          color="red"
          onClick={destroyAction}
        >
          Delete
        </Button>
      ) : (
        ''
      );
    let copy = copyable ? (
      <Button appearance="ghost" size="sm" color="cyan" onClick={copyAction}>
        Copy
      </Button>
    ) : (
      ''
    );
    let options =
      hasOptions || item.hasOptions ? (
        <Button
          appearance="ghost"
          size="sm"
          color="yellow"
          as={Link}
          to={`/${entity}/options/${item.id}`}
        >
          Options
        </Button>
      ) : (
        ''
      );

    return (
      <FlexboxGrid className="buttons_container">
        {options}
        {edit}name
        {copy}
        {destroy}
      </FlexboxGrid>
    );
  };

  return (
    <Table hover bordered data={items}>
      {propsToRender.map((defs, index) => (
        <>
          <Column fixed key={index}>
            <HeaderCell>{defs.readableName}</HeaderCell>
            <Cell dataKey={defs.name} />
          </Column>
        </>
      ))}
    </Table>
  );
}
