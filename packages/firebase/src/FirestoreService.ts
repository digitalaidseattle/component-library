import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    getFirestore,
    updateDoc,
    writeBatch
} from "firebase/firestore";
import { v4 as uuidv4 } from 'uuid';
import { Entity, EntityService, Identifier, User } from "@digitalaidseattle/core";

import { firebaseClient } from "./firebaseClient";

class FirestoreService<T extends Entity> implements EntityService<T> {
    collectionName = "player";
    db = getFirestore(firebaseClient);

    constructor(collectionName: string) {
        this.collectionName = collectionName;
    }


    // Get all documents from a collection
    async getAll(count?: number, select?: string): Promise<T[]> {
        const querySnapshot = await getDocs(collection(this.db, this.collectionName));
        return querySnapshot.docs.map(doc => {
            return {
                ...doc.data(),
                id: doc.id
            } as T;
        });
    }

    // Update a document to a collection
    async getById(id: string, select?: string): Promise<T> {
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

    // Add a document to a collection
    async batchInsert(entities: T[], select?: string, user?: User): Promise<T[]> {
        try {
            entities.forEach(entity => entity.id = uuidv4());
            const docRef = await addDoc(collection(this.db, this.collectionName), entities);
            return entities
        } catch (e) {
            console.error("Error adding document: ", e);
            throw e;
        }
    }


    // Add a document to a collection
    async insert(entity: T, select?: string, user?: User): Promise<T> {
        try {
            entity.id = uuidv4();
            const docRef = await addDoc(collection(this.db, this.collectionName), entity);
            return entity
        } catch (e) {
            console.error("Error adding document: ", e);
            throw e;
        }
    }

    // Update a document to a collection
    async update(
        entityId: Identifier,
        updatedFields: T,
        select?: string,
        user?: User): Promise<T> {
        try {
            const docRef = doc(this.db, this.collectionName, entityId as string);
            updateDoc(docRef, updatedFields as any);
            return updatedFields as T
        } catch (e) {
            console.error("Error updating document: ", e);
            throw e;
        }
    }

    async delete(entityId: Identifier): Promise<void> {
        console.log('delete', entityId)
        return deleteDoc(doc(this.db, this.collectionName, entityId as string));
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
