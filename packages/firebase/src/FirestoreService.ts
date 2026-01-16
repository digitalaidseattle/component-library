import { Entity, EntityService, Identifier, User } from "@digitalaidseattle/core";
import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    getFirestore,
    updateDoc
} from "firebase/firestore";

import { firebaseClient } from "./firebaseClient";

class FirestoreService<T extends Entity> implements EntityService<T> {
    collectionName = "player";
    db = getFirestore(firebaseClient);

    constructor(collectionName: string) {
        this.collectionName = collectionName;
    }


    // Get all documents from a collection
    async getAll(count?: number, select?: string, mapper?: (json: any) => T): Promise<T[]> {
        const querySnapshot = await getDocs(collection(this.db, this.collectionName));
        return querySnapshot.docs.map(doc => {
            return {
                ...doc.data(),
                id: doc.id
            } as T;
        });
    }

    // Update a document to a collection
    async getById(id: string, select?: string, mapper?: (json: any) => T): Promise<T> {
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
    async batchInsert(entities: T[], select?: string, mapper?: (json: any) => T, user?: User): Promise<T[]> {
        try {
            const docRef = await addDoc(collection(this.db, this.collectionName), entities);
            // FIXME add ID to docRef instead
            return entities
        } catch (e) {
            console.error("Error adding document: ", e);
            throw e;
        }
    }

    // Add a document to a collection
    async insert(entity: T, select?: string, mapper?: (json: any) => T, user?: User): Promise<T> {
        try {
            const docRef = await addDoc(collection(this.db, this.collectionName), entity);
            return {
                ...docRef.toJSON(),
                id: docRef.id
            } as T;
        } catch (e) {
            console.error("Error adding document: ", e);
            throw e;
        }
    }

    // Update a document to a collection
    async update(
        entityId: Identifier,
        updatedFields: Partial<T>,
        select?: string,
        mapper?: (json: any) => T,
        user?: User): Promise<T> {
        try {
            const docRef = doc(this.db, this.collectionName, entityId as string);
            updateDoc(docRef, updatedFields as any);
            return { ...updatedFields } as T
        } catch (e) {
            console.error("Error updating document: ", e);
            throw e;
        }
    }

    async delete(entityId: Identifier): Promise<void> {
        console.log('delete', entityId)
        return deleteDoc(doc(this.db, this.collectionName, entityId as string));
    }

}

export { FirestoreService };

    export type { Entity };

