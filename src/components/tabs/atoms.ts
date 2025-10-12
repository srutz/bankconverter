import { atom } from 'jotai'

export type Editor = {
    name: string;
    filename: string;
    content: string;
}

export const editorsAtom = atom <Editor[]>([]);

