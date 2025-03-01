import React, { useEffect, useState } from 'react';
import { Box, Button, IconButton, Modal, Typography } from "@mui/material";
import BulkSubmissionIcon from '@mui/icons-material/Publish';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import ReplayIcon from '@mui/icons-material/Replay';

import CapacitySlots from '../CapacitySlots/CapacitySlots';
import AppointmentSlots from '../AppointmentFreeze/AppointmentSlots';
import { capacitySlotsAppointmentFreezeData } from '../../../data/capacitySlots-appointmentFreeze';
import { DefaultCapacityTableApiResponseData, DefaultCapacityTableState } from './DefaultCapacityTable.types';
import { DefaultCapacityFilterState } from '../DefaultCapacityFilter/DefaultCapacityFilter.types';
import Spinner from '../../common/Spinner/Spinner';
import '../../../index.css';

type DefaultCapacityTableProps = {
    startDate: Date | null;
    endDate: Date | null;
    selectedCalendarization: string;
    defaultCapacityTableState: DefaultCapacityTableState;
    updateDefaultCapacityTableState: (newState: Partial<DefaultCapacityTableState>) => void;
    setShowDefaultCapacityTable: React.Dispatch<React.SetStateAction<boolean>>;
    updateDefaultCapacityFilterState: (newState: Partial<DefaultCapacityFilterState>) => void;
    setCalendarizationFieldVisibility: React.Dispatch<React.SetStateAction<boolean>>;
    setDateFieldsVisibility: React.Dispatch<React.SetStateAction<boolean>>;
    isTableDataEdited: boolean;
    setIsTableDataEdited: React.Dispatch<React.SetStateAction<boolean>>;
};

const DefaultCapacityTable: React.FC<DefaultCapacityTableProps> = ({
    startDate,
    endDate,
    selectedCalendarization,
    defaultCapacityTableState,
    updateDefaultCapacityTableState,
    setShowDefaultCapacityTable,
    updateDefaultCapacityFilterState,
    setCalendarizationFieldVisibility,
    setDateFieldsVisibility,
    isTableDataEdited,
    setIsTableDataEdited,
}) => {
    const [initialData, setInitialData] = useState<DefaultCapacityTableState["data"]>({
        capacitySlots: [],
        appointmentFreeze: [],
    });
    const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);
    const [openResetModal, setOpenResetModal] = useState<boolean>(false);

    const deleteIconDisabled = selectedCalendarization === "Default View" || selectedCalendarization === "Add Calendarization";

    useEffect(() => {
        const fetchCapacitySlotsAppointmentFreezeData = async () => {
            updateDefaultCapacityTableState({
                isLoading: true
            });

            try {
                // api call to fetch locations
                await new Promise((resolve) => setTimeout(resolve, 1000));

                const response: DefaultCapacityTableApiResponseData = {
                    status: "success",
                    data: capacitySlotsAppointmentFreezeData,
                };

                if (response.status === 'success') {
                    updateDefaultCapacityTableState({
                        status: response.status,
                        data: response.data
                    });
                    // Store initial data for reset functionality
                    setInitialData(response.data);
                } else {
                    updateDefaultCapacityTableState({
                        status: response.status,
                        errorMessage: response.errorMessage || 'An Unknown error message',
                    });
                }
            } catch (error) {
                updateDefaultCapacityTableState({
                    status: 'failure',
                    errorMessage: 'Failed to fetch data. Please try again later.',
                });
            } finally {
                updateDefaultCapacityTableState({
                    isLoading: false
                });
            }
        }

        fetchCapacitySlotsAppointmentFreezeData();
    }, []);

    // Monitor changes to table data to enable/disable Reset button
    useEffect(() => {
        const hasDataChanged =
            JSON.stringify(defaultCapacityTableState.data) !== JSON.stringify(initialData);
        setIsTableDataEdited(hasDataChanged);
    }, [defaultCapacityTableState.data, initialData, setIsTableDataEdited]);

    const handleDeleteClick = () => {
        if (!deleteIconDisabled) {
            setOpenDeleteModal(true); // Show delete confirmation modal
        }
    };

    const handleConfirmDelete = () => {
        // Implement delete logic here (e.g., clear data or call an API)
        setShowDefaultCapacityTable(false);
        setOpenDeleteModal(false);
        updateDefaultCapacityFilterState({
            selectedState: "",
            selectedMarket: "",
            selectedTerritory: "",
            selectedCalendarization: "Default View",
            startDate: null,
            endDate: null
        });
        setCalendarizationFieldVisibility(false);
        setDateFieldsVisibility(false);
        setIsTableDataEdited(false);
        console.log('Data deleted');
    };

    const handleCancelDelete = () => {
        setOpenDeleteModal(false);
    };

    const handleResetClick = () => {
        if (isTableDataEdited) {
            setOpenResetModal(true); // Show reset confirmation modal
        }
    };

    const handleConfirmReset = () => {
        // Reset data to initial state
        updateDefaultCapacityTableState({ data: initialData });
        setOpenResetModal(false);
        setIsTableDataEdited(false);
        console.log('Data reset to initial state');
    };

    const handleCancelReset = () => {
        setOpenResetModal(false);
    };

    return (
        <>
            {defaultCapacityTableState.isLoading && <Spinner />}
            <Box>
                {(defaultCapacityTableState.status === 'failure') && (
                    <Box
                        sx={{
                            backgroundColor: '#ffebee',
                            color: '#d32f2f',
                            padding: 2,
                            borderRadius: 1,
                            marginBottom: 2,
                            fontWeight: 'bold',
                        }}
                    >
                        {`API Error: ${defaultCapacityTableState.errorMessage}`}
                    </Box>
                )}
                <div
                    style={{
                        margin: '40px 0',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '50px',
                        padding: '20px',
                        border: '1px solid #000',
                        borderRadius: '4px'
                    }}
                >
                    <div
                        style={{
                            display: 'flex',
                            gap: '10px',
                            alignSelf: 'flex-end'
                        }}
                    >
                        <IconButton
                            onClick={handleResetClick}
                            disabled={!isTableDataEdited}
                            sx={{
                                '&:disabled svg': { color: '#d3d3d3' },
                                '&:not(:disabled) svg': { color: '#ffcc00' },
                            }}
                        >
                            <ReplayIcon sx={{ color: '#ffcc00' }} />
                        </IconButton>
                        <IconButton>
                            <BulkSubmissionIcon sx={{ color: '#ffcc00' }} />
                        </IconButton>
                        <IconButton>
                            <SaveIcon sx={{ color: '#ffcc00' }} />
                        </IconButton>
                        <IconButton
                            disabled={deleteIconDisabled}
                            onClick={handleDeleteClick}
                            sx={{
                                '&:disabled svg': {
                                    color: '#d3d3d3',
                                },
                                '&:not(:disabled) svg': {
                                    color: '#ffcc00',
                                },
                            }}
                        >
                            <DeleteIcon />
                        </IconButton>
                    </div>
                    <div
                        className='table-container'
                        style={{
                            display: 'flex',
                            overflow: 'auto',
                            gap: '50px',
                            paddingInline: '10px',
                        }}
                    >
                        <div style={{ flex: '0 0 auto', minWidth: '800px' }}>
                            {
                                defaultCapacityTableState.data.capacitySlots.length !== 0 &&
                                <CapacitySlots
                                    capacitySlotsData={defaultCapacityTableState.data?.capacitySlots}
                                    defaultCapacityTableState={defaultCapacityTableState}
                                    updateDefaultCapacityTableState={updateDefaultCapacityTableState}
                                    startDate={startDate}
                                    endDate={endDate}
                                />
                            }
                        </div>
                        <div style={{ flex: '0 0 auto', minWidth: '600px' }}>
                            {
                                defaultCapacityTableState.data.appointmentFreeze.length !== 0 &&
                                <AppointmentSlots
                                    appointmentFreezeData={defaultCapacityTableState.data?.appointmentFreeze}
                                    defaultCapacityTableState={defaultCapacityTableState}
                                    updateDefaultCapacityTableState={updateDefaultCapacityTableState}
                                    startDate={startDate}
                                    endDate={endDate}
                                />
                            }
                        </div>
                    </div>
                </div>

                {/* Delete Confirmation Modal */}
                <Modal open={openDeleteModal} onClose={handleCancelDelete}>
                    <Box
                        sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: 400,
                            bgcolor: 'background.paper',
                            border: '2px solid #000',
                            boxShadow: 24,
                            borderRadius: '20px',
                            p: 4,
                        }}
                    >
                        <Typography variant="h6" component="h2">
                            Confirm Deletion
                        </Typography>
                        <Typography sx={{ mt: 2 }}>
                            Are you sure you want to delete the data? This action cannot be undone.
                        </Typography>
                        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                            <Button
                                onClick={handleCancelDelete}
                                variant="outlined"
                                sx={{ borderColor: '#ffcc00', color: '#ffcc00', fontWeight: 'bold' }}
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleConfirmDelete}
                                variant="contained"
                                sx={{ backgroundColor: '#ffcc00', color: '#000000', fontWeight: 'bold' }}
                            >
                                Delete
                            </Button>
                        </Box>
                    </Box>
                </Modal>

                {/* Reset Confirmation Modal */}
                <Modal open={openResetModal} onClose={handleCancelReset}>
                    <Box
                        sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: 400,
                            bgcolor: 'background.paper',
                            border: '2px solid #000',
                            boxShadow: 24,
                            borderRadius: '20px',
                            p: 4,
                        }}
                    >
                        <Typography variant="h6" component="h2">
                            Confirm Reset
                        </Typography>
                        <Typography sx={{ mt: 2 }}>
                            Are you sure you want to reset the data to its initial state? All changes will be lost.
                        </Typography>
                        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                            <Button
                                onClick={handleCancelReset}
                                variant="outlined"
                                sx={{ borderColor: '#ffcc00', color: '#ffcc00', fontWeight: 'bold' }}
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleConfirmReset}
                                variant="contained"
                                sx={{ backgroundColor: '#ffcc00', color: '#000000', fontWeight: 'bold' }}
                            >
                                Reset
                            </Button>
                        </Box>
                    </Box>
                </Modal>
            </Box>
        </>
    );
};

export default DefaultCapacityTable;