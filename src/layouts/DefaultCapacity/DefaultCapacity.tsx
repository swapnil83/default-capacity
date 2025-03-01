import React, { useState } from 'react';
import { Box } from '@mui/material';

import PageTitle from '../../components/common/PageTitle/PageTitle';
import DefaultCapacityFilter from '../../components/capacity/DefaultCapacityFilter/DefaultCapacityFilter';
import DefaultCapacityTable from '../../components/capacity/DefaultCapacityTable/DefaultCapacityTable';
import { DefaultCapacityFilterState, LocationsState } from '../../components/capacity/DefaultCapacityFilter/DefaultCapacityFilter.types';
import { DefaultCapacityTableState } from '../../components/capacity/DefaultCapacityTable/DefaultCapacityTable.types';

type DefaultCapacityProps = {

};

const DefaultCapacity: React.FC<DefaultCapacityProps> = () => {
    console.log('DefaultCapacity');
    const [defaultCapacityFilterState, setDefaultCapacityFilterState] = useState<DefaultCapacityFilterState>({
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
    const [locationsState, setLocationsState] = useState<LocationsState>({
        status: 'idle',
        states: [],
        errorMessage: "",
        isLoading: false
    });
    const [showDefaultCapacityTable, setShowDefaultCapacityTable] = useState<boolean>(false);
    const [calendarizationFieldVisibility, setCalendarizationFieldVisibility] = useState<boolean>(false);
    const [dateFieldsVisibility, setDateFieldsVisibility] = useState<boolean>(false);
    const [isTableDataEdited, setIsTableDataEdited] = useState<boolean>(false);

    const updateDefaultCapacityFilterState = (newState: Partial<DefaultCapacityFilterState>) => {
        setDefaultCapacityFilterState((prevState) => ({
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

    const updateLocations = (newState: Partial<LocationsState>) => {
        setLocationsState((prevState) => ({
            ...prevState,
            ...newState
        }));
    };

    return (
        <Box display={'flex'} flexDirection={'column'} gap={5}>
            <PageTitle title='Default Capacity' backgroundColor='#ffcc00' />
            <Box sx={{ padding: 3 }}>
                <DefaultCapacityFilter
                    defaultCapacityFilterState={defaultCapacityFilterState}
                    updateDefaultCapacityFilterState={updateDefaultCapacityFilterState}
                    showDefaultCapacityTable={showDefaultCapacityTable}
                    setShowDefaultCapacityTable={setShowDefaultCapacityTable}
                    calendarizationFieldVisibility={calendarizationFieldVisibility}
                    setCalendarizationFieldVisibility={setCalendarizationFieldVisibility}
                    locationsState={locationsState}
                    updateLocations={updateLocations}
                    dateFieldsVisibility={dateFieldsVisibility}
                    setDateFieldsVisibility={setDateFieldsVisibility}
                />
                {
                    showDefaultCapacityTable &&
                    <DefaultCapacityTable
                        startDate={defaultCapacityFilterState.startDate}
                        endDate={defaultCapacityFilterState.endDate}
                        selectedCalendarization={defaultCapacityFilterState.selectedCalendarization}
                        defaultCapacityTableState={defaultCapacityTableState}
                        updateDefaultCapacityTableState={updateDefaultCapacityTableState}
                        setShowDefaultCapacityTable={setShowDefaultCapacityTable}
                        updateDefaultCapacityFilterState={updateDefaultCapacityFilterState}
                        setCalendarizationFieldVisibility={setCalendarizationFieldVisibility}
                        setDateFieldsVisibility={setDateFieldsVisibility}
                        isTableDataEdited={isTableDataEdited}
                        setIsTableDataEdited={setIsTableDataEdited}
                    />
                }
            </Box>
        </Box>
    );
};

export default DefaultCapacity;