import { getServerSession } from "next-auth";
import { authOptions } from "@/app/server/auth";

export const getServerAuthSession = async () => {
  return getServerSession(authOptions);
};
