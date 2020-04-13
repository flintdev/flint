// src/migrations/migrationHandler.ts

import {UIDataManager} from "../controllers/ui/uiDataManager";
import {revise as reviseUI} from './ui/revise';

export class MigrationHandler {
    uiDataManager: UIDataManager;
    constructor(projectDir: string) {
        this.uiDataManager = new UIDataManager(projectDir);
    }

    private migrateUIConfigData = async () => {
        let configData = await this.uiDataManager.fetchConfigData();
        if (!configData) return;
        configData = await reviseUI(configData);
        if (!configData) return;
        await this.uiDataManager.saveConfigData(configData);
    };

    migrate = async () => {
        await this.migrateUIConfigData();
    };
}