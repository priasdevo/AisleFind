// store.ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import mongoose from "mongoose";

@Entity('store')
export default class Store {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    title!: string;

    @Column({ default: '' })
    description?: string;

    @Column({ type: 'float' })
    size_x!: number;

    @Column({ type: 'float' })
    size_y!: number;

    @Column()
    owner_id!: string; //mongoose.Types.ObjectId;
}

export interface IStore {
    id: number;
    title: string;
    description?: string;
    size_x: number;
    size_y: number;
    owner_id: string; //mongoose.Types.ObjectId;
}
