import { useUserStore } from "@/app/providers/user-store-provider";
import { API_BASEURL } from "@/lib/constants";
import { getErrorMap } from "@/lib/helpers";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";



export const uploadQualificationDocsApi = async (formData: FormData, token: string) => {
    const response = await axios.post(`${API_BASEURL}/employee/${formData.get("id")}/add-qualification`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}`,
      }
    });
    return response.data;
};
export const useUploadQualificationDocs = (callBackFunc?: () => void) => {
	const { user } = useUserStore((state) => state)
	const token = user?.access_token

	const { mutate, isPending } = useMutation({
	  mutationFn: (data: FormData) => uploadQualificationDocsApi(data, token!),
	  onSuccess: () => {
		toast.success("Document Uploaded Successfully");
		callBackFunc?.()
	  },
	  onError: (error: any) => {
		toast.error(getErrorMap(error));
	}
	});
	return { mutate, isPending};
};