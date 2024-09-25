"use client";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import Grid from "@mui/material/Grid2";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { IconButton } from "@mui/material";
import { Colors } from "./../theme/colors";
import GroupSelection from "../component/map/GroupSelection";
import UserInformation from "../component/map/UserInformation";
import UsersMenu from "../component/map/UsersMenu";
import PlacesMenu from "../component/map/PlacesMenu";
import { useRouter } from "next/navigation";
import AlertMessage from "../component/message/AlertMessage";
import axios from "axios";
import { useGroupSelectionContext } from "../context/map/GroupSelectionContext";
import CircularProgress from "@mui/material/CircularProgress";
import UsersMenuList from "../component/map/UsersMenuList";
import PlacesMenuList from "../component/map/PlacesMenuList";
import { useUsersMenuListOpenContext } from "../context/map/UsersMenuListContext";
import { usePlacesMenuListOpenContext } from "../context/map/PlacesMenuListContext";
import Map from "../component/map/Map";
import EditProfile from "../component/map/EditProfile";
import LocationWithStatus from "./../component/map/LocationWithStatus";
import { useUserActionOpenContext } from "../context/map/UserActionContext";
import { handleUserInformation } from "./../utils/api/userInformation";
import CreateGroup from "./../component/map/CreateGroup";
import GroupManagement from "./../component/map/GroupManagement";
import { handleGroupList } from "./../utils/api/groupInformation";
import JoinGroup from "../component/map/JoinGroup";

export default function Home() {
  const {
    editProfileModalForm,
    locationWithStatusModalForm,
    createGroupModalForm,
    groupsModal,
    joinGroupModal,
  } = useUserActionOpenContext();
  const [moveEditProfileForm, setMoveEditProfileForm] = useState(false);
  const [moveLocationWithStatusForm, setMoveLocationWithStatusForm] =
    useState(false);
  const [moveCreateGroupForm, setMoveCreateGroupForm] = useState(false);
  const [moveJoinGroupForm, setMoveJoinGroupForm] = useState(false);
  const { groupId, handleClick: groupIdHandleClick } =
    useGroupSelectionContext();
  const {
    open: usersMenuListModalOpen,
    handleClick: usersMenuListHandleClick,
  } = useUsersMenuListOpenContext();
  const {
    open: placesMenuListModalOpen,
    handleClick: placesMenuListHandleClick,
  } = usePlacesMenuListOpenContext();
  const [mapMain, setMapMain] = useState<any>(null);
  const [error, setError] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { data: session, status } = useSession();
  const [userList, setUserList] = useState([]);
  const [placesList, setPlacesList] = useState([]);
  const [userInformationData, setUserInformationData] = useState({});
  const [
    locationWithStatusInformationData,
    setLocationWithStatusInformationData,
  ] = useState({});
  const [editProfileSuccess, setEditProfileSuccess] = useState(false);
  const [locationWithStatusSuccess, setLocationWithStatusSuccess] =
    useState(false);
  const [editProfilerror, setEditProfilerror] = useState(false);
  const [locationWithStatuserror, setLocationWithStatuserror] = useState(false);
  const [editProfileErrorMsg, setEditProfileErrorMsg] = useState("");
  const [locationWithStatusErrorMsg, setLocationWithStatusErrorMsg] =
    useState("");
  const [createGroupSuccess, setCreateGroupSuccess] = useState(false);
  const [joinGroupSuccess, setJoinGroupSuccess] = useState(false);
  const [createGrouperror, setCreateGrouperror] = useState(false);
  const [joinGrouperror, setJoinGrouperror] = useState(false);
  const [createGroupErrorMsg, setCreateGroupErrorMsg] = useState("");
  const [joinGroupErrorMsg, setJoinGroupErrorMsg] = useState("");
  const [groupInformationData, setGroupInformationData] = useState([]);

  const router = useRouter();

  const handleErrorClose = () => {
    setError(false);
  };

  const handleMenuToggle = () => {
    setMenuOpen(!menuOpen);
    setMoveEditProfileForm(!moveEditProfileForm);
    setMoveCreateGroupForm(!moveCreateGroupForm);
    setMoveLocationWithStatusForm(!moveLocationWithStatusForm);
  };

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    } else if (status === "authenticated") {
      // user information
      // @ts-ignore
      handleUserInformation(session?.user?.token, session?.user?.id)
        .then((response: any) => {
          // @ts-ignore
          setUserInformationData(response?.data?.user);
        })
        .catch((error) => {});

      // group information list
      // @ts-ignore
      handleGroupList(session?.user?.token)
        .then((response: any) => {
          // @ts-ignore
          setGroupInformationData(response?.data?.document);
        })
        .catch((error: any) => {});
    }
  }, [status]);
  const reFetchGroupListData = () => {
    // @ts-ignore
    handleGroupList(session?.user?.token)
      .then((response) => {
        // @ts-ignore
        setGroupInformationData(response?.data?.document);
      })
      .catch((error) => {});
  };

  const placesMenuDataList = async (group_id: any): Promise<boolean> => {
    try {
      if (session) {
        // places api call start
        const placesResponseList = await axios.get(
          // @ts-ignore
          `${process.env.NEXT_PUBLIC_API_URL}/groups/${group_id}/fences`,
          {
            headers: {
              // @ts-ignore
              Authorization: `Bearer ${session?.user?.token}`,
            },
          }
        );

        if (placesResponseList?.data?.document) {
          setPlacesList(placesResponseList?.data?.document);

          return true;
        } else {
          setPlacesList([]);
          return false;
        }
        // places api call end
      } else {
        return false;
      }
    } catch (error) {
      setPlacesList([]);
      return false;
    }
  };
  const usersMenuDataList = async (group_id: string): Promise<boolean> => {
    try {
      if (session) {
        // members api call start
        const membersResponseList = await axios.get(
          // @ts-ignore
          `${process.env.NEXT_PUBLIC_API_URL}/groups/${group_id}/members/`,
          {
            headers: {
              // @ts-ignore
              Authorization: `Bearer ${session?.user?.token}`,
            },
          }
        );

        // members api call end

        if (membersResponseList?.data?.document?.members) {
          setUserList(membersResponseList?.data?.document?.members);
          return true;
        } else {
          setUserList([]);

          return false;
        }
      } else {
        return false;
      }
    } catch (error) {
      setUserList([]);
      return false;
    }
  };

  const flytoMemberLocation = (
    membersWithPlacesData: any,
    mapInstance: any
  ) => {
    let { latitude, longitude } = membersWithPlacesData.location;

    mapInstance.flyTo({
      center: [longitude, latitude],
      zoom: 12,
      essential: true,
    });
  };

  if (status === "loading") {
    return (
      <Grid
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress sx={{ color: Colors.red }} size={100} />
      </Grid>
    );
  }
  if (!session) {
    return (
      <AlertMessage
        open={true}
        onClose={handleErrorClose}
        message={"You are not logged in."}
        severity="error"
      />
    );
  }
  const handleEditProfileSuccessModalClose = () => {
    setEditProfileSuccess(false);
  };
  const handleLocationWithStatusSuccessModalClose = () => {
    setLocationWithStatusSuccess(false);
  };
  const handleEditProfileErrorModalClose = () => {
    setEditProfilerror(false);
  };
  const handleLocationWithStatusErrorModalClose = () => {
    setLocationWithStatuserror(false);
  };
  const handleCreateGroupSuccessModalClose = () => {
    setCreateGroupSuccess(false);
  };
  const handleCreateGroupErrorModalClose = () => {
    setCreateGrouperror(false);
  };
  const handleJoinGroupSuccessModalClose = () => {
    setJoinGroupSuccess(false);
  };
  const handleJoinGroupErrorModalClose = () => {
    setJoinGrouperror(false);
  };

  return (
    <Grid sx={{ width: "100%", height: "100vh", position: "relative" }}>
      {/* Hamburger Icon */}
      <IconButton
        edge="start"
        color="inherit"
        aria-label="menu"
        onClick={handleMenuToggle}
        sx={{
          zIndex: 500,
          position: "absolute",
          left: "30px",
          top: "30px",
          backgroundColor: Colors.blue,
          borderRadius: "15px",
          "&:hover": {
            backgroundColor: Colors.blue,
          },
        }}
      >
        <MenuIcon sx={{ color: Colors.black, fontSize: "36px" }} />
      </IconButton>

      {/* Side Menu */}
      {menuOpen && (
        <Grid
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "350px",
            height: "100vh",
            backgroundColor: Colors.black,
            zIndex: 1000,
            boxShadow: "2px 0px 5px rgba(0, 0, 0, 0.2)",
            padding: "20px",
          }}
        >
          <IconButton
            edge="start"
            color="inherit"
            aria-label="close"
            onClick={handleMenuToggle}
            sx={{
              position: "absolute",
              right: "10px",
              top: "10px",
              backgroundColor: Colors.red,
              borderRadius: "50px",
              "&:hover": {
                backgroundColor: Colors.red,
              },
            }}
          >
            <CloseIcon sx={{ color: Colors.white, fontSize: "18px" }} />
          </IconButton>

          <Grid className="relative inline-block w-full mt-8">
            <GroupSelection
              groupArr={groupInformationData}
              placesMenuDataList={placesMenuDataList}
              usersMenuDataList={usersMenuDataList}
            />
            <Grid
              className={` ${usersMenuListModalOpen ? "h-[300px]" : "h-auto"} `}
            >
              <Grid className={`mt-4 flex gap-3 relative `}>
                <UsersMenu />
                <PlacesMenu />
                {usersMenuListModalOpen && (
                  <UsersMenuList
                    userList={userList}
                    flytoMemberLocation={flytoMemberLocation}
                    mapMain={mapMain}
                    userInformationData={userInformationData}
                  />
                )}
                {placesMenuListModalOpen && (
                  <PlacesMenuList
                    placesList={placesList}
                    flytoMemberLocation={flytoMemberLocation}
                    mapMain={mapMain}
                  />
                )}
              </Grid>
            </Grid>
          </Grid>
          <UserInformation userInformationData={userInformationData} />
        </Grid>
      )}

      <Grid>
        <Map
          placesList={placesList}
          userList={userList}
          flytoMemberLocation={flytoMemberLocation}
          mapMain={mapMain}
          setMapMain={setMapMain}
          locationWithStatusSuccess={locationWithStatusSuccess}
        />
      </Grid>
      {/* EditProfile related code*/}
      {editProfileModalForm ? (
        <EditProfile
          moveEditProfileForm={moveEditProfileForm}
          handleUserInformation={handleUserInformation}
          userInformationData={userInformationData}
          setUserInformationData={setUserInformationData}
          setSuccess={setEditProfileSuccess}
        />
      ) : (
        ""
      )}

      <AlertMessage
        open={editProfileSuccess}
        onClose={handleEditProfileSuccessModalClose}
        message="Your profile information has been successfully updated"
        severity="success"
      />
      <AlertMessage
        open={editProfilerror}
        onClose={handleEditProfileErrorModalClose}
        message={editProfileErrorMsg}
        severity="error"
      />
      {/* Location with status code */}

      {locationWithStatusModalForm ? (
        <LocationWithStatus
          usersMenuDataList={usersMenuDataList}
          moveLocationWithStatusForm={moveLocationWithStatusForm}
          handleUserInformation={handleUserInformation}
          userInformationData={userInformationData}
          setUserInformationData={setUserInformationData}
          setSuccess={setLocationWithStatusSuccess}
        />
      ) : (
        ""
      )}

      <AlertMessage
        open={locationWithStatusSuccess}
        onClose={handleLocationWithStatusSuccessModalClose}
        message="Location with Status updated successfully!"
        severity="success"
      />
      <AlertMessage
        open={locationWithStatuserror}
        onClose={handleLocationWithStatusErrorModalClose}
        message={locationWithStatusErrorMsg}
        severity="error"
      />
      {/* CreateGroup related code*/}
      {createGroupModalForm ? (
        <CreateGroup
          moveCreateGroupForm={moveCreateGroupForm}
          setSuccess={setCreateGroupSuccess}
          reFetchGroupListData={reFetchGroupListData}
        />
      ) : (
        ""
      )}
      <AlertMessage
        open={createGroupSuccess}
        onClose={handleCreateGroupSuccessModalClose}
        message="Group created successfully"
        severity="success"
      />
      <AlertMessage
        open={createGrouperror}
        onClose={handleCreateGroupErrorModalClose}
        message={createGroupErrorMsg}
        severity="error"
      />
      {/* Group ManageMent */}
      {groupsModal ? (
        <GroupManagement
          moveCreateGroupForm={moveCreateGroupForm}
          groupInformationData={groupInformationData}
          setGroupInformationData={setGroupInformationData}
          reFetchGroupListData={reFetchGroupListData}
        />
      ) : (
        ""
      )}

      {/* JoinGroup related code*/}
      {joinGroupModal ? (
        <JoinGroup
          moveCreateGroupForm={moveCreateGroupForm}
          setSuccess={setJoinGroupSuccess}
          reFetchGroupListData={reFetchGroupListData}
        />
      ) : (
        ""
      )}
      <AlertMessage
        open={joinGroupSuccess}
        onClose={handleJoinGroupSuccessModalClose}
        message="You've successfully joined the group"
        severity="success"
      />
      <AlertMessage
        open={joinGrouperror}
        onClose={handleJoinGroupErrorModalClose}
        message={joinGroupErrorMsg}
        severity="error"
      />
    </Grid>
  );
}