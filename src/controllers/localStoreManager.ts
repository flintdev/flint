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

    setRecentProjects = (projectDirs: string[]) => {
        localStorage.setItem('recentProjects', JSON.stringify(projectDirs));
    };

    getRecentProjects = (): string[] => {
        let projectDirs = localStorage.getItem('recentProjects');
        if (!projectDirs) return [];
        return JSON.parse(projectDirs);
    };
}

