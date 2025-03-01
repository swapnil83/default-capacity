{/* <FormControl fullWidth sx={{ width: { xs: "100%", sm: "250px" } }} disabled={locationsState.states.length === 0 || dateFieldsVisibility}>
    <InputLabel
        sx={{
            // Position label at top-left
            transform: 'translate(0, -1.5rem) scale(0.75)',
            transformOrigin: 'top left',
            position: 'absolute',
            top: 0,
            left: 0,
            // Dynamic color based on error state
            color: errors.state ? 'red' : '#000',
            fontWeight: 'bold',
            // Maintain color on focus
            '&.Mui-focused': {
                color: errors.state ? 'red' : '#000',
            },
        }}
    >
        State*
    </InputLabel>
    <Select
        value={defaultCapacityFilterState.selectedState}
        onChange={handleStateChange}
        displayEmpty  // Allows showing placeholder when no value is selected
        renderValue={(selected) => {
            if (!selected) {
                return <span style={{ color: '#aaa' }}>--Select--</span>; // Placeholder text
            }
            return selected;
        }}
        sx={{
            // Remove all borders except bottom
            '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
            '& .MuiSelect-select': {
                // Dynamic bottom border color based on error state
                borderBottom: errors.state
                    ? '1px solid red' // Red border when error exists
                    : '1px solid #ffcc00', // Default yellow border
                '&:focus': {
                    borderBottom: errors.state
                        ? '1px solid red' // Red thicker border on focus with error
                        : '1px solid #ffaa00', // Darker yellow on focus without error
                    backgroundColor: 'transparent', // Remove default focus background
                },
            },
            // Remove border on focus
            '&:hover .MuiSelect-select': {
                borderBottom: errors.state
                    ? '1px solid red' // Maintain red on hover with error
                    : '1px solid #ffaa00', // Darker yellow on hover without error
            },
            '& .MuiSelect-icon': {
                color: 'rgba(0, 0, 0, 0.54)', // Dropdown arrow color
            },
        }}
    >
        {locationsState.states.map((state) => (
            <MenuItem key={state.state} value={state.state}>
                {state.state}
            </MenuItem>
        ))}
    </Select>
    {renderError('state')}
</FormControl> */}