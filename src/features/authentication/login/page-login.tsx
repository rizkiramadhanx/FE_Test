import { ROUTES } from "@/enum/routes";
import useMutateLogin from "@/features/authentication/login/hooks/useMutateLogin";
import useUserStore from "@/store/user";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Button,
  Flex,
  PasswordInput,
  Text,
  TextInput,
  useMantineColorScheme,
} from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import store from "store2";
import { z } from "zod";
import Logo from "@/assets/logo.png";
import SidebarImage from "@/assets/login-side.jpg";

const schema = z.object({
  username: z.string().min(4, { message: "Username minimal 4 karakter" }),
  password: z.string().min(4, { message: "Password minimal 4 karakter" }),
});

export default function Login() {
  const router = useNavigate();

  const isDark = useMantineColorScheme().colorScheme === "dark";

  const { setUser } = useUserStore();

  type LoginSchema = z.infer<typeof schema>;

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm<LoginSchema>({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  const { mutate } = useMutateLogin();

  const onSubmit = async (dataForm: LoginSchema) => {
    mutate(dataForm, {
      onSuccess: (user) => {
        setUser({
          token: user.token,
          name: dataForm.username,
        });

        store.set("token", user.token);

        Notifications.show({
          title: "Success",
          message: "Successfully login",
          color: "green",
        });

        router(ROUTES.Dashboard.View, { replace: true });
      },
      onError: () => {
        Notifications.show({
          title: "Error",
          message: "Failed to login",
          color: "red",
        });
      },
    });
  };

  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        flexDirection: "row",
        "@media (max-width: 1000px)": {
          flexDirection: "column",
        },
      }}
    >
      <Box
        sx={(theme) => ({
          flex: 1,
          backgroundColor: theme.colors.gray[3],
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem",
        })}
      >
        <Box
          bg={isDark ? "dark.7" : "white"}
          sx={{
            width: "100%",
            maxWidth: 420,
            padding: "2rem",
            paddingTop: "0",
            borderRadius: "8px",
            boxShadow: "0 2px 12px rgba(0,0,0,0.1)",
          }}
        >
          <Flex direction="column" gap="xs" align="center" justify="center">
            <img src={Logo} alt="Logo" style={{ maxHeight: "150px" }} />
          </Flex>
          <Text mb="xs">Super Admin | password12345</Text>
          <form onSubmit={handleSubmit(onSubmit)}>
            <TextInput
              label="Username"
              placeholder="Insert username"
              error={errors.username?.message}
              {...register("username")}
              required
              mb="xs"
            />
            <PasswordInput
              label="Password"
              placeholder="Insert password"
              error={errors.password?.message}
              {...register("password")}
              required
              mb="xs"
            />
            <Button
              type="submit"
              fullWidth
              variant="filled"
              color="primary"
              disabled={!isValid || isSubmitting}
              loading={isSubmitting}
            >
              Sign In
            </Button>
          </form>
        </Box>
      </Box>

      <Box
        sx={{
          flex: 1,
          backgroundColor: "#e0e0e0",
          display: "block",
          "@media (max-width: 1000px)": {
            display: "none",
          },
        }}
      >
        <img
          src={SidebarImage}
          style={{
            width: "100%",
            height: "100%",
            maxHeight: "100vh",
            objectFit: "cover",
          }}
          alt="Login Illustration"
        />
      </Box>
    </Box>
  );
}
