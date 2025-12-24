import { Edit, useForm } from "@refinedev/antd";
import { Form, Input, InputNumber, Checkbox } from "antd";

export const ProductEdit = () => {
  const { formProps, saveButtonProps } = useForm();

  return (
    <Edit saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
        <Form.Item label="Ürün Adı" name="name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item label="URL Slug" name="slug" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Açıklama" name="description">
          <Input.TextArea rows={4} />
        </Form.Item>
        <Form.Item label="m² Fiyatı (₺)" name="base_price" rules={[{ required: true }]}>
          <InputNumber style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item name="is_active" valuePropName="checked">
          <Checkbox>Satışta / Aktif</Checkbox>
        </Form.Item>
        {/* Config Schema JSON olarak düzenlenebilir, şimdilik basit tutuyoruz */}
      </Form>
    </Edit>
  );
};