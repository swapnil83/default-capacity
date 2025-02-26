import React, { useEffect } from 'react';
import { Box, IconButton } from "@mui/material";
import BulkSubmissionIcon from '@mui/icons-material/Publish';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import ReplayIcon from '@mui/icons-material/Replay';

import CapacitySlots from '../CapacitySlots/CapacitySlots';
import AppointmentSlots from '../AppointmentFreeze/AppointmentSlots';
import { capacitySlotsAppointmentFreezeData } from '../../../data/capacitySlots-appointmentFreeze';
import { DefaultCapacityTableApiResponseData, DefaultCapacityTableState } from './DefaultCapacityTable.types';
import Spinner from '../../common/Spinner/Spinner';
import '../../../index.css';

type DefaultCapacityTableProps = {
    startDate: Date | null;
    endDate: Date | null;
    selectedCalendarization: string;
    defaultCapacityTableState: DefaultCapacityTableState;
    updateDefaultCapacityTableState: (newState: Partial<DefaultCapacityTableState>) => void;
};

const DefaultCapacityTable: React.FC<DefaultCapacityTableProps> = ({ startDate, endDate, selectedCalendarization, defaultCapacityTableState, updateDefaultCapacityTableState }) => {

    const deleteIconDisabled = selectedCalendarization === "Default View" || selectedCalendarization === "Add Calendarization";
    const handleDeleteClick = () => {
        if (!deleteIconDisabled) {
            console.log('Deleted');
        }
    };

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
                        <IconButton>
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
            </Box>
        </>
    );
};

export default DefaultCapacityTable;