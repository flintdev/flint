// src/controllers/model/dataConverter.ts

interface BlockItem {
    id: string,
    name: string,
    dataType: "string" | "integer" | "object" | "boolean" | "string[]" | "integer[]" | "$ref" | "$ref[]",
    required: boolean,
    indexed: boolean,
}

interface BlockData {
    name: string,
    items: BlockItem[],
    refs: {
        [key: string]: string
    }
}

interface BlockDataMap {
    [key: string]: BlockData
}

export class DataConverter {
    editorData: any;
    modelName: string;
    blockDataMap: BlockDataMap;
    constructor(editorData: any, modelName: string) {
        this.editorData = editorData;
        this.modelName = modelName;
    }

    convertToOpenAPISchema = () => {

    };

    convertToCRDSpec = () => {

    };

    private getBlockDataMap = (): BlockDataMap => {
        const blockData: BlockData[] = this.editorData[this.modelName]?.blockData;
        if (!blockData || blockData.length === 0) return {};

    };
}