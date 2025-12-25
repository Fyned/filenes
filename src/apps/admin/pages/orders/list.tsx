import { List, useTable, ShowButton } from "@refinedev/antd";
import { Table, Space, Tag } from "antd";

export const OrderList = () => {
  const { tableProps } = useTable({ resource: "orders" });

  return (
    <List>
      <Table {...(tableProps as any)} rowKey="id">
        <Table.Column 
           dataIndex="created_at" 
           title="Tarih"
           render={(value) => new Date(value).toLocaleDateString("tr-TR")} 
        />
        <Table.Column 
          dataIndex="status" 
          title="Durum" 
          render={(value) => {
             let color = 'default';
             if(value === 'paid') color = 'green';
             if(value === 'pending') color = 'orange';
             if(value === 'cancelled') color = 'red';
             return <Tag color={color}>{value.toUpperCase()}</Tag>
          }}
        />
        <Table.Column dataIndex="total_amount" title="Tutar" render={(v) => `${v} ₺`} />
        <Table.Column
          title="İşlemler"
          dataIndex="actions"
          render={(_, record: any) => (
            <Space>
              <ShowButton hideText size="small" recordItemId={record.id} />
            </Space>
          )}
        />
      </Table>
    </List>
  );
};