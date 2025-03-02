// this is a function which creates aa random id for each project
import {v4 as uuidv4} from 'uuid';

function Generate() {
  const id = uuidv4();
  return id;
}

export {Generate};