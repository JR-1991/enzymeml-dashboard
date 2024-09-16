import React from "react";
import {Layout, theme} from "antd";
import {Content} from "antd/lib/layout/layout";
import {AnimatePresence, motion} from "framer-motion";
import {ChildProps, Identifiable} from "../types.ts";
import useAppStore from "../stores/appstore.ts";
import DetailHeader from "./DetailHeader.tsx";
import NotificationProvider from "./NotificationProvider.tsx";

interface DetailViewProps<T extends Identifiable> {
    placeholder: string,
    context: React.Context<ChildProps<T>>,
    nameKey: string,
    FormComponent: React.ComponentType<{ context: React.Context<ChildProps<T>> }>
}

export default function DetailView<T extends Identifiable>(
    {
        placeholder,
        context,
        nameKey,
        FormComponent
    }: DetailViewProps<T>
): React.ReactElement {

    // Hooks
    const {token} = theme.useToken();

    // Context
    const props = React.useContext(context)

    // States
    const darkMode = useAppStore(state => state.darkMode);

    if (!props) {
        return <h1>No context given. Please contact support.</h1>
    }

    let id: string

    if ("id" in props.data && props.data.id) {
        id = props.data.id
    } else if (props.alternativeIdCol && props.alternativeIdCol in props.data) {
        // @ts-ignore
        id = props.data[props.alternativeIdCol]
    } else {
        return <h1>No ID available. Please contact support</h1>
    }

    return (
        <NotificationProvider>
            <Layout className={"flex flex-col overflow-auto"}>
                <Content>
                    <div className={"shadow-sm mb-2"} style={{
                        padding: 24,
                        background: token.colorBgContainer,
                        borderRadius: token.borderRadiusLG,
                        borderBottom: 1,
                        borderStyle: 'solid',
                        borderColor: darkMode ? token.colorBgContainer : token.colorBorder,
                        color: token.colorText,
                    }}>
                        <div className="flex flex-col gap-2">
                            <DetailHeader
                                id={id}
                                speciesName={props.data[nameKey]}
                                placeholder={placeholder}
                                handleDeleteObject={props.handleDeleteObject}
                                setLocked={props.setLocked}
                            />
                            <AnimatePresence>
                                <motion.div>
                                    <FormComponent context={context}/>
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>
                </Content>
            </Layout>
        </NotificationProvider>
    );
}