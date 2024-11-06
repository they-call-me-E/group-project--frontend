"use client";
import { Colors } from "@/app/theme/colors";
import Grid from "@mui/material/Grid2";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@mui/material";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import { styled } from "@mui/material/styles";
import TableBody from "@mui/material/TableBody";
import Tooltip from "@mui/material/Tooltip";
import { MdOutlineVisibility } from "react-icons/md";
import { handleFencesList } from "@/app/utils/api/fencesInformation";
import { IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CircularProgress from "@mui/material/CircularProgress";

// Define custom styled components
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.white,
    color: theme.palette.common.black,
    border: "1px solid #ddd",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    border: "1px solid #ddd", // Border for body cells
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: Colors.white, // Background color for odd rows
  },
  "&:nth-of-type(even)": {
    backgroundColor: Colors.white, // Custom background color for even rows
  },
  "&:hover": {
    backgroundColor: Colors.light, // Background color on hover
  },
  "& th,td": {
    paddingTop: "3px",
    paddingBottom: "3px",
    color: Colors.black,
  },
  "&:last-of-type": {
    "& th, td": {
      paddingTop: "3px",
      paddingBottom: "3px",
      color: Colors.black,
    },
  },
}));

const FencesManagement = ({
  setOpenViewGroupModal,
  setOpenViewFencesModal,
  setOpenFencesManagementModal,
  editGroupInformation,
  setSingleFences,
  handleSingleGroupInformation,
}: // reFetchGroupListData,
{
  setOpenViewGroupModal: React.Dispatch<React.SetStateAction<any>>;
  setOpenViewFencesModal: React.Dispatch<React.SetStateAction<any>>;
  setOpenFencesManagementModal: React.Dispatch<React.SetStateAction<any>>;
  editGroupInformation: any;
  setSingleFences: React.Dispatch<React.SetStateAction<any>>;
  handleSingleGroupInformation: (groupId: string) => void;
  //</React.SetStateAction> reFetchGroupListData: () => void;
}) => {
  const { data: session, status }: { data: any; status: string } = useSession();
  const [fencesData, setFencesData] = useState([]);

  useEffect(() => {
    handleFencesList(session?.user?.token, editGroupInformation?.uuid)
      .then((response: any) => {
        // @ts-ignore
        setFencesData(response?.data?.document);
      })
      .catch((error: any) => {});
  }, []);

  // if (fencesData?.length === 0) {
  //   return (
  //     <Grid
  //       sx={{
  //         display: "flex",
  //         justifyContent: "center",
  //         alignItems: "center",
  //         height: "100dvh",
  //         zIndex: 1000,
  //         position: "absolute",
  //         width: "100dvw",
  //         backgroundColor: Colors.white,
  //         opacity: 0.5,
  //       }}
  //     >
  //       <CircularProgress sx={{ color: Colors.red, zIndex: 1000 }} size={100} />
  //     </Grid>
  //   );
  // }

  return (
    <>
      <Grid
        onClick={() => {
          setOpenFencesManagementModal(false);
          setOpenViewGroupModal(true);
        }}
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 1000,
          backgroundColor: Colors.white,
          opacity: 0.4,
        }}
      ></Grid>
      <Grid
        sx={{
          zIndex: 1000,
          position: "absolute",
          top: "50%",
          left: {
            xs: "50%",
            sm: "50%",
            md: "360px",
          },
          transform: {
            xs: "translate(-50%, -50%)",
            sm: "translate(-50%, -50%)",
            md: "translate(0, -50%)",
          },
          width: {
            xs: "90%",
            sm: "400px",
          },
          backgroundColor: Colors.black,
          padding: "20px 20px",
          borderRadius: "8px",
        }}
      >
        {/* updated code start */}
        <IconButton
          edge="start"
          color="inherit"
          aria-label="close"
          onClick={() => {
            setOpenViewGroupModal(true);
            setOpenFencesManagementModal(false);
          }}
          sx={{
            position: "absolute",
            right: "6px",
            top: "6px",
            backgroundColor: Colors.red,
            borderRadius: "50px",
            "&:hover": {
              backgroundColor: Colors.red,
            },
          }}
        >
          <CloseIcon sx={{ color: Colors.white, fontSize: "16px" }} />
        </IconButton>
        <Grid>
          <h6
            style={{ color: Colors.blue }}
            className="py-1 px-1 font-bold text-center mb-2"
          >
            Fences List
          </h6>
          <TableContainer component={Paper} sx={{ borderRadius: 0 }}>
            <Table
              sx={{
                minWidth: 100,
              }}
              aria-label="customized table"
            >
              <TableHead>
                <TableRow>
                  <StyledTableCell
                    align="left"
                    sx={{
                      paddingTop: "3px",
                      paddingBottom: "3px",
                      backgroundColor: `${Colors.black} !important`,
                      color: `${Colors.white} !important`,
                    }}
                  >
                    Fences Name
                  </StyledTableCell>

                  <StyledTableCell
                    align="right"
                    sx={{
                      paddingTop: "3px",
                      paddingBottom: "3px",
                      backgroundColor: `${Colors.black} !important`,
                      color: `${Colors.white} !important`,
                    }}
                  >
                    Action
                  </StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {fencesData?.map((row: any, i) => (
                  <StyledTableRow key={row.uuid}>
                    <StyledTableCell
                      align="left"
                      sx={{
                        backgroundColor: `${Colors.black} !important`,
                        color: `${Colors.white} !important`,
                      }}
                    >
                      {row.name}
                    </StyledTableCell>
                    <StyledTableCell
                      align="right"
                      sx={{
                        backgroundColor: `${Colors.black} !important`,
                        color: `${Colors.white} !important`,
                      }}
                    >
                      <Grid
                        sx={{
                          display: "flex",
                          columnGap: "6px",
                          justifyContent: "end",
                          alignItems: "center",
                        }}
                      >
                        <Tooltip title="View Fences">
                          <Button
                            onClick={() => {
                              setOpenViewFencesModal(true);
                              setOpenFencesManagementModal(false);
                              setSingleFences(row);
                              handleSingleGroupInformation(
                                editGroupInformation?.uuid
                              );
                            }}
                            variant="contained"
                            color="primary"
                            sx={{
                              fontSize: "18px",
                              padding: "3px",
                              minWidth: 0,
                              backgroundColor: `${Colors.black} !important`,
                              color: `${Colors.white} !important`,
                              "&:hover": {
                                backgroundColor: Colors.blue,
                              },
                            }}
                          >
                            <MdOutlineVisibility />
                          </Button>
                        </Tooltip>
                      </Grid>
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
        {/* updated code end */}
      </Grid>
    </>
  );
};

export default FencesManagement;
