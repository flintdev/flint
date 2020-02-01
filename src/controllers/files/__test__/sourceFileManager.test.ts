// src/controllers/files/__test__/sourceFileManager.test.ts

import {SourceFileManager} from "../sourceFileManager";

test('get tree data', () => {
    const rootDir = '/Users/naitianliu/Flint/test12';
    const treeData = new SourceFileManager(rootDir).getTreeData();
    console.log(treeData);
});
