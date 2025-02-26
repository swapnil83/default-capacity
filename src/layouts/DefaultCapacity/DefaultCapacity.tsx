import React, { useState } from 'react';
import { Box } from '@mui/material';

import PageTitle from '../../components/common/PageTitle/PageTitle';
import DefaultCapacityFilter from '../../components/capacity/DefaultCapacityFilter/DefaultCapacityFilter';
import DefaultCapacityTable from '../../components/capacity/DefaultCapacityTable/DefaultCapacityTable';
import { DefaultCapacityState, DefaultCapacityTableState } from './DefaultCapacity.types';

type DefaultCapacityProps = {

};

const DefaultCapacity: React.FC<DefaultCapacityProps> = () => {
    console.log('DefaultCapacity');
    const [defaultCapacityState, setDefaultCapacityState] = useState<DefaultCapacityState>({
        selectedState: "",
        selectedMarket: "",
        selectedTerritory: "",
        selectedCalendarization: "Default View",
        startDate: null,
        endDate: null
    });
    const [defaultCapacityTableState, setDefaultCapacityTableState] = useState<DefaultCapacityTableState>({
        status: 'idle',
        data: {
            capacitySlots: [],
            appointmentFreeze: []
        },
        errorMessage: "",
        isLoading: false
    });
    const [showDefaultCapacityTable, setShowDefaultCapacityTable] = useState<boolean>(false);

    const updateDefaultCapacityState = (newState: Partial<DefaultCapacityState>) => {
        setDefaultCapacityState((prevState) => ({
            ...prevState,
            ...newState
        }));
    };

    const updateDefaultCapacityTableState = (newState: Partial<DefaultCapacityTableState>) => {
        setDefaultCapacityTableState((prevState) => ({
            ...prevState,
            ...newState
        }));
    };

    return (
        <Box display={'flex'} flexDirection={'column'} gap={5}>
            <PageTitle title='Default Capacity' backgroundColor='#ffcc00' />
            <Box sx={{ padding: 3 }}>
                <DefaultCapacityFilter
                    defaultCapacityState={defaultCapacityState}
                    updateDefaultCapacityState={updateDefaultCapacityState}
                    showDefaultCapacityTable={showDefaultCapacityTable}
                    setShowDefaultCapacityTable={setShowDefaultCapacityTable}
                />
                {
                    showDefaultCapacityTable &&
                    <DefaultCapacityTable
                        startDate={defaultCapacityState.startDate}
                        endDate={defaultCapacityState.endDate}
                        selectedCalendarization={defaultCapacityState.selectedCalendarization}
                        defaultCapacityTableState={defaultCapacityTableState}
                        updateDefaultCapacityTableState={updateDefaultCapacityTableState}
                    />
                }
            </Box>
        </Box>
    );
};

export default DefaultCapacity;