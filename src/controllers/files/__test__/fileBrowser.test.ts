// src/controllers/files/__test__/fileBrowser.test.ts

import {FileBrowser} from "../fileBrowser";

test('get tree data', () => {
    const rootDir = '/Users/naitianliu/Flint/test12';
    const treeData = new FileBrowser(rootDir).getTreeData();
    console.log(treeData);
});
