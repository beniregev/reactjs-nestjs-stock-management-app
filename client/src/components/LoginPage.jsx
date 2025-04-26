import { observer } from "mobx-react-lite";
import { userStore } from "../store/userStore";
import { useNavigate } from "react-router-dom";
import { Input, Button, Form } from "antd";

export const LoginPage = observer(() => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const handleOnFinish = (values) => {
    userStore.setUser(values);
    navigate("/portfolio");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 rounded-2xl mt-2">
      <Form
        form={form}
        layout="vertical"
        className="bg-white p-10 rounded-xl shadow-md w-96"
        onFinish={handleOnFinish}
      >
        <h1 className="text-2xl mb-6 font-bold text-center">Login</h1>
        <Form.Item
          name="fullName"
          label="Full Name"
          rules={[
            {
              required: true,
              message:
                "Full name required. Valid characters: UPPERCASE, lowercase, dot, comma, dash, and space.",
            },
            { pattern: /^[A-Za-z\s\-,.]+$/, message: "Invalid full name" },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: "Email required" },
            {
              type: "email",
              message:
                "Invalid email format. User email must be in a valid email format.",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Button type="primary" htmlType="submit" block>
          Login
        </Button>
      </Form>
    </div>
  );
});
