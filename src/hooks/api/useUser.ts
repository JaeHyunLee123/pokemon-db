import { api } from "@/libs/axios";
import { UserResponse } from "@/types/api-response-types/user-api-resonse-type";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";

type UseUserOptions = Omit<
  UseQueryOptions<UserResponse>,
  "queryFn" | "queryKey"
>;

export default function useUser(options?: UseUserOptions) {
  return useQuery({
    ...options,
    queryKey: ["user"],
    queryFn: async () => {
      const res = await api.get("/api/user");

      return res.data;
    },
  });
}
