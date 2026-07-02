import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import axiosInstance from "@/apis/config";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.user?.access_token;
    try {
      const resp = await axiosInstance.get("/accounts/auth/groups", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return NextResponse.json(
        { data: resp.data, message: "successful" },
        { status: 200 }
      );
    } catch (error: any) {
      return NextResponse.json(
        {
          error: "Error",
          data: error?.response?.data || null,
        },
        { status: error?.response?.status || 500 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { error: error || "Internal server error" },
      { status: 500 }
    );
  }
}
