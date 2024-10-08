import {Col, Form, FormListFieldData, FormListOperation, Row, Select, SelectProps} from "antd";
import {CloseOutlined} from "@ant-design/icons";
import QuantityForm from "../../components/QuantityForm";
import {UnitTypes} from "../../commands/units";

interface InitialsFieldProps {
    field: FormListFieldData;
    subOpt: FormListOperation;
    availableSpecies: SelectProps["options"];
    handleUpdateObject: () => void;
}

export default function InitialsField(
    {
        field,
        subOpt,
        availableSpecies,
        handleUpdateObject,
    }: InitialsFieldProps) {
    return (
        <Row gutter={16} align="middle">
            <Col span={14}>
                <Form.Item
                    name={[field.name, 'species_id']}
                    style={{marginBottom: 0}}
                >
                    <Select
                        options={availableSpecies}
                        placeholder="Species"
                        onChange={handleUpdateObject}
                        style={{width: '100%'}}
                    />
                </Form.Item>
            </Col>
            <Col span={8}>
                <QuantityForm
                    name={[field.name, 'initial']}
                    unitPath={[field.name, 'data_unit']}
                    label="Initial"
                    unitTypes={[UnitTypes.CONCENTRATION]}
                    required={true}
                    handleUpdateObject={handleUpdateObject}
                />
            </Col>
            <Col span={1} style={{textAlign: 'left'}}>
                <CloseOutlined
                    onClick={() => {
                        subOpt.remove(field.name);
                    }}
                    style={{cursor: 'pointer'}}
                />
            </Col>
        </Row>
    );
}