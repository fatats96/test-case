/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import {
  Form,
  Input,
  Button,
  Card,
  Tabs,
  Table,
  Empty,
  Spin,
  Alert,
  Row,
  Col,
  Space,
  Typography,
  notification,
} from "antd";
import { SearchOutlined, CarOutlined, ReloadOutlined } from "@ant-design/icons";
import axios from "axios";
import { IInsuranceQuoteModel } from "./models/models/insurance-quote.model";
import { IQuoteModel } from "./models/models/quote.model";

const { Title, Text } = Typography;
const { TabPane } = Tabs;

const API_BASE_URL = import.meta.env.VITE_API_URL;

const InsuranceQuoteApp = () => {
  const [form] = Form.useForm();
  const [requestForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [quoteResult, setQuoteResult] = useState<IQuoteModel | null>(null);
  const [error, setError] = useState("");

  const plateRegex = /^[0-9]{2}[A-Z]{1,3}[0-9]{1,4}$/;

  const handleCreateQuote = async (values: { plate: string }) => {
    setLoading(true);
    setError("");

    try {
      const response = await axios.get(`${API_BASE_URL}/quote`, {
        params: { plate: values.plate },
      });

      setQuoteResult(response.data);

      notification.success({
        message: "Teklif Alındı",
        description: `${values.plate} plakalı araç için teklif talebi başarıyla oluşturuldu. Request ID: ${response.data.requestId}`,
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error("Teklif oluşturma hatası:", err);
      setError(
        err.response?.data?.message || "Teklif oluşturulurken bir hata oluştu"
      );
      notification.error({
        message: "Hata",
        description:
          err.response?.data?.message ||
          "Teklif oluşturulurken bir hata oluştu",
      });
    } finally {
      setLoading(false);
    }
  };

  // Teklif durumu sorgulama fonksiyonu - gerçek API'ya istek gönderir
  const handleCheckStatus = async (values: { requestId: string }) => {
    setLoading(true);
    setError("");

    try {
      const response = await axios.get(
        `${API_BASE_URL}/quote/status/${values.requestId}`
      );

      setQuoteResult(response.data);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error("Durum sorgulama hatası:", err);
      setError(
        err.response?.data?.message || "Durum sorgulanırken bir hata oluştu"
      );
      notification.error({
        message: "Hata",
        description:
          err.response?.data?.message || "Durum sorgulanırken bir hata oluştu",
      });
      setQuoteResult(null);
    } finally {
      setLoading(false);
    }
  };

  // Plakayla mevcut teklifleri sorgulama
  const handleSearchByPlate = async (plate: string) => {
    setLoading(true);
    setError("");

    try {
      const response = await axios.get(
        `${API_BASE_URL}/quote/statusByPlate/${plate}`,
        {}
      );

      setQuoteResult(response.data);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error("Plaka sorgulama hatası:", err);
      setError(
        err.response?.data?.message || "Plaka sorgulanırken bir hata oluştu"
      );
      notification.error({
        message: "Hata",
        description:
          err.response?.data?.message || "Plaka sorgulanırken bir hata oluştu",
      });
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "Sigorta Şirketi",
      dataIndex: "provider",
      key: "provider",
    },
    {
      title: "Fiyat",
      dataIndex: "price",
      key: "price",
      render: (text: string) => (text ? `${text} TL` : "-"),
    },
    {
      title: "Teminat Detayları",
      dataIndex: "coverageDetails",
      key: "coverageDetails",
      responsive: ["md"],
    },
    {
      title: "Durum",
      dataIndex: "status",
      key: "status",
      render: (status: string, record: IInsuranceQuoteModel) => {
        if (status === "completed" && record.isSuccess) {
          return <Text type="success">Başarılı</Text>;
        } else if (status === "pending") {
          return <Text type="warning">İşleniyor</Text>;
        } else {
          return <Text type="danger">Başarısız: {record.errorMessage}</Text>;
        }
      },
    },
  ];

  const validatePlate = (_p: any, value: string) => {
    if (!value) {
      return Promise.reject("Plaka bilgisi gereklidir");
    }
    if (!plateRegex.test(value)) {
      return Promise.reject("Geçersiz plaka formatı. Örnek: 34ABC123");
    }
    return Promise.resolve();
  };

  // Teklifi yenileme fonksiyonu
  const refreshQuote = () => {
    if (quoteResult?.requestId) {
      requestForm.setFieldsValue({ requestId: quoteResult.requestId });
      handleCheckStatus({ requestId: quoteResult.requestId });
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <Row justify="center">
        <Col xs={24} sm={24} md={20} lg={16} xl={14}>
          <Title
            level={2}
            style={{ textAlign: "center", marginBottom: "30px" }}
          >
            <CarOutlined /> Sigorta Teklifi Sistemi
          </Title>

          <Tabs defaultActiveKey="1">
            <TabPane tab="Teklif Al" key="1">
              <Card title="Araç Plakası ile Teklif Al" bordered={false}>
                <Form
                  form={form}
                  layout="vertical"
                  onFinish={handleCreateQuote}
                >
                  <Form.Item
                    label="Araç Plakası"
                    name="plate"
                    rules={[{ validator: validatePlate }]}
                    extra="Örnek format: 34ABC123"
                  >
                    <Input
                      placeholder="Plakayı giriniz"
                      maxLength={10}
                      style={{ textTransform: "uppercase" }}
                    />
                  </Form.Item>

                  <Form.Item>
                    <Space style={{ width: "100%" }}>
                      <Button
                        type="primary"
                        htmlType="submit"
                        loading={loading}
                        icon={<SearchOutlined />}
                      >
                        Teklif Al
                      </Button>
                      <Button
                        onClick={() => {
                          const plateValue = form.getFieldValue("plate");
                          if (plateValue && plateRegex.test(plateValue)) {
                            handleSearchByPlate(plateValue);
                          } else {
                            notification.warning({
                              message: "Geçersiz Plaka",
                              description: "Lütfen geçerli bir plaka giriniz",
                            });
                          }
                        }}
                        icon={<SearchOutlined />}
                      >
                        Plakaya Göre Ara
                      </Button>
                    </Space>
                  </Form.Item>
                </Form>
              </Card>
            </TabPane>

            <TabPane tab="Durum Sorgula" key="2">
              <Card title="Teklif Durumunu Sorgula" bordered={false}>
                <Form
                  form={requestForm}
                  layout="vertical"
                  onFinish={handleCheckStatus}
                >
                  <Form.Item
                    label="Request ID"
                    name="requestId"
                    rules={[
                      { required: true, message: "Request ID gereklidir" },
                    ]}
                  >
                    <Input placeholder="Request ID" />
                  </Form.Item>

                  <Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit"
                      loading={loading}
                      icon={<SearchOutlined />}
                      block
                    >
                      Sorgula
                    </Button>
                  </Form.Item>
                </Form>
              </Card>
            </TabPane>
          </Tabs>

          {loading && (
            <div style={{ textAlign: "center", margin: "30px 0" }}>
              <Spin size="large" />
              <div style={{ marginTop: "10px" }}>Sorgulanıyor...</div>
            </div>
          )}

          {error && (
            <Alert
              message="Hata"
              description={error}
              type="error"
              showIcon
              style={{ marginTop: "20px" }}
            />
          )}

          {quoteResult && !loading && (
            <Card
              title="Teklif Sonuçları"
              style={{ marginTop: "20px" }}
              extra={
                <Button icon={<ReloadOutlined />} onClick={refreshQuote}>
                  Yenile
                </Button>
              }
            >
              <Space direction="vertical" style={{ width: "100%" }}>
                <Row gutter={16}>
                  <Col span={12}>
                    <Text strong>Request ID:</Text> {quoteResult.requestId}
                  </Col>
                  <Col span={12}>
                    <Text strong>Plaka:</Text> {quoteResult.plate}
                  </Col>
                </Row>
                <Row gutter={16}>
                  <Col span={12}>
                    <Text strong>Durum:</Text>{" "}
                    {quoteResult.status === "completed" ? (
                      <Text type="success">Tamamlandı</Text>
                    ) : (
                      <Text type="warning">İşleniyor</Text>
                    )}
                  </Col>
                  <Col span={12}>
                    <Text strong>Başarılı/Başarısız:</Text>{" "}
                    {quoteResult.successCount}/{quoteResult.failureCount}
                  </Col>
                </Row>
                <Row>
                  <Col span={24}>
                    <Text strong>Tarih:</Text>{" "}
                    {new Date(quoteResult.createdAt).toLocaleString("tr-TR")}
                  </Col>
                </Row>

                <div style={{ marginTop: "20px" }}>
                  <Text strong>Teklif Sonuçları:</Text>
                  {quoteResult.quotes && quoteResult.quotes.length > 0 ? (
                    <Table
                      columns={columns as any}
                      dataSource={quoteResult.quotes.map((q, i) => ({
                        ...q,
                        key: i,
                      }))}
                      pagination={false}
                      style={{ marginTop: "10px" }}
                      size="small"
                    />
                  ) : (
                    <Empty
                      description={
                        quoteResult.status === "processing"
                          ? "Teklifler henüz hazırlanıyor..."
                          : "Hiç teklif bulunamadı"
                      }
                    />
                  )}
                </div>
              </Space>
            </Card>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default InsuranceQuoteApp;
