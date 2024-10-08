import React, {useCallback, useEffect, useState} from "react";
import 'react-json-view-lite/dist/index.css';
import DataProvider from "../components/DataProvider.tsx";
import {ChildProps} from "../types.ts";
import {createProtein, deleteProtein, getProtein, listProteins, updateProtein} from "../commands/proteins.ts";
import EmptyPage from "../components/EmptyPage.tsx";
import Collection from "../components/Collection.tsx";
import {Protein} from "../../../enzymeml-ts/src";
import ProteinForm from "./ProteinForm.tsx";
import DetailView from "../components/DetailView.tsx";
import {ListenToEvent, setCollectionIds} from "../tauri/listener.ts";

// @ts-ignore
const ProteinContext = React.createContext<ChildProps<Vessel>>({})

export default function Proteins() {

    // States
    const [proteins, setProteins] = useState<[string, string][]>([]);

    // State handlers
    const setState = useCallback(() => {
        setCollectionIds(listProteins, setProteins);
    }, [listProteins, setProteins]);

    // Fetch items on mount
    useEffect(() => setState(), []);
    useEffect(() => ListenToEvent("update_proteins", setState), []);

    // Create the items for the Collapsible component
    const items = proteins.map(([id]) => {
        return (
            <DataProvider<Protein>
                key={`protein_${id}`}
                targetKey={`protein_${id}`}
                id={id}
                fetchObject={getProtein}
                updateObject={updateProtein}
                deleteObject={deleteProtein}
                context={ProteinContext}
            >
                <div id={id}>
                    <DetailView context={ProteinContext}
                                placeholder={"Protein"}
                                nameKey={"name"}
                                FormComponent={ProteinForm}
                                listOfIds={proteins}
                    />
                </div>
            </DataProvider>
        );
    });

    if (proteins.length === 0) {
        return (
            <EmptyPage type={"Protein"}
                       handleCreate={createProtein}/>
        );
    }

    return (
        <Collection items={items}
                    handleCreateObject={createProtein}
                    type={"Protein"}/>
    );
}