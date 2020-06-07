// src/controllers/model/dataConverter.ts

import {bool} from "prop-types";
import {str} from "crc-32";

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
        this.blockDataMap = this.getBlockDataMap();
    }

    convertToOpenAPISchema = () => {
        return this.getBlockSchema(this.modelName);
    };

    private getBlockDataMap = (): BlockDataMap => {
        const blockData: BlockData[] = this.editorData?.blockData;
        if (!blockData || blockData.length === 0) return {};
        let blockDataMap: BlockDataMap = {};
        blockData.forEach(data => {
            blockDataMap[data.name] = data;
        });
        return blockDataMap;
    };

    private getBlockSchema = (blockName: string) => {
        const data = this.blockDataMap[blockName];
        let properties: any = {};
        const {items, refs} = data;
        items.forEach(item => {
            if (item.dataType  === 'string' || item.dataType === 'integer' || item.dataType === "boolean" || item.dataType === "object") {
                const type = item.dataType;
                properties[item.name] = {type};
            } else if (item.dataType === "string[]") {
                properties[item.name] = {
                    type: 'array',
                    items: {type: 'string'}
                };
            } else if (item.dataType === "integer[]") {
                properties[item.name] = {
                    type: 'array',
                    items: {type: 'integer'}
                };
            } else if (item.dataType === "$ref") {
                const refName = refs[item.name];
                properties[item.name] = this.getBlockSchema(refName);
            } else if (item.dataType === "$ref[]") {
                const refName = refs[item.name];
                properties[item.name] = {
                    type: 'array',
                    items: this.getBlockSchema(refName)
                }
            }
        });
        return {type: 'object', properties};
    };

}