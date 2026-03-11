import { Entity, EntityService, Identifier, User } from "@digitalaidseattle/core";
import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    Firestore,
    getDoc,
    getDocs,
    getFirestore,
    setDoc,
    updateDoc
} from "firebase/firestore";

import { FirebaseApp } from "firebase/app";
import { firebaseClient as defaultFirebaseClient } from "./firebaseClient";

class FirestoreService<T extends Entity> implements EntityService<T> {
    collectionName: string;
    db: Firestore;

    constructor(collectionName: string, firebaseClient?: FirebaseApp) {
        this.collectionName = collectionName;
        this.db = getFirestore(firebaseClient ?? defaultFirebaseClient);
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
        return deleteDoc(doc(this.db, this.collectionName, entityId as string));
    }

    async upsert(entity: T): Promise<T> {
        await setDoc(doc(this.db, this.collectionName, entity.id as string), entity)
        return entity;
    }

}

export { FirestoreService };

