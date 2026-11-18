import { DataAccessObject, DataAccessOptions, Entity, Identifier, PageInfo, QueryModel } from "@digitalaidseattle/core";
import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    Firestore,
    getDoc,
    getDocs,
    getFirestore,
    query,
    QueryConstraint,
    setDoc,
    updateDoc,
    where
} from "firebase/firestore";

import { FirebaseApp } from "firebase/app";

export class FirestoreDao<T extends Entity> implements DataAccessObject<T> {

    collectionName: string;
    db: Firestore;
    opts: DataAccessOptions<T> | undefined;

    constructor(collectionName: string, firebaseClient: FirebaseApp, opts?: DataAccessOptions<T>) {
        this.collectionName = collectionName;
        this.db = getFirestore(firebaseClient);
        this.opts = opts;
    }

    async find(queryModel: QueryModel, opts?: DataAccessOptions<T> | undefined): Promise<PageInfo<T>> {
        const constraints: QueryConstraint[] = [];
        // Filters
        queryModel.filterModel?.items.forEach(filter => {
            if (
                filter.value !== undefined &&
                filter.value !== null &&
                filter.value !== ""
            ) {
                constraints.push(
                    where(
                        filter.field,
                        filter.operator as any,
                        filter.value
                    )
                );
            }
        });

        // TODO Sorting
        // if (queryModel.sortField) {
        //     constraints.push(
        //         orderBy(
        //             queryModel.sortField,
        //             queryModel.sortDirection as any
        //         )
        //     );
        // }

        // TODO Paging
        // constraints.push(limit(queryModel.pageSize));
        // constraints.push(offset(queryModel.page * queryModel.pageSize));

        const q = query(
            collection(this.db, this.collectionName),
            ...constraints
        );

        const snapshot = await getDocs(q);
        const elements = snapshot.docs.map(
            doc =>
                ({
                    id: doc.id,
                    ...doc.data(),
                }) as T

        );
        return { rows: elements.map(elem => this.mapJson(elem)), totalRowCount: elements.length };
    }

    // Get all documents from a collection
    async getAll(opts?: DataAccessOptions<T>): Promise<T[]> {
        const querySnapshot = await getDocs(collection(this.db, this.collectionName));
        const elements = querySnapshot.docs.map(doc => {
            return {
                ...doc.data(),
                id: doc.id
            } as T;
        });
        return elements.map(elem => this.mapJson(elem));
    }

    // Update a document to a collection
    async getById(id: Identifier, opts?: DataAccessOptions<T>): Promise<T> {
        try {
            const docRef = await getDoc(doc(this.db, this.collectionName, id as string));
            if (docRef.exists()) {
                const element = {
                    ...docRef.data(),
                    id: docRef.id
                } as T;
                return this.mapJson(element);
            } else {
                throw Error(`entity with id: ${id}, does not exist`)
            }
        } catch (e) {
            console.error("Error getting document: ", e);
            throw e;
        }
    }

    // Add a document to a collection
    async batchInsert(entities: T[], opts?: DataAccessOptions<T>): Promise<T[]> {
        try {
            const unMapped = entities.map(entity => this.unmapEntity(entity));
            const docRef = await addDoc(collection(this.db, this.collectionName), unMapped);
            // FIXME add ID to docRef instead
            return entities
        } catch (e) {
            console.error("Error adding document: ", e);
            throw e;
        }
    }

    // Add a document to a collection
    async insert(entity: T, opts?: DataAccessOptions<T>): Promise<T> {
        try {
            const unMapped = this.unmapEntity(entity);
            const docRef = await addDoc(collection(this.db, this.collectionName), unMapped);
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
    async update(entityId: Identifier, updatedFields: Partial<T>, opts?: DataAccessOptions<T>): Promise<T> {
        try {
            const docRef = doc(this.db, this.collectionName, entityId as string);
            const unMapped = this.unmapEntity(updatedFields as T);
            updateDoc(docRef, unMapped as any);
            return this.getById(entityId);
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
        return this.getById(entity.id!);
    }

    mapJson(json: any): T {
        if (this.opts && this.opts.mapper) {
            return this.opts.mapper(json);
        } else {
            return json;
        }
    }

    unmapEntity(entity: T): any {
        if (this.opts && this.opts.unmapper) {
            return this.opts.unmapper(entity);
        }
        return entity
    }

}


