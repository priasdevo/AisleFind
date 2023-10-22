import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export default class Item {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    title!: string;

    @Column()
    description?: string;

    @Column()
    searchCount?: number;

    @Column()
    layout_id!: number;
}

export interface IItem {
    id: number,
    title: string,
    description?: string,
    searchCount?: number,
    layout_id: string
}