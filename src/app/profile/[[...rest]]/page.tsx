import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Image from "next/image";
import { UserProfile } from "@clerk/nextjs";

export default async function Profile() {
  const user = await currentUser();

  if (!user) {
    redirect("/");
  }

  return (
    <div className="flex flex-col items-center justify-center h-full w-full">
      <UserProfile 
        appearance={{
          variables: {
            colorPrimary: "#3b82f6",
            colorText: "#ffffff",
            colorTextSecondary: "#ffffff",
            colorBackground: "#0f172a",
            colorInputBackground: "#1e293b",
            colorInputText: "#ffffff",
            colorDanger: "#ff0055",
            borderRadius: "0.5rem",
          },
          elements: {
            card: {
              backgroundColor: "#1e293b",
              borderRadius: "1rem",
            },
            navbar: {
              backgroundColor: "#1e293b",
            },
            navbarButton: {
              color: "#94a3b8",
              "&:hover": {
                color: "#ffffff"
              }
            },
            navbarButtonActive: {
              backgroundColor: "#2563eb",
              color: "#ffffff"
            },
            badge: {
              backgroundColor: "#2563eb",
              color: "#ffffff",
              fontWeight: "300"
            },
            headerTitle: {
              color: "#ffffff",
            },
            headerSubtitle: {
              color: "#94a3b8",
            },
            actionButtonIcon: {
              color: "#ffffff"
            },
            menuButton: {
              color: "#ffffff"
            }
          }
        }}
        path="/profile"
        routing="path"
      />
      <div className="flex flex-col items-center justify-center">
        <div className="flex flex-col items-center justify-between">
          <h1 className="text-white text-4xl font-bold">
            Bonjour, {user?.username}
          </h1>

          <Image
            src={user?.imageUrl || ""}
            alt="User Avatar"
            width={100}
            height={100}
            className="rounded-full"
          />
        </div>

        <ul>
          <li>{user?.firstName}</li>
          <li>{user?.lastName}</li>
          <li>{user?.emailAddresses[0].emailAddress}</li>
          <li>{user?.id}</li>
        </ul>
      </div>
    </div>
  );
}
