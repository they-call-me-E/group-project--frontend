import type { Metadata } from "next";
import "./globals.css";
import ThemeRegistry from "./theme/ThemeRegistry";
import { Session } from "./SessionProvider";
import { UserActionOpenWrapper } from "./context/map/UserActionContext";
import { UsersMenuListOpenWrapper } from "./context/map/UsersMenuListContext";
import { GroupSelectionWrapper } from "./context/map/GroupSelectionContext";
import { PlacesMenuListOpenWrapper } from "./context/map/PlacesMenuListContext";
import { MarkerOnMapContextWrapper } from "./context/map/MarkerOnMapContext";

export const metadata: Metadata = {
  title: "GroupTrackr",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <ThemeRegistry>
        <Session>
          <PlacesMenuListOpenWrapper>
            <UsersMenuListOpenWrapper>
              <UserActionOpenWrapper>
                <GroupSelectionWrapper>
                  <MarkerOnMapContextWrapper>
                    <body>{children}</body>
                  </MarkerOnMapContextWrapper>
                </GroupSelectionWrapper>
              </UserActionOpenWrapper>
            </UsersMenuListOpenWrapper>
          </PlacesMenuListOpenWrapper>
        </Session>
      </ThemeRegistry>
    </html>
  );
}
