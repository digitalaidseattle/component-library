import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, getFirestore, updateDoc, writeBatch } from "firebase/firestore";
import { v4 as uuidv4 } from 'uuid';
import { firebaseClient } from "./firebaseClient";

type Entity = {
    id: string | undefined;
}

class FirestoreService<T extends Entity> {
    collectionName = "player";
    db = getFirestore(firebaseClient);

    constructor(collectionName: string) {
        this.collectionName = collectionName;
    }

    // Add a document to a collection
    add = async (entity: T): Promise<void> => {
        try {
            entity.id = uuidv4();
            const docRef = await addDoc(collection(this.db, this.collectionName), entity);
            console.log("Document written with ID: ", docRef.id);
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    }

    // Update a document to a collection
    getById = async (id: string): Promise<T> => {
        try {
            const docRef = await getDoc(doc(this.db, this.collectionName, id));
            if (docRef.exists()) {
                return {
                    ...docRef.data(),
                    id: docRef.id
                } as T;
            } else {
                throw Error(`entity with id: ${id}, does not exist`)
            }
        } catch (e) {
            console.error("Error getting document: ", e);
            throw e;
        }
    }

    // Update a document to a collection
    update = async (entity: T): Promise<void> => {
        try {
            if (entity.id) {
                const docRef = doc(this.db, this.collectionName, entity.id);
                return updateDoc(docRef, entity);
            }
            throw new Error('Entity does not have an id.')
        } catch (e) {
            console.error("Error updating document: ", e);
        }
    }

    delete = async (entity: T): Promise<void> => {
        if (entity.id) {
            return deleteDoc(doc(this.db, this.collectionName, entity.id));
        }
        throw new Error('Entity does not have an id.')
    }

    // Get all documents from a collection
    getAll = async (): Promise<T[]> => {
        const querySnapshot = await getDocs(collection(this.db, this.collectionName));
        return querySnapshot.docs.map(doc => {
            return {
                ...doc.data(),
                id: doc.id
            } as T;
        });
    }

    addBatch = (entities: T[]) => {
        const batch = writeBatch(this.db);
        entities.forEach(e => {
            e.id = uuidv4();
            const docRef = doc(this.db, this.collectionName, e.id);
            batch.set(docRef, e);
        })
        return batch.commit();
    }
}

export { FirestoreService };

export type { Entity };
