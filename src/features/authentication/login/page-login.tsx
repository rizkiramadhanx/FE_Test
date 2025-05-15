import { ROUTES } from "@/enum/routes";
import useMutateLogin from "@/features/authentication/login/hooks/useMutateLogin";
import useUserStore from "@/store/user";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Button,
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
        setUser(user.data);

        store.set("token", user.data.accessToken);

        Notifications.show({
          title: "Success",
          message: "Successfully login",
          color: "green",
        });

        router(ROUTES.MasterData.User.View, { replace: true });
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
      {import.meta.env.VITE_PUBLIC_NODE_ENV === "development" && (
        <Box
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            backgroundColor: "red",
            padding: "4px",
          }}
        >
          <Text style={{ color: "white" }}>Development</Text>
        </Box>
      )}
      {/* Left Section - Optional Branding */}
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
          src="https://picsum.photos/1000/1000"
          style={{
            width: "100%",
            height: "100%",
            maxHeight: "100vh",
            objectFit: "cover",
          }}
          alt="Login Illustration"
        />
      </Box>

      {/* Right Section - Login Form */}
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
            borderRadius: "8px",
            boxShadow: "0 2px 12px rgba(0,0,0,0.1)",
          }}
        >
          <Text size="xl" fw={700} mb="xs" c="primary.7">
            Login to {import.meta.env.VITE_PUBLIC_APP_NAME}
          </Text>
          <Text mb="xs">emilys | emilyspass</Text>
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
    </Box>
  );
}
