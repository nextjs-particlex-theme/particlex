import {getAllPostsPaths} from "@/api/hexo-api";
import {test} from '@jest/globals';

test('Test Resolve Folder', async () => {
  const paths = await getAllPostsPaths()
  paths[0].categories.toArray()[0].name
  console.log(paths);
})