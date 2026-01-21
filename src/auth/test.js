import { loginAndSetAuth } from "./auth.service";
import { useAuthStore } from "./auth.store";

(async () => {
  await loginAndSetAuth({
    email: "test@gmail.com",
    password: "test@123"
  })

  console.log(useAuthStore.getState())
})()





