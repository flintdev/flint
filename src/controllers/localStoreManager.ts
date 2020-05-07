// src/controllers/localStoreManager.ts

export class LocalStorageManager {
    setProjectDir(projectDir: string) {
        localStorage.projectDir = projectDir;
    }

    clearProjectDir() {
        localStorage.removeItem('projectDir');
    }

    getProjectDir(): string {
        return localStorage.projectDir;
    }
}

