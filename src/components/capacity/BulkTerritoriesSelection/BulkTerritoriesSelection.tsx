import React, { useState } from "react";
import { Drawer, IconButton, Typography, Box } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

import { Market, ServiceTerritory, State } from "../DefaultCapacityFilter/DefaultCapacityFilter.types";
import TreeViewWithCheckboxes from "../TreeViewWithCheckboxes/TreeViewWithCheckboxes";

interface BulkTerritoriesSelectionProps {
    open: boolean;
    onClose: () => void;
    locationsData: State[];
}

export const isNodeIndeterminate = (node: State | Market | ServiceTerritory, selected: Set<number>): boolean => {
    if ('markets' in node) {
        const totalMarkets = node.markets.length;
        const selectedMarkets = node.markets.filter((market) => selected.has(market.id)).length;
        const partiallySelectedMarkets = node.markets.some((market) => isNodeIndeterminate(market, selected));
        return (selectedMarkets > 0 && selectedMarkets < totalMarkets) || partiallySelectedMarkets;
    } else if ('serviceTerritories' in node) {
        const totalTerritories = node.serviceTerritories.length;
        const selectedTerritories = node.serviceTerritories.filter((territory) => selected.has(territory.id)).length;
        return selectedTerritories > 0 && selectedTerritories < totalTerritories;
    }
    return false;
};

const BulkTerritoriesSelection: React.FC<BulkTerritoriesSelectionProps> = ({ open, onClose, locationsData }) => {
    const [selected, setSelected] = useState<Set<number>>(new Set());

    const handleSelect = (id: number, checked: boolean) => {
        const newSelected = new Set(selected);

        const updateSelections = (node: State | Market | ServiceTerritory, targetId: number, isChecked: boolean) => {
            if (node.id === targetId) {
                if (isChecked) {
                    newSelected.add(node.id);
                    if ('markets' in node) {
                        node.markets.forEach((market) => updateSelections(market, market.id, true));
                    } else if ('serviceTerritories' in node) {
                        node.serviceTerritories.forEach((territory) => updateSelections(territory, territory.id, true));
                    }
                } else {
                    newSelected.delete(node.id);
                    if ('markets' in node) {
                        node.markets.forEach((market) => updateSelections(market, market.id, false));
                    } else if ('serviceTerritories' in node) {
                        node.serviceTerritories.forEach((territory) => updateSelections(territory, territory.id, false));
                    }
                }
            } else {
                if ('markets' in node) {
                    node.markets.forEach((market) => updateSelections(market, targetId, isChecked));
                    const allMarketsSelected = node.markets.every((market) => newSelected.has(market.id));
                    const someMarketsSelected = node.markets.some((market) => newSelected.has(market.id) || isNodeIndeterminate(market, newSelected));
                    if (allMarketsSelected) newSelected.add(node.id);
                    else if (someMarketsSelected) newSelected.delete(node.id);
                } else if ('serviceTerritories' in node) {
                    node.serviceTerritories.forEach((territory) => updateSelections(territory, targetId, isChecked));
                    const allTerritoriesSelected = node.serviceTerritories.every((territory) => newSelected.has(territory.id));
                    const someTerritoriesSelected = node.serviceTerritories.some((territory) => newSelected.has(territory.id) || isNodeIndeterminate(territory, newSelected));
                    if (allTerritoriesSelected) newSelected.add(node.id);
                    else if (someTerritoriesSelected) newSelected.delete(node.id);
                }
            }
        };

        locationsData.forEach((state) => updateSelections(state, id, checked));
        setSelected(newSelected);
    };

    // Function to transform selected IDs into a nested structure
    const getSelectedLocations = (): State[] => {
        const selectedLocations = locationsData
            .filter((state) => selected.has(state.id) || state.markets.some((market) => selected.has(market.id)))
            .map((state) => ({
                ...state,
                markets: state.markets
                    .filter((market) => selected.has(market.id) || market.serviceTerritories.some((territory) => selected.has(territory.id)))
                    .map((market) => ({
                        ...market,
                        serviceTerritories: market.serviceTerritories.filter((territory) => selected.has(territory.id)),
                    })),
            }));

        return selectedLocations;
    };

    // Example usage: Log selected locations
    const logSelectedLocations = () => {
        const selectedLocations = getSelectedLocations();
        console.log(selectedLocations);
    };

    return (
        <Drawer anchor="right" open={open} onClose={onClose}>
            <Box sx={{ width: 350, padding: 2 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6">Apply to multiple territories</Typography>
                    <IconButton onClick={onClose}>
                        <CloseIcon />
                    </IconButton>
                </Box>
                <Typography variant="body1" sx={{ mt: 2 }}>
                    Select the territories you want to apply changes to.
                </Typography>
                <Box sx={{ mt: 2 }}>
                    <TreeViewWithCheckboxes locationsData={locationsData} selected={selected} onSelect={handleSelect} />
                </Box>
                <Box sx={{ mt: 2 }}>
                    <button onClick={logSelectedLocations}>Log Selected Locations</button>
                </Box>
            </Box>
        </Drawer>
    );
};

export default BulkTerritoriesSelection;