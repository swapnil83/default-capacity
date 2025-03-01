import React, { useState, useEffect } from "react";
import {
    Box,
    Button,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    SelectChangeEvent,
    Typography,
    Modal
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import Spinner from "../../common/Spinner/Spinner";
import { CalendarizationState, LocationsState, LocationsApiResponseData, CalendarizationApiResponseData } from "./DefaultCapacityFilter.types";
import { locationsData } from "../../../data/locations";
import { calendarizationData } from "../../../data/calendarization";
import { DefaultCapacityState } from "../../../layouts/DefaultCapacity/DefaultCapacity.types";

type DefaultCapacityFilterProps = {
    defaultCapacityFilterState: DefaultCapacityState;
    updateDefaultCapacityState: (newState: Partial<DefaultCapacityState>) => void;
    showDefaultCapacityTable: boolean;
    setShowDefaultCapacityTable: React.Dispatch<React.SetStateAction<boolean>>;
};

const DefaultCapacityFilter: React.FC<DefaultCapacityFilterProps> = ({ defaultCapacityFilterState, updateDefaultCapacityState, showDefaultCapacityTable, setShowDefaultCapacityTable }) => {
    console.log('DefaultCapacityFilter');
    const [locationsState, setLocationsState] = useState<LocationsState>({
        status: 'idle',
        states: [],
        errorMessage: "",
        isLoading: false
    });
    const [calendarizationState, setCalendarizationState] = useState<CalendarizationState>({
        status: 'idle',
        calendarization: [],
        errorMessage: "",
        isLoading: false
    });
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [calendarizationFieldVisibility, setCalendarizationFieldVisibility] = useState<boolean>(false);
    const [dateFieldsVisibility, setDateFieldsVisibility] = useState<boolean>(false);
    const [openConflictModal, setOpenConflictModal] = useState<boolean>(false); // Modal state
    const [conflictMessage, setConflictMessage] = useState<string>("");

    const updateLocations = (newState: Partial<LocationsState>) => {
        setLocationsState((prevState) => ({
            ...prevState,
            ...newState
        }));
    };

    const updateCalendarization = (newState: Partial<CalendarizationState>) => {
        setCalendarizationState((prevState) => ({
            ...prevState,
            ...newState
        }));
    };

    useEffect(() => {
        const fetchLocations = async () => {
            updateLocations({
                isLoading: true
            });

            try {
                // api call to fetch locations
                await new Promise((resolve) => setTimeout(resolve, 1000));

                const response: LocationsApiResponseData = {
                    status: "success",
                    data: locationsData,
                };

                if (response.status === 'success') {
                    updateLocations({
                        status: response.status,
                        states: response.data.locations,
                    });
                } else {
                    updateLocations({
                        status: response.status,
                        errorMessage: response.errorMessage || 'An Unknown error message',
                    });
                }
            } catch (error) {
                updateLocations({
                    status: 'failure',
                    errorMessage: 'Failed to fetch data. Please try again later.',
                });
            } finally {
                updateLocations({
                    isLoading: false
                });
            }
        };

        fetchLocations();
    }, []);

    const fetchCalendarizationData = async () => {
        updateCalendarization({
            isLoading: true,
        });

        try {
            // api call to fetch calendarization
            await new Promise((resolve) => setTimeout(resolve, 1000));

            const response: CalendarizationApiResponseData = {
                status: "success",
                data: calendarizationData,
            };
            if (response.status === 'success') {
                updateCalendarization({
                    status: response.status,
                    calendarization: response.data.calendarization,
                });
                updateDefaultCapacityState({
                    selectedCalendarization: "Default View",
                });
                setCalendarizationFieldVisibility(true);
            } else {
                updateCalendarization({
                    status: response.status,
                    errorMessage: response.errorMessage || 'An Unknown error message',
                });
            }
        } catch (error) {
            updateCalendarization({
                status: 'failure',
                errorMessage: 'Failed to fetch data. Please try again later.',
            });
        } finally {
            updateCalendarization({
                isLoading: false
            });
        }
    };

    // Check if the selected date range overlaps with existing ranges
    const checkDateConflict = (startDate: Date | null, endDate: Date | null) => {
        if (!startDate || !endDate) return false;

        const selectedStart = new Date(startDate);
        const selectedEnd = new Date(endDate);

        const existingRanges = calendarizationState.calendarization.filter(
            (cal) => cal.startDate && cal.endDate && cal.value !== "Default View" && cal.value !== "Add Calendarization"
        );

        for (const range of existingRanges) {
            const rangeStart = new Date(range.startDate!);
            const rangeEnd = new Date(range.endDate!);

            // Check for overlap
            if (selectedStart <= rangeEnd && selectedEnd >= rangeStart) {
                setConflictMessage(
                    `The selected date range conflicts with "${range.value}" (${range.startDate} - ${range.endDate}).`
                );
                return true;
            }
        }
        return false;
    };

    const handleStateChange = (event: SelectChangeEvent) => {
        updateDefaultCapacityState({
            selectedState: event.target.value,
            selectedMarket: "",
            selectedTerritory: "",
        });

        if (calendarizationFieldVisibility) {
            setCalendarizationFieldVisibility(false);
        }

        if (showDefaultCapacityTable) {
            setShowDefaultCapacityTable(false);
        }

        setErrors({ ...errors, state: '' });
    };

    const handleMarketChange = (event: SelectChangeEvent) => {
        updateDefaultCapacityState({
            selectedMarket: event.target.value,
            selectedTerritory: "",
        });

        if (calendarizationFieldVisibility) {
            setCalendarizationFieldVisibility(false);
        }

        if (showDefaultCapacityTable) {
            setShowDefaultCapacityTable(false);
        }

        setErrors({ ...errors, market: '' });
    };

    const handleTerritoryChange = (event: SelectChangeEvent) => {
        updateDefaultCapacityState({
            selectedTerritory: event.target.value,
        });
        setErrors({ ...errors, territory: '' });

        if (calendarizationFieldVisibility) {
            setCalendarizationFieldVisibility(false);
        }

        if (showDefaultCapacityTable) {
            setShowDefaultCapacityTable(false);
        }

        // fetch calendarization data for selected state, market and territory
        fetchCalendarizationData();
    };

    const handleCalendarizationChange = (event: SelectChangeEvent) => {
        const value = event.target.value;
        updateDefaultCapacityState({
            selectedCalendarization: value,
        });
        setErrors({ ...errors, startDate: '', endDate: '' });

        if (showDefaultCapacityTable) {
            setShowDefaultCapacityTable(false);
        }

        const selectedCal = calendarizationState.calendarization.find(cal => cal.value === value);
        if (selectedCal) {
            if (value === "Default View") {
                updateDefaultCapacityState({
                    startDate: null,
                    endDate: null
                });
                setDateFieldsVisibility(false);
            } else if (value === "Add Calendarization") {
                updateDefaultCapacityState({
                    startDate: null,
                    endDate: null
                });
                setDateFieldsVisibility(false);
            } else if (selectedCal.startDate && selectedCal.endDate) {
                updateDefaultCapacityState({
                    startDate: new Date(selectedCal.startDate),
                    endDate: new Date(selectedCal.endDate)
                });
                setDateFieldsVisibility(true);
                setErrors({});
            }
        }
    };

    const handleEndDateChange = (newValue: Date | null) => {
        updateDefaultCapacityState({ endDate: newValue });
        setErrors({ ...errors, endDate: "" });

        if (defaultCapacityFilterState.selectedCalendarization === "Add Calendarization" && newValue) {
            const hasConflict = checkDateConflict(defaultCapacityFilterState.startDate, newValue);
            if (hasConflict) {
                setOpenConflictModal(true); // Show modal if conflict detected
            }
        }
    };

    const handleClear = () => {
        updateDefaultCapacityState({
            selectedState: "",
            selectedMarket: "",
            selectedTerritory: "",
            selectedCalendarization: "Default View",
            startDate: null,
            endDate: null
        });
        setErrors({});
        setDateFieldsVisibility(false);
        setCalendarizationFieldVisibility(false);
        setShowDefaultCapacityTable(false);
    };

    const validateForm = () => {
        let newErrors: { [key: string]: string } = {};

        // always validate state as it's always enabled initially
        if (!defaultCapacityFilterState.selectedState) {
            newErrors.state = 'State is required';
        }

        // validate market only if state is selected (market field is enabled)
        if (defaultCapacityFilterState.selectedState && !defaultCapacityFilterState.selectedMarket) {
            newErrors.market = 'Market is required';
        }

        // validate territory only if market is selected (territory field is enabled)
        if (defaultCapacityFilterState.selectedMarket && !defaultCapacityFilterState.selectedTerritory) {
            newErrors.territory = 'Service Territory is required';
        }

        // calendarization validation
        if (defaultCapacityFilterState.selectedCalendarization === "Add Calendarization") {
            if (!defaultCapacityFilterState.startDate) newErrors.startDate = 'Start Date is required';
            if (!defaultCapacityFilterState.endDate) newErrors.endDate = 'End Date is required';
            if (defaultCapacityFilterState.startDate && defaultCapacityFilterState.endDate && defaultCapacityFilterState.startDate > defaultCapacityFilterState.endDate) {
                newErrors.endDate = 'End Date must be after Start Date';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSearch = () => {
        if (validateForm()) {
            setShowDefaultCapacityTable(true);
            console.log("Searching with:", defaultCapacityFilterState);
        }
    };

    const handleCloseModal = () => {
        setOpenConflictModal(false);
        updateDefaultCapacityState({ startDate: null, endDate: null }); // Reset dates on conflict
    };

    const marketsForSelectedState = locationsState.states.find(
        (stateItem) => stateItem.state === defaultCapacityFilterState.selectedState
    )?.markets || [];

    const territoriesForSelectedMarket = marketsForSelectedState.find(
        (market) => market.market === defaultCapacityFilterState.selectedMarket
    )?.serviceTerritories || [];

    const renderError = (field: string) => {
        if (errors[field]) {
            return (
                <Box sx={{ mt: 1, color: 'red', fontSize: '1rem', textAlign: 'left' }}>
                    {errors[field]}
                </Box>
            );
        }
        return null;
    };

    const showDateFields = defaultCapacityFilterState.selectedCalendarization === "Add Calendarization" ||
        (defaultCapacityFilterState.selectedCalendarization !== "Default View" && dateFieldsVisibility);

    // Determine if the Clear button should be disabled
    const isClearDisabled =
        !defaultCapacityFilterState.selectedState &&
        !defaultCapacityFilterState.selectedMarket &&
        !defaultCapacityFilterState.selectedTerritory &&
        defaultCapacityFilterState.selectedCalendarization === "Default View" &&
        !defaultCapacityFilterState.startDate &&
        !defaultCapacityFilterState.endDate;

    return (
        <>
            {(locationsState.isLoading || calendarizationState.isLoading) && <Spinner />}
            <Box>
                {(locationsState.status === 'failure' || (locationsState.status === 'success' && locationsState.states.length === 0)) && (
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
                        {locationsState.status === 'failure'
                            ? `API Error: ${locationsState.errorMessage}`
                            : 'No Data Available.'}
                    </Box>
                )}

                {/* First Row: State, Market, Territory */}
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, marginBottom: 5 }}>
                    <FormControl fullWidth sx={{ width: { xs: "100%", sm: "250px" } }} disabled={locationsState.states.length === 0 || dateFieldsVisibility}>
                        <InputLabel
                            sx={{
                                '&.Mui-focused': {
                                    color: 'black',
                                },
                            }}
                        >
                            State
                        </InputLabel>
                        <Select value={defaultCapacityFilterState.selectedState} onChange={handleStateChange} label="State">
                            {locationsState.states.map((state) => (
                                <MenuItem key={state.state} value={state.state}>
                                    {state.state}
                                </MenuItem>
                            ))}
                        </Select>
                        {renderError('state')}
                    </FormControl>

                    <FormControl fullWidth sx={{ width: { xs: "100%", sm: "250px" } }} disabled={!defaultCapacityFilterState.selectedState || dateFieldsVisibility}>
                        <InputLabel
                            sx={{
                                '&.Mui-focused': {
                                    color: 'black',
                                },
                            }}
                        >
                            Market
                        </InputLabel>
                        <Select value={defaultCapacityFilterState.selectedMarket} onChange={handleMarketChange} label="Market">
                            {marketsForSelectedState.map((market) => (
                                <MenuItem key={market.market} value={market.market}>
                                    {market.market}
                                </MenuItem>
                            ))}
                        </Select>
                        {renderError('market')}
                    </FormControl>

                    <FormControl fullWidth sx={{ width: { xs: "100%", sm: "250px" } }} disabled={!defaultCapacityFilterState.selectedMarket || dateFieldsVisibility}>
                        <InputLabel
                            sx={{
                                '&.Mui-focused': {
                                    color: 'black',
                                },
                            }}
                        >
                            Service Territory
                        </InputLabel>
                        <Select value={defaultCapacityFilterState.selectedTerritory} onChange={handleTerritoryChange} label="Service Territory">
                            {territoriesForSelectedMarket.map((territory) => (
                                <MenuItem key={territory.territory} value={territory.territory}>
                                    {territory.territory}
                                </MenuItem>
                            ))}
                        </Select>
                        {renderError('territory')}
                    </FormControl>
                </Box>

                {/* Second Row: Calendarization, Start Date, End Date */}
                {calendarizationFieldVisibility && (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, marginBottom: 5 }}>
                        <FormControl fullWidth sx={{ width: { xs: "100%", sm: "250px" } }} disabled={locationsState.states.length === 0}>
                            <InputLabel
                                sx={{
                                    '&.Mui-focused': {
                                        color: 'black',
                                    },
                                }}
                            >
                                Calendarization
                            </InputLabel>
                            <Select value={defaultCapacityFilterState.selectedCalendarization} onChange={handleCalendarizationChange} label="Calendarization">
                                {calendarizationState.calendarization.map((cal) => (
                                    <MenuItem key={cal.value} value={cal.value}>
                                        {cal.value}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        {showDateFields && (
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <Box sx={{ display: "flex", flexDirection: "column" }}>
                                    <DatePicker
                                        label="Start Date"
                                        value={defaultCapacityFilterState.startDate}
                                        onChange={(newValue) => {
                                            updateDefaultCapacityState({
                                                startDate: newValue,
                                            });
                                            setErrors({ ...errors, startDate: '' });
                                        }}
                                        minDate={new Date()}
                                        // slotProps={{ textField: { sx: { width: { xs: "100%", sm: "250px" } } } }}
                                        slotProps={{
                                            textField: {
                                                sx: {
                                                    width: { xs: "100%", sm: "250px" },
                                                    '& .MuiOutlinedInput-root': {
                                                        '& fieldset': {
                                                            borderColor: '#ccc', // Normal border color
                                                        },
                                                        '&:hover fieldset': {
                                                            borderColor: '#ccc', // Normal border color on hover
                                                        },
                                                        '&.Mui-focused fieldset': {
                                                            borderColor: '#ccc', // Normal border color when focused
                                                        },
                                                        '&.Mui-error fieldset': {
                                                            borderColor: '#ccc', // Override error state border color
                                                        },
                                                    },
                                                    '& .MuiInputLabel-root': {
                                                        color: '#000', // Normal label color
                                                    },
                                                    '& .MuiInputLabel-root.Mui-focused': {
                                                        color: '#000', // Normal label color when focused
                                                    },
                                                    '& .MuiInputLabel-root.Mui-error': {
                                                        color: '#000', // Override error state label color
                                                    },
                                                },
                                            },
                                        }}
                                    />
                                    {renderError('startDate')}
                                </Box>
                                <Box sx={{ display: "flex", flexDirection: "column" }}>
                                    <DatePicker
                                        label="End Date"
                                        value={defaultCapacityFilterState.endDate}
                                        onChange={handleEndDateChange}
                                        minDate={defaultCapacityFilterState.startDate ? new Date(defaultCapacityFilterState.startDate.getTime() + 24 * 60 * 60 * 1000) : new Date()}
                                        disabled={!defaultCapacityFilterState.startDate}
                                        slotProps={{ textField: { sx: { width: { xs: "100%", sm: "250px" } } } }}
                                    />
                                    {renderError('endDate')}
                                </Box>
                            </LocalizationProvider>
                        )}
                    </Box>
                )}

                <Box sx={{ display: "flex", gap: 2 }}>
                    <Button
                        variant="contained"
                        onClick={handleSearch}
                        sx={{
                            backgroundColor: '#ffcc00',
                            color: '#000000',
                            '&:hover': {
                                backgroundColor: '#ffaa00'
                            },
                            fontWeight: 'bold',
                        }}
                    >
                        View
                    </Button>
                    <Button
                        variant="outlined"
                        onClick={handleClear}
                        disabled={isClearDisabled}
                        sx={{
                            borderColor: '#ffcc00',
                            color: '#ffcc00',
                            '&:hover': {
                                borderColor: '#ffaa00',
                                color: '#ffaa00',
                            },
                            fontWeight: 'bold',
                        }}
                    >
                        Clear
                    </Button>
                </Box>

                {/* Conflict Modal */}
                <Modal open={openConflictModal} onClose={handleCloseModal}>
                    <Box
                        sx={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            width: 400,
                            bgcolor: "background.paper",
                            border: "2px solid #000",
                            boxShadow: 24,
                            borderRadius: '20px',
                            p: 4,
                        }}
                    >
                        <Typography variant="h6" component="h2">
                            Date Range Conflict
                        </Typography>
                        <Typography sx={{ mt: 2 }}>{conflictMessage}</Typography>
                        <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
                            <Button onClick={handleCloseModal} variant="contained" sx={{ backgroundColor: '#ffcc00', color: '#000000', fontWeight: 'bold' }}>
                                OK
                            </Button>
                        </Box>
                    </Box>
                </Modal>
            </Box>
        </>
    );
};

export default DefaultCapacityFilter;