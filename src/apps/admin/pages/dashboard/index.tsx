import { useList } from "@refinedev/core";
import { Card, Col, Row, Statistic } from "antd";
import { ShoppingCartOutlined, DollarCircleOutlined, UserOutlined } from "@ant-design/icons";

export const DashboardPage = () => {
  // Toplam Siparişler
  const { data: ordersData } = useList({ resource: "orders" });
  
  // Bekleyen Siparişler
  const pendingOrders = ordersData?.data.filter(o => o.status === 'pending').length || 0;
  
  // Toplam Ciro (Basit hesap)
  const totalRevenue = ordersData?.data.reduce((acc, curr) => acc + (Number(curr.total_amount) || 0), 0) || 0;

  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ fontSize: 24, marginBottom: 24 }}>Yönetici Paneli</h1>
      <Row gutter={16}>
        <Col span={8}>
          <Card>
            <Statistic 
              title="Toplam Ciro" 
              value={totalRevenue} 
              precision={2} 
              prefix={<DollarCircleOutlined />} 
              suffix="₺" 
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic 
              title="Bekleyen Sipariş" 
              value={pendingOrders} 
              prefix={<ShoppingCartOutlined />} 
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
             <Statistic 
              title="Toplam Sipariş Sayısı" 
              value={ordersData?.total || 0} 
              prefix={<UserOutlined />} 
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};