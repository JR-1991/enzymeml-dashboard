import React, {useEffect, useState} from "react";
import {listen} from "@tauri-apps/api/event";
import DataProvider from "../components/DataProvider.tsx";
import {ChildProps} from "../types.ts";
import {Reaction} from "../../../enzymeml-ts/src";
import {createReaction, deleteReaction, getReaction, listReactions, updateReaction} from "../commands/reactions.ts";
import DetailView from "../components/DetailView.tsx";
import ReactionForm from "./ReactionForm.tsx";
import FloatingCreate from "../components/FloatingCreate.tsx";
import Collection from "../components/Collection.tsx";
import EmptyPage from "../components/EmptyPage.tsx";

// @ts-ignore
const ReactionContext = React.createContext<ChildProps<Reaction>>({})

export default function Reactions() {

    // States
    const [reactions, setReactions] = useState<[string, string][]>([]);

    // Fetch small molecules on load
    useEffect(() => {
        // Fetch small molecule IDs
        listReactions().then(
            (data) => {
                setReactions(data);
            }
        ).catch(
            (error) => {
                console.error('Error:', error);
            }
        )
    }, []);

    // Re-fetch proteins on update
    useEffect(() => {
        const unlisten = listen('update_reactions', () => {
            listReactions().then(
                (data) => {
                    setReactions(data);
                }
            ).catch(
                (error) => {
                    console.error('Error:', error);
                }
            )
        });

        // Clean up the event listener on component unmount
        return () => {
            unlisten.then((fn) => fn());
        };
    }, []);

    const handleCreateReaction = () => {
        createReaction().then(
            () => {
                console.log('Reaction created');
            }
        )
    }

    // Create the items for the Collapsible component
    const items = reactions.map(([id]) => {
        return (
            <DataProvider<Reaction>
                key={`reaction_${id}`}
                targetKey={`reaction_${id}`}
                id={id}
                fetchObject={getReaction}
                updateObject={updateReaction}
                deleteObject={deleteReaction}
                context={ReactionContext}
            >
                <DetailView context={ReactionContext}
                            placeholder={"Reaction"}
                            nameKey={"name"}
                            FormComponent={ReactionForm}/>
            </DataProvider>
        );
    });

    if (reactions.length === 0) {
        return (
            <EmptyPage type={"Reaction"} handleCreate={handleCreateReaction}/>
        );
    }
    
    return (
        <div className={"flex flex-col"}>
            <FloatingCreate handleCreate={handleCreateReaction} type={"Reaction"}/>
            <Collection items={items}/>
        </div>
    );
}